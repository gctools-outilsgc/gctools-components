/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import 'babel-polyfill';
import { Component } from 'react';

import PropTypes from 'prop-types';
import Oidc from 'oidc-client';

/**
 * The single sign-on component is a drop-in solution to provide SSO for any
 * OpenID compatible  site.  This component provides a complete "client-side
 * only" authentication solution using `oidc-client`, and can also be
 * customized to defer authentication to a backend server, or to orchestrate
 * remote authentication using the `RAP` protocol using a hybrid client/server
 * design.
 *
 */
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: props.profile,
    };
    if (!props.dumb) {
      const config = Object.assign({
        authority: 'http://localhost:8080',
        client_id: 'js',
        redirect_uri: 'http://localhost:8081/#!callback',
        response_type: 'id_token token',
        scope: 'openid profile api1',
        post_logout_redirect_uri: 'http://localhost:8081/#!logout',
        silent_redirect_uri: 'http://localhost:8081/#!silent',
      }, props.oidcConfig);
      this.oidc = new Oidc.UserManager(config);

      this.oidc.events.addUserLoaded((user) => {
        if (this.props.onUserLoaded) {
          this.props.onUserLoaded(user);
        }
      });

      this.oidc.events.addUserUnloaded(() => {
        this.setState({
          profile: undefined,
        });

        if (this.props.onUserUnloaded) {
          this.props.onUserUnloaded();
        }
      });

      this.oidc.events.addUserSignedOut(() => {
        const doSignout = async () => {
          if (this.props.synchronizedLogout) {
            await this.oidc.removeUser();
          }
          if (this.props.onUserSignedOut) {
            this.props.onUserSignedOut();
          }
        };
        doSignout();
      });

      this.oidc.events.addAccessTokenExpiring(() => {
        this.silentRenew();
        if (this.props.onAccessTokenExpiring) {
          this.props.onAccessTokenExpiring();
        }
      });

      this.oidc.events.addAccessTokenExpired(() => {
        this.silentRenew();
        if (this.props.onAccessTokenExpired) {
          this.props.onAccessTokenExpired();
        }
      });

      this.oidc.events.addSilentRenewError(() => {
        if (this.props.onSilentRenewError) {
          this.props.onSilentRenewError();
        } else {
          console.error('There was an error renewing your access token');
          console.info('You should refresh the page to continue.');
        }
      });


      // Respond to client side callback URLs
      const methods = ['#!callback', '#!logout', '#!silent'];
      for (let i = 0; i < methods.length; i += 1) {
        const method = methods[i];
        // Change URL so it can be parsed by oidc-client
        if ((window.location.hash.indexOf(method) === 0) &&
          (window.location.hash.indexOf('?') === -1)) {
          window.location.hash =
            `${method}&${window.location.hash.split(method)[1]}`;
        }
        if (window.location.hash.indexOf(method) === 0) {
          switch (method) {
            case '#!silent': {
              setTimeout(() => {
                this.oidc.signinSilentCallback();
              }, 200);
              break;
            }
            case '#!callback': {
              setTimeout(() => {
                this.oidc.signinPopupCallback();
              }, 0);
              break;
            }
            case '#!logout': {
              setTimeout(() => {
                this.oidc.signoutPopupCallback();
                window.close();
              }, 0);
              break;
            }
            default: {
              throw new Error('Unsupported callback');
            }
          }
          // document.open();
        }
      }
    }
    this.silentRenew = this.silentRenew.bind(this);
    this._click = this._click.bind(this);
    this.isLoggedIn = this.isLoggedIn.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillMount() {
    if (!this.props.dumb) {
      const autoLogin = async () => {
        if (this.props.silentRenewOnMount === 'always') {
          await this.silentRenew();
        } else if (this.props.silentRenewOnMount === 'not-logged-in') {
          const is = await this.isLoggedIn();
          if (!is) {
            await this.silentRenew();
          }
        }
        if (this.props.verifyLoginOnMount === true) {
          const user = await this.oidc.getUser();
          if (user) {
            this.setState({
              profile: user.profile,
            });
            if (this.props.onUserFetched) {
              this.props.onUserFetched(user);
            }
          }
        } else if (this.props.verifyLoginOnMount) {
          this.props.verifyLoginOnMount(this);
        }
      };
      autoLogin();
    }
  }

  componentWillReceiveProps(next) {
    if ((next.profile) || (this.props.profile)) {
      this.setState({
        profile: next.profile,
      });
    }
  }

  /**
   * Open a login dialog the user can use to perform a login on
   * IdentityServer.
   */
  async login() {
    if (this.props.dumb) {
      throw new Error('You cannot call `login` on a dumb component');
    }
    const user = await this.oidc.signinPopup();
    if (user) {
      this.setState({
        profile: user.profile,
      });
    }
  }

  /**
   * Open a logout dialog on IdentityServer that logs the user off.
   */
  async logout() {
    if (this.props.dumb) {
      throw new Error('You cannot call `logout` on a dumb component');
    }
    await this.oidc.signoutPopup();
  }

  /**
   * Log the user out of the current site only.
   */
  async localLogout() {
    if (this.props.dumb) {
      throw new Error('You cannot call `localLogout` on a dumb component');
    }
    await this.oidc.removeUser();
    this.setState({
      profile: undefined,
    });
  }

  /**
   * Initiate a silent revew call to IdentityServer.  If the user has an
   * active session on IdentityServer, he will be logged in.
   * @returns {Promise} Resolves to true if logged in, false otherwise.
   */
  async silentRenew() {
    if (this.props.dumb) {
      throw new Error('You cannot call `silentRenew` on a dumb component');
    }
    const user = await this.oidc.signinSilent();
    if (user) {
      return true;
    }
    return false;
  }

  /**
   * Get the user's current logged in status.
   * @returns {Promise} Resolves to true if logged in, false otherwise.
   */
  async isLoggedIn() {
    if (this.props.dumb) {
      throw new Error('You cannot call `isLoggedIn` on a dumb component');
    }
    const user = await this.oidc.getUser();
    if (user) {
      return true;
    }
    return false;
  }

  _click(e) {
    if (this.props.dumb
      && (!this.props.onLoginClick || !this.props.onLogoutClick)) {
      console.warn( // eslint-disable-line
        `You must implement \`onLoginClick\` and
        \`onLogoutClick\` when using the dumb property.`);
      return;
    }
    if (!this.state.profile) {
      if (this.props.onLoginClick) {
        this.props.onLoginClick(e, this);
      } else {
        this.login();
      }
    } else if (this.props.onLogoutClick) {
      this.props.onLogoutClick(e, this);
    } else {
      this.logout();
    }
  }

  render() {
    return this.props.children({
      onClick: this._click,
    });
  }
}

Login.defaultProps = {
  dumb: false,
  profile: undefined,
  oidcConfig: {
    authority: 'http://localhost:8080',
    client_id: 'js',
    redirect_uri: 'http://localhost:8081/#!callback',
    response_type: 'id_token token',
    scope: 'openid profile api1',
    post_logout_redirect_uri: 'http://localhost:8081/#!logout',
    silent_redirect_uri: 'http://localhost:8081/#!silent',
  },
  onLoginClick: undefined,
  onLogoutClick: undefined,
  verifyLoginOnMount: true,
  silentRenewOnMount: 'not-logged-in',
  synchronizedLogout: true,
  onUserLoaded: undefined,
  onUserFetched: undefined,
  onUserUnloaded: undefined,
  onUserSignedOut: undefined,
  onAccessTokenExpiring: undefined,
  onAccessTokenExpired: undefined,
  onSilentRenewError: undefined,
};

Login.propTypes = {
  /** A function that renders the login button.  (render-prop pattern) */
  children: PropTypes.func.isRequired,
  /** Completely disables built-in OIDC functionality, requiring you to
    provide your handlers for `onLoginClick` and `onLogoutClick` */
  dumb: PropTypes.bool,
  /** Profile object */
  profile: PropTypes.object, // eslint-disable-line
  /** Set of configuration parameters to pass to the internal oidc-client
    instance.  Refer to
    https://github.com/IdentityModel/oidc-client-js/blob/dev/src/OidcClientSettings.js for more information. */ // eslint-disable-line
  oidcConfig: PropTypes.shape({}),
  /** Override the action when the login button is clicked.  (If you
    specify this property, the default `login` action will NOT fire, you
    must do so manually.) */
  onLoginClick: PropTypes.func,
  /** Override the action when the logout button is clicked.  (If you
    specify this property, the default `logout` action will NOT fire, you
    must do so manually.) */
  onLogoutClick: PropTypes.func,
  /** If `true` an automatic check to see if the user is logged occurs on
   * mount. */
  verifyLoginOnMount: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  /** Controls whether or not a silent review occurs when the component is
    mounted.  One of:
    `always`: the silent renew endpoint will be hit on every page load,
    `not-logged-in\`: only attempts to silent review if the user is not known
      to be logged in,
    `never`: will not attempt to silent-renew. */
  silentRenewOnMount: PropTypes.oneOf(['always', 'not-logged-in', 'never']),
  /** If true, will automatically sign the user out if they sign-out
    from the identity server (or another SSO enabled site) */
  synchronizedLogout: PropTypes.bool,
  /** Raised when a user session has been established. */
  onUserLoaded: PropTypes.func,
  /** Raised if `verifyLoginOnMount` is `true` and the user is logged in. */
  onUserFetched: PropTypes.func,
  /** Raised when a user session has been terminated. */
  onUserUnloaded: PropTypes.func,
  /** Raised when the user logs out of the identity server. */
  onUserSignedOut: PropTypes.func,
  /** Raised prior to the access token expiring. */
  onAccessTokenExpiring: PropTypes.func,
  /** Raised after the access token has expired. */
  onAccessTokenExpired: PropTypes.func,
  /** Raised when the automatic silent renew has failed. */
  onSilentRenewError: PropTypes.func,
};

export default Login;

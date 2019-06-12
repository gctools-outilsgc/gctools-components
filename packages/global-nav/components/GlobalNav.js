import React from 'react';
import PropTypes from 'prop-types';

import '@gctools-components/aurora-css/css/aurora.min.css';
import '../css/style.css';
import '../assets/utils.js';
import MediaQuery from 'react-responsive';

import SidebarToggle from './SidebarToggle';
import LoginDropdown from './LoginDropdown';
import AppListDropdown from './AppListDropdown';
import ToggleLangDropdown from './ToggleLangDropdown';
import HelpDropdown from './HelpDropdown';
import NotificationDropdown from './NotificationDropdown';
import TopNavBar from './TopNavBar';

import Canada from '../assets/wmms-spl.svg';

/**
 * Global navigation react component for OADW apps.
 */

class GlobalNav extends React.Component {
  constructor() {
    super();
    this.state = {
      count: 0
    };
    this.updateCount = this.updateCount.bind(this);
  };

  updateCount(number) {
    this.setState({
      count: number
    })
  }

  render(){
    return (
      <div>
        <MediaQuery query="(min-width: 768px)">
          <div className="gn-nav">
            <div className="gn-skip-to">
              <a 
                className="sr-only sr-only-focusable"
                href="#gn-main"
              >
                Skip to main content
              </a>
            </div>
            <div>
              <TopNavBar
                currentApp={this.props.currentApp}
                minimized={this.props.minimized}
                search={this.props.search}
                currentLang={this.props.currentLang}
                userObject={this.props.currentUser}
                oidcConfig={this.props.oidcConfig}
                doLogin={this.props.doLogin}
              />
              <MediaQuery query="(min-width: 1024px)">
                <SidebarToggle
                  minimized={this.props.minimized}
                  onResultClick={(e) => {
                    this.props.onToggleResultClick(e);
                    console.log(e);
                  }}
                />
              </MediaQuery>
            </div>
            <div className={"gn-holder " + (this.props.minimized ? 'gn-minimize' : 'show')}>
              <LoginDropdown
                userObject={this.props.currentUser}
                oidcConfig={this.props.oidcConfig}
                doLogin={this.props.doLogin}
              />
              <NotificationDropdown
                userObject={this.props.currentUser}
                accessToken={this.props.accessToken}
                count={this.state.count}
                updateCount={this.updateCount}
              />
              <AppListDropdown
                currentApp={this.props.currentApp}
              />
              <ToggleLangDropdown
                currentLang={this.props.currentLang}
                onResultClick={(e) => {
                  //TODO Send e to parent
                  this.props.onLanguageResultClick(e);
                  console.log(e);
                }}
              />
              <HelpDropdown
                currentApp={this.props.currentApp}
                //TODO this could just exist in this component
                windowLocation={window.location.href}
              />
              {this.props.currentUser ? '' :
                this.props.minimized ? '' : (
                <div className="gn-not-logged-cta">
                  <div>Welcome!</div>
                  <div>You are not logged in. Why not? It's free.</div>
                  <div>Calls to action here? That would be great. I'm not sure the copy is final.</div>
                </div>
              )}
              <div className="gn-holder-foot">
                <img src={Canada} alt="Canada" className="float-right" />
              </div>
            </div>
          </div>
        </MediaQuery>
        <MediaQuery query="(max-width: 768px)">
          <div className="gn-nav">
            <div className="gn-skip-to">
              <a 
                className="sr-only sr-only-focusable"
                href="#gn-main"
              >
                Skip to main content
              </a>
            </div>
            <TopNavBar
              currentApp={this.props.currentApp}
              minimized={this.props.minimized}
              search={this.props.search}
              currentLang={this.props.currentLang}
              userObject={this.props.currentUser}
              oidcConfig={this.props.oidcConfig}
              doLogin={this.props.doLogin}
              accessToken={this.props.accessToken}
              hamburgerMenu={this.props.hamburgerMenu}
              onLanguageResultClick={(e) => {
                this.props.onLanguageResultClick(e);
                console.log(e);
              }}
              count={this.state.count}
              updateCount={this.updateCount}
            />
          </div>
        </MediaQuery>
      </div>
    );
  };
};

GlobalNav.defaultProps = {
  currentLang: 'en_CA',
  onLanguageResultClick: () => {},
  currentUser: null,
  currentApp: {},
  accessToken: '',
  oidcConfig: {
    authority: 'http://localhost:8080',
    client_id: 'js',
    redirect_uri: 'http://localhost:8081/#!callback',
    response_type: 'id_token token',
    scope: 'openid profile api1',
    post_logout_redirect_uri: 'http://localhost:8081/#!logout',
    silent_redirect_uri: 'http://localhost:8081/#!silent',
  },
  doLogin: () => {},
  minimized: false,
  onToggleResultClick: () => {},
  search:"",
  hamburgerMenu:true
};

GlobalNav.propTypes = {
  /** This is the current language of the app */
  currentLang: PropTypes.string,
  /** Function will pass the selected language to parent */
  onLanguageResultClick: PropTypes.func,
  /** Information about the current user */
  currentUser: PropTypes.shape({
    /** Logged in user's gcID */
    gcID: PropTypes.string,
    /** Logged in user's name */
    name: PropTypes.string,
    /** Logged in user's avatar */
    avatar: PropTypes.string,
  }),
  /** Logged in user's access token */
  accessToken: PropTypes.string,
  /** Information about the parent App */
  currentApp: PropTypes.shape({
    /** A unique client ID for the App */
    id: PropTypes.string,
    /** The name of the App */
    name: PropTypes.string,
    /** The home page URL of the App */
    homeLink: PropTypes.string,
    /** Logo / Icon / Image url for the App */
    logo: PropTypes.string,
  }),
  /** The Open ID config for the parent App */
  oidcConfig: PropTypes.shape({}),
  /** Login function from the parent App */
  doLogin: PropTypes.func,
  /** Display status for sidebar*/
  minimized: PropTypes.bool,
  /** Function will pass the sidebar status to parent */
  onToggleResultClick: PropTypes.func,
  /**Send search keyword */
  search: PropTypes.string,
  /** Status of the hamburger menu */
  hamburgerMenu: PropTypes.bool
};

export default GlobalNav;

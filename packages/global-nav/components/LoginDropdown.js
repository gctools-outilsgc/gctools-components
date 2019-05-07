import React from 'react';
import PropTypes from 'prop-types';

import Login from '@gctools-components/gc-login';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from 'reactstrap';

import signInIcon from '../assets/sign-in-icon.png';

const LoginDropdown = (props) => {
  const {
    userObject,
    oidcConfig,
    doLogin,
  } = props;

  return (
    <div>
      {userObject ? (
        <UncontrolledDropdown direction="left">
          <DropdownToggle className="gn-dd-btn d-flex">
            <div className="align-self-center">
              <img
                className="gn-avatar"
                src={userObject.avatar}
                alt=""
              />
            </div>
            <div className="align-self-center pl-2">
              {userObject.name}
            </div>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem href={`https://profile.gccollab.ca/p/${userObject.gcID}`}>
              My Profile
            </DropdownItem>
            <DropdownItem href="https://account.gccollab.ca/profile/">
              Reset Password
            </DropdownItem>
            <DropdownItem href="https://account.gccollab.ca/securitypages/">
              Account Settings
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ) : (
        <div>
          <Login
            oidcConfig={oidcConfig}
            onUserLoaded={doLogin}
            onUserFetched={doLogin}
          >
            {({ onClick }) => (
              <Button
                className="gn-dd-btn d-flex"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(e);
                }}
              >
                <div className="align-self-center">
                  <img src={signInIcon} alt="" />
                </div>
                <div className="align-self-center pl-2">
                  Login
                </div>
              </Button>
            )}
          </Login>
        </div>
      )}
    </div>
  );
};

LoginDropdown.defaultProps = {
  userObject: {},
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
};

LoginDropdown.propTypes = {
  /** Information about the logged in user */
  userObject: PropTypes.shape({
    gcID: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string,
  }),
  /** The parent App's openID config */
  oidcConfig: PropTypes.shape({}),
  /** Login method from parent App */
  doLogin: PropTypes.func,
};

export default LoginDropdown;

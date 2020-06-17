import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
// import Login from '@gctools-components/gc-login';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import GenericAvatar from '../assets/user.gif';

const LoginDropdown = (props) => {
  const {
    userObject,
    oidcConfig,
    doLogin,
    closeAll,
    currentLang
  } = props;

  let copy = {}
  if (currentLang == "en_CA") {
    copy = {
      "profile": "My profile",
      "account": "Account settings",
      "logout": "Log-out",
      "login": "Log-in"
    }
  } else {
    copy = {
      "profile": "Mon profil",
      "account": "Paramètres du compte",
      "logout": "Quitter la séance",
      "login": "Se connecter"
    }
  }

  return (
    <div>
      <MediaQuery query="(min-width: 769px)">
        {userObject ? (
          <UncontrolledDropdown direction="left">
            <DropdownToggle className="gn-dd-btn d-flex">
              <div className="align-self-center">
                <img
                  className="gn-avatar"
                  src={userObject.picture ? userObject.picture : GenericAvatar}
                  alt=""
                />
              </div>
              <div className="align-self-center pl-2">
                {userObject.name}
              </div>
            </DropdownToggle>
            <DropdownMenu modifiers={{ computeStyle: { gpuAcceleration: false } }}>
              <DropdownItem href={`https://profile.gccollab.ca/p/${userObject.sub}`}>
                {copy.profile}
              </DropdownItem>
              <DropdownItem href="https://account.gccollab.ca/securitypages/">
                {copy.account}
              </DropdownItem>
              <DropdownItem onClick={(e) => {
                e.stopPropagation();
                if (document.getElementById('login-btn')) {
                  document.getElementById('login-btn').click();
                }
                console.log('LOGIN!');
              }}>
                {copy.logout}
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        ) : (
            <div>
              <Button
                className="gn-dd-btn d-flex"
                onClick={(e) => {
                  e.stopPropagation();
                  if (document.getElementById('login-btn')) {
                    document.getElementById('login-btn').click();
                  }
                  console.log('LOGIN!');
                }}
              >
                <div className="align-self-center">
                  <FontAwesomeIcon icon={faSignInAlt} />
                </div>
                <div className="align-self-center pl-2">
                  {copy.login}
                </div>
              </Button>
            </div>
          )}
      </MediaQuery>
    </div>
  );
};

LoginDropdown.defaultProps = {
  currentLang: "en_CA",
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
  doLogin: () => { },
};

LoginDropdown.propTypes = {
  currentLang: PropTypes.string,
  /** Information about the logged in user */
  userObject: PropTypes.shape({
    /** GCID for user that comes back from openID provider */
    sub: PropTypes.string,
    name: PropTypes.string,
    picture: PropTypes.string,
  }),
  /** The parent App's openID config */
  oidcConfig: PropTypes.shape({}),
  /** Login method from parent App */
  doLogin: PropTypes.func,
};

export default LoginDropdown;

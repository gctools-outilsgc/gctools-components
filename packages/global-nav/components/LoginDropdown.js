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
// import MobileLogin from './MobileLogin';

const LoginDropdown = (props) => {
  const {
    userObject,
    oidcConfig,
    doLogin,
    closeAll,
  } = props;

  return (
    <div>
      <MediaQuery query="(min-width: 768px)">
      {userObject ? (
        <UncontrolledDropdown direction="left">
          <DropdownToggle className="gn-dd-btn d-flex">
            <div className="align-self-center">
              <img
                className="gn-avatar"
                src={userObject.picture}
                alt=""
              />
            </div>
            <div className="align-self-center pl-2">
              {userObject.name}
            </div>
          </DropdownToggle>
          <DropdownMenu modifiers={{ computeStyle: { gpuAcceleration: false }}}>
            <DropdownItem href={`https://profile.gccollab.ca/p/${userObject.sub}`}>
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
          <Button
            className="gn-dd-btn d-flex"
            onClick={(e) => {
              e.stopPropagation();
              if(document.getElementById('login-btn')){
                document.getElementById('login-btn').click();
              }
              console.log('LOGIN!');
            }}
          >
            <div className="align-self-center">
              <FontAwesomeIcon icon={faSignInAlt} />
            </div>
            <div className="align-self-center pl-2">
              Login
            </div>
          </Button>
        </div>
      )}
    </MediaQuery>
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

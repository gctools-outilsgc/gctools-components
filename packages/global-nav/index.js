import React from 'react';
import PropTypes from 'prop-types';

import '@gctools-components/aurora-css/css/aurora.min.css';
import './css/style.css';

import LoginDropdown from './components/LoginDropdown';
import AppListDropdown from './components/AppListDropdown';
import ToggleLangDropdown from './components/ToggleLangDropdown';
import HelpDropdown from './components/HelpDropdown';
import NotificationDropdown from './components/NotificationDropdown';

/**
 * Global navigation react component for OADW apps.
 */

const GlobalNav = (props) => {
  const {
    currentLang,
    currentApp,
    onLanguageResultClick,
    currentUser,
    accessToken,
  } = props;

  return (
    <div className="gn-holder">
      <LoginDropdown
        userObject={currentUser}
      />
      <NotificationDropdown
        userObject={currentUser}
        accessToken={accessToken}
      />
      <AppListDropdown
        currentApp={currentApp}
      />
      <ToggleLangDropdown
        currentLang={currentLang}
        onResultClick={(e) => {
          //TODO Send e to parent
          onLanguageResultClick(e);
          console.log(e);
        }}
      />
      <HelpDropdown
        //TODO this could just exist in this component
        windowLocation={window.location.href}
      />
    </div>
  );
};

GlobalNav.defaultProps = {
  currentLang: 'en_CA',
  onLanguageResultClick: () => {},
  currentUser: null,
  currentApp: {},
  accessToken: '',
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
};

export default GlobalNav;

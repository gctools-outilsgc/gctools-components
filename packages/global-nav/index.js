import React from 'react';
import PropTypes from 'prop-types';

import '@gctools-components/aurora-css/css/aurora.min.css';
import './css/style.css';

import LoginDropdown from './components/LoginDropdown';
import AppListDropdown from './components/AppListDropdown';
import ToggleLangDropdown from './components/ToggleLangDropdown';
import HelpDropdown from './components/HelpDropdown';

/**
 * Global navigation react component for OADW apps.
 */

const GlobalNav = (props) => {
  const {
    test,
    currentLang,
    onLanguageResultClick,
    currentUser,
  } = props;

  return (
    <div className="gn-holder">
      {test}
      <LoginDropdown
        userObject={currentUser}
      />
      <AppListDropdown />
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
  test: 'prop test',
  currentLang: 'en_CA',
  onLanguageResultClick: () => {},
  currentUser: null,
};

GlobalNav.propTypes = {
  /** This is an example prop called "test". */
  test: PropTypes.string,
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
};

export default GlobalNav;


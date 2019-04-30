import React from 'react';
import PropTypes from 'prop-types';

import LoginSection from './components/LoginSection';
import '@gctools-components/aurora-css/css/aurora.min.css';
import './css/style.css';

import ToggleLangDropdown from './components/ToggleLangDropdown';

/**
 * Global navigation react component for OADW apps.
 */

const GlobalNav = (props) => {
  const {
    test,
    currentLang,
    onLanguageResultClick,
  } = props;

  return (
    <div className="gn-holder">
      {test}
      <LoginSection />
      <ToggleLangDropdown
        currentLang={currentLang}
        onResultClick={(e) => {
          //TODO Send e to parent
          onLanguageResultClick(e);
          console.log(e);
        }}
      />
    </div>
  );
};

GlobalNav.defaultProps = {
  test: 'prop test',
  currentLang: 'en_CA',
  onLanguageResultClick: () => {},
};

GlobalNav.propTypes = {
  /** This is an example prop called "test". */
  test: PropTypes.string,
  /** This is the current language of the app */
  currentLang: PropTypes.string,
  /** Function will pass the selected language to parent */
  onLanguageResultClick: PropTypes.func,
};

export default GlobalNav;


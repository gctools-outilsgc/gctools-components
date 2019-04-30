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
    test
  } = props;

  return (
    <div className="gn-holder">
      {test}
      <LoginSection />
      <ToggleLangDropdown />
    </div>
  );
};

GlobalNav.defaultProps = {
  test: 'prop test',
};

GlobalNav.propTypes = {
  /** This is an example prop called "test". */
  test: PropTypes.string,
};

export default GlobalNav;


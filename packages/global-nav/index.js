import React from 'react';
import PropTypes from 'prop-types';

import LoginSection from './components/LoginSection';
import './css/style.css';

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


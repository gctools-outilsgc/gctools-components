import React from 'react';
import PropTypes from 'prop-types';

/**
 * Global navigation react component for OADW apps.
 */

const GlobalNav = (props) => {
  const {
    test
  } = props;

  return (
    <div>
      Test Component
      {test}
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


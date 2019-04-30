import React from 'react';
import PropTypes from 'prop-types';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

const ToggleLangDropdown = (props) => {
  const {
    currentLang,
    onResultClick,
  } = props;
  return (
    <UncontrolledDropdown direction="left">
      <DropdownToggle caret>
        {currentLang}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => onResultClick('en_CA')}>
          English
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={() => onResultClick('fr_CA')}>
          French
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

ToggleLangDropdown.defaultProps = {
  currentLang: 'en_CA',
  onResultClick: () => {},
};

ToggleLangDropdown.propTypes = {
  currentLang: PropTypes.string,
  onResultClick: PropTypes.func,
};

export default ToggleLangDropdown;

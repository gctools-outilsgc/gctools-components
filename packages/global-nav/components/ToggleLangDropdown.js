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
    currentLang
  } = props;
  return (
    <UncontrolledDropdown direction="left">
      <DropdownToggle caret>
        {currentLang}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem>Another Action</DropdownItem>
        <DropdownItem divider />
        <DropdownItem>Another Action</DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

ToggleLangDropdown.defaultProps = {
  currentLang: 'en_CA',
};

ToggleLangDropdown.propTypes = {
  currentLang: PropTypes.string,
};

export default ToggleLangDropdown;

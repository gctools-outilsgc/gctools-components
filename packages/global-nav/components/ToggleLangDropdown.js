import React from 'react';
import PropTypes from 'prop-types';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

const checkMark = (
  <span className="checkmark">
    <div className="checkmark_stem"></div>
    <div className="checkmark_kick"></div>
    <span className="sr-only">Current Lang</span>
  </span>
);

const ToggleLangDropdown = (props) => {
  const {
    currentLang,
    onResultClick,
  } = props;
  return (
    <UncontrolledDropdown direction="left">
      <DropdownToggle className="gn-dd-btn">
        {(currentLang == 'en_CA') ? 'English' : 'Français'}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => onResultClick('en_CA')}>
          <span>{(currentLang == 'en_CA') ? checkMark : ''}</span>English
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={() => onResultClick('fr_CA')}>
          <span>{(currentLang == 'fr_CA') ? checkMark : ''}</span>Français
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
  /** Gets the current language of the application */
  currentLang: PropTypes.string,
  /** Gets the value of the option clicked */
  onResultClick: PropTypes.func,
};

export default ToggleLangDropdown;

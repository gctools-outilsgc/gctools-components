import React from 'react';
import PropTypes from 'prop-types';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import langEn from '../assets/enIcon.svg';
import langFr from '../assets/frIcon.svg';

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

  const langIcon = (currentLang === 'en_CA' ? langEn : langFr );

  return (
    <UncontrolledDropdown direction="left">
      <DropdownToggle className="gn-dd-btn d-flex">
        <div className="align-self-center">
          <img src={langIcon} alt="" className="lang-icon" />
        </div>
        <div className="align-self-center pl-2">
          {(currentLang == 'en_CA') ? 'English' : 'Français'}
        </div>
      </DropdownToggle>
      <DropdownMenu modifiers={{ computeStyle: { gpuAcceleration: false }}}>
        <DropdownItem onClick={() => onResultClick('en_CA')} lang="en">
          <span>{(currentLang == 'en_CA') ? checkMark : ''}</span>English
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={() => onResultClick('fr_CA')} lang="fr">
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

import React from 'react';
import PropTypes from 'prop-types';

import {
  Button
} from 'reactstrap';

import GctoolsIcon from '../assets/gctools-icon.svg';

const SidebarToggle = (props) => {
  const {
    minimized,
    onResultClick,
    currentLang,
  } = props;

  const status = (minimized ? false : true);

  return (
    <div>
      <Button
        onClick={() => onResultClick(status)}
        className={
          (minimized) ? 
            'gn-btn-sidebar-toggle gn-minimize d-flex' :
            'gn-btn-sidebar-toggle show d-flex'
        }
      >
        <img className="align-self-center" src={GctoolsIcon} alt="" style={{width: "30px", height: "30px"}}/>
        {currentLang === "en_CA" ? 
          <span className="align-self-center pl-3">
            <span className="sr-only">Toggle</span><span>GC</span>Tools<span className="sr-only">navigation open or closed</span>
            <span className="gn-chevron-arrow-right"></span>
          </span>
        :
          <span className="align-self-center pl-3">
            <span className="sr-only">Faire basculer la navigation dans </span>Outils<span>GC</span><span className="sr-only"> entre ouvert ou fermé</span>
            <span className="gn-chevron-arrow-right"></span>
          </span>
        }
      </Button>
    </div>
  );
};

SidebarToggle.defaultProps = {
  minimized: false,
  onResultClick: () => {},
  currentLang: "en_CA"
};

SidebarToggle.propTypes = {
  /** Gets the current status of sidebar */
  minimized: PropTypes.bool,
  /** Gets the value of the option clicked */
  onResultClick: PropTypes.func,
  currentLang: PropTypes.string,
};

export default SidebarToggle;

import React from 'react'; import PropTypes from 'prop-types';
import { Row, Col } from "reactstrap";

import Search from "./Search";

import SigEn from '../assets/sig-en.svg';
import SigFr from '../assets/sig-fr.svg';

const TopNavBar = (props) => {
  const {
    minimized,
    currentLang,
    currentApp,
    search,
  } = props;

  const status = (minimized ? false : true);
  const flag = (currentLang === 'en_CA' ? SigEn : SigFr );
  const flagAlt = (currentLang === 'en_CA' ? 'Government of Canada' : 'Gouvernment du Canada' );

  return (
    <nav className="top_bar shadow-sm">
      <div className="containerGoC align-self-center">
        <img className="flag" src={flag} alt={flagAlt} />
      </div>
      <a className="gn-app-brand d-flex" href={currentApp.home}>
        <img
          src={currentApp.logo}
          alt=""
          className="gn-app-logo align-self-center"
        />
        <div className="align-self-center">
          {currentApp.name}
        </div>
      </a>
      <div className={
          (minimized) ?
            'searchbox-close search-box' :
            'search-box'
        }>
        <Search
         currentLang={currentLang}
         search={search}
        />
      </div>
    </nav>
  );
};

TopNavBar.defaultProps = {
  currentApp: {
    name: 'AppName',
    id: '1',
    home: '#',
    logo: ''
  },
};

TopNavBar.propTypes = {
  /** Current app object name, ID, home link and logo */
  currentApp: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    home: PropTypes.string,
    logo: PropTypes.string,
  }),
};

export default TopNavBar;

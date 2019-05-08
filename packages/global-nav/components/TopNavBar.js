import React from 'react'; import PropTypes from 'prop-types'; 
import { Row, Col } from "reactstrap";
import FlagEN from "./sig-en-w.png";
import Search from "./Search";

const TopNavBar = (props) => {
  const {
    minimized,
    currentApp,
    search,
  } = props;

  const status = (minimized ? false : true);

  return (
    <nav className="top_bar shadow-sm">
      <div className="containerGoC">
        <img className="flag" src={FlagEN} alt="Government of Canada" />
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

import React from 'react'; import PropTypes from 'prop-types'; 
import { Row, Col } from "reactstrap";
import FlagEN from "./sig-en-w.png";

const TopNavBar = (props) => {
  const {
    currentApp,
  } = props;

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

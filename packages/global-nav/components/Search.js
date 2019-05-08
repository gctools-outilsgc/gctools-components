import React from 'react'; 
import PropTypes from 'prop-types'; 
import { Input, Button } from "reactstrap"; 
import langEn from '../assets/search.png';

const Search = (props) => {
  const {
    currentApp,
    search
  } = props;
  return (
      <div className="searchContainer">

        <Input className="searchBox" type="search" name="search" placeholder="Search" />
        <Button className="btn-search" type="button"><img  className="searchIcon" src={langEn} alt="" /></Button>
      </div>
  );
};
Search.defaultProps = {
  currentApp: {
    name: 'AppName',
    id: '1',
  },
  search: {
    keyword:""
  },
};
Search.propTypes = {
  /** Current app object name, ID, home link and logo */
  currentApp: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }),

  search: PropTypes.shape({
    keyword: PropTypes.string,
  }),
};
export default Search;

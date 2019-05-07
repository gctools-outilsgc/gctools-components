import React from 'react'; 
import PropTypes from 'prop-types'; 
import { Input } from "reactstrap"; 

const Search = (props) => {
  const {
    currentApp,
  } = props;
  return (
    <Input type="search" name="search" id="search" placeholder="search" />
  );
};
Search.defaultProps = {
  currentApp: {
    name: 'AppName',
    id: '1',
    home: '#',
    logo: ''
  },
};
Search.propTypes = {
  /** Current app object name, ID, home link and logo */
  currentApp: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    home: PropTypes.string,
    logo: PropTypes.string,
  }),
};
export default Search;

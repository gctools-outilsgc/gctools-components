import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from "reactstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Search = (props) => {
  const {
    currentApp,
    currentLang,
  } = props;

  const searchAlt = (currentLang === 'en_CA' ? 'Search' : 'Chercher');

  function SearchKey(){
    console.log('search')
  }

  return (
      <div className="searchContainer">
        <label htmlFor="search" className="sr-only">
          {searchAlt}
        </label>
        <Input
          className="searchBox"
          type="search"
          name="search"
          id="search"
          placeholder={searchAlt}
        />
        <Button className="btn-search" type="button" onClick={() => SearchKey(this.handleClick)}>
          <FontAwesomeIcon icon={faSearch} />
          <span className="sr-only">{searchAlt}</span>
        </Button>
      </div>
  );
};
Search.defaultProps = {
  currentApp: {
    name: 'AppName',
    id: '1',
  },
  SearchKey: () => {},
  currentLang: 'en_CA',
  onResultClick: () => {},
};


Search.propTypes = {
  /** Current app object name, ID, home link and logo */
  currentApp: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }),
  /** Gets the current language of the application */
  currentLang: PropTypes.string,
  /** Gets the value of the option clicked */
  onResultClick: PropTypes.func,

  SearchKey: PropTypes.func
};

export default Search;

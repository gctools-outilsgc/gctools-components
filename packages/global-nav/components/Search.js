import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from "reactstrap";
import useForm from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Search = (props) => {
  
  const {
    currentApp,
    currentLang,
  } = props;

  const searchAlt = (currentLang === 'en_CA' ? 'Search' : 'Chercher');
  const [searchkey, setSearch] = useState("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    console.log(searchkey)
  }

  return (
      <div className="searchContainer">
       <form onSubmit={handleSubmit}>
        <label htmlFor="search" className="sr-only">
          {searchAlt}
        </label>
        <Input
          className="searchBox"
          type="text"
          name="search"
          id="search"
          placeholder={searchAlt}
          onChange={e => setSearch(e.target.value)}
          value={searchkey}
        />
        <Button className="btn-search" type="submit">
          <FontAwesomeIcon icon={faSearch} />
          <span className="sr-only">{searchAlt}</span>
        </Button>
       </form>
      </div>
  );
};

Search.defaultProps = {
  currentApp: {
    name: 'AppName',
    id: '1',
  },
  setSearch: () => {},
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

  setSearch: PropTypes.func
};

export default Search;

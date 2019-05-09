import React from 'react';
import PropTypes from 'prop-types';
import { Input, Button } from "reactstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Search = (props) => {
  const {
    currentApp,
    currentLang,
    search
  } = props;

  const searchAlt = (currentLang === 'en_CA' ? 'Search' : 'Chercher');

  return (
      <div className="searchContainer">

        <Input className="searchBox" type="search" name="search" placeholder={searchAlt} />
        <Button className="btn-search" type="button">
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

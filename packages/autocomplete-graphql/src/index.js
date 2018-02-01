
import { graphql } from 'react-apollo';

import AutoCompleteGraphQL from './AutoCompleteGraphQL';

const bindWithQuery = (query, propsMapper) => graphql(query, {
  skip: props => props.searchText.length < 3,
  props: propsMapper,
  options: ({ searchText, token }) => ({
    variables: {
      nameContains: searchText,
    },
    context: {
      headers: {
        Authorization: token,
      },
    },
  }),
})(AutoCompleteGraphQL);

export default bindWithQuery;

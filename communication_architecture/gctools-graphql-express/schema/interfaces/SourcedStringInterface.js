import {
  GraphQLInterfaceType,
  GraphQLString,
} from 'graphql';

import DataSource from '../types/DataSource';

export default new GraphQLInterfaceType({
  name: 'SourcedStringInterface',
  description: 'A string that can be traced to a specific data source',
  fields: () => ({
    value: {
      type: GraphQLString,
      description: 'The data value'
    },
    source: {
      type: DataSource,
      description: 'The source of this data'
    }
  })
});

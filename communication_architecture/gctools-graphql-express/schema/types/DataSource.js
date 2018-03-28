import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

export default new GraphQLObjectType({
  name: 'DataSource',
  description: 'A physical or conceptual source of data',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'A name that uniquely identitifes the data source'
    }
  })
});

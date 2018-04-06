import { GraphQLSchema } from 'graphql';

import * as types from './types';
import query from './query'
import mutation from './mutation'
import subscription from './subscription';

const schema = new GraphQLSchema({
  query,
  mutation,
  subscription,
  types: Object.keys(types).map(k => types[k])
});

export default schema;

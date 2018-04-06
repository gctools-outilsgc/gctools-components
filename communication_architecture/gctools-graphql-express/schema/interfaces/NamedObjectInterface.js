import {
  GraphQLInterfaceType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

import SourcedString from '../types/SourcedString';

export default new GraphQLInterfaceType({
  name: 'NamedObject',
  description: 'An object that can be identified by it\'s name',
  fields: () => ({
    name: {
      type: SourcedString,
      description: 'The name that identifies this object',
    },
    id: {
      type: GraphQLID,
      description: 'A unique identitfier for this object.'
    }
  }),
});

export const namedArgumentList = {
  hasId: {
    description: 'Matches the unique identifier',
    type: GraphQLID
  },
  nameContains: {
    description: 'Characters that are found in "name"',
    type: GraphQLString
  },
  nameStartsWith: {
    description: '"name" must begin with these characters',
    type: GraphQLString
  },
  nameEndsWith: {
    description: '"name" must end with these characters',
    type: GraphQLString
  },
  limit: {
    description: 'Limit the number of results',
    type: GraphQLInt
  },
};

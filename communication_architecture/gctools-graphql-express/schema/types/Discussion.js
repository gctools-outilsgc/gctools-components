import {
  GraphQLID,
  GraphQLObjectType,
} from 'graphql';

import NamedObjectInterface from '../interfaces/NamedObjectInterface';
import SourcedString from './SourcedString';

const Discussion = new GraphQLObjectType({
  name: 'Discussion',
  description: 'A GCconnex discussion',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'A GUID that uniquely identifies the discussion'
    },
    name: {
      type: SourcedString,
      description: 'The discussion\'s name',
    },
  }),
  isTypeOf: () => Discussion,
  interfaces: [ NamedObjectInterface ]
});

export default Discussion;

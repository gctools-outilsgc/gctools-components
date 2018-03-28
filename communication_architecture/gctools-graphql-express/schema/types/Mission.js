import {
  GraphQLID,
  GraphQLObjectType,
} from 'graphql';

import NamedObjectInterface from '../interfaces/NamedObjectInterface';
import SourcedString from './SourcedString';

const Mission = new GraphQLObjectType({
  name: 'Mission',
  description: 'A GCconnex mission',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'A GUID that uniquely identifies the mission'
    },
    name: {
      type: SourcedString,
      description: 'The mission\'s name',
    },
  }),
  isTypeOf: () => Mission,
  interfaces: [ NamedObjectInterface ]
});

export default Mission;

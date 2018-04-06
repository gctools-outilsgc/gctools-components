import {
  GraphQLID,
  GraphQLObjectType,
} from 'graphql';

import NamedObjectInterface from '../interfaces/NamedObjectInterface';
import SourcedString from './SourcedString';

const Skill = new GraphQLObjectType({
  name: 'Skill',
  description: 'Skill a person can possess',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'A GUID that uniquely identifies a skill'
    },
    name: {
      type: SourcedString,
      description: 'The name of the skill'
    },
  }),
  isTypeOf: () => Skill,
  interfaces: [ NamedObjectInterface ]
});

export default Skill;

import {
  GraphQLID,
  GraphQLFloat,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
} from 'graphql';

import NamedObjectInterface from '../interfaces/NamedObjectInterface';
import SourcedString from './SourcedString';
import RecommendationsForPerson from './RecommendationsForPerson';
import Skill from './Skill';
import Phrase, { PhraseArgumentList } from './Phrase';

const Person = new GraphQLObjectType({
  name: 'Person',
  description: 'Person is a human working for the GoC.',
  fields: () => {
    return {
      id: {
        type: GraphQLID,
        description: 'A GUID that uniquely identifies this person'
      },
      name: {
        type: SourcedString,
        description: 'The person\'s full name.'
      },
      gcconnex_username: {
        type: GraphQLString,
        description: 'Username on GCConnex',
      },
      email: {
        type: SourcedString,
        description: 'Email address belonging to this person'
      },
      description: {
        type: SourcedString,
        description: 'Description of person'
      },
      department: {
        type: SourcedString,
        description: 'Which department the person works for'
      },
      language: {
        type: SourcedString,
        description: 'The person\'s language'
      },
      skills: {
        type: new GraphQLList(Skill),
        description: 'Skills this person possesses'
      },
      phraseCloud: {
        type: new GraphQLList(Phrase),
        description: 'Phrases that describe this person',
        args: PhraseArgumentList,
      },
      recommendations: {
        type: RecommendationsForPerson,
        description: 'Recommendations for this person'
      },
    }
  },
  isTypeOf: () => Person,
  interfaces: [ NamedObjectInterface ],
});

export default Person;

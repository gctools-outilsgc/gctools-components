import {
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';

import Article, { articleArguments } from './Article';
import Person from './Person';
import Mission from './Mission';

const Recommendations = new GraphQLObjectType({
  name: 'Recommendations',
  description: 'A list of recommended objects',
  fields: () => ({
    articles: {
      type: new GraphQLList(Article),
      description: 'List of recommended articles.',
      args: articleArguments,
    },
    people: {
      type: new GraphQLList(Person),
      description: 'List of recommended people.'
    },
    missions: {
      type: new GraphQLList(Mission),
      description: 'List of recommended missions.'
    },
  }),
});

export default Recommendations;

import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} from 'graphql';

import {
  Person,
  Article,
  Mission,
  Discussion,
 } from './types';

import {
  personResolver,
  articleResolver,
  discussionResolver,
} from '../resolvers';

import { articleArguments } from './types/Article';

import { GraphQLClient } from 'graphql-request';
import { namedArgumentList } from './interfaces/NamedObjectInterface';

// TODO: partial loading (subscriptions?)
export default new GraphQLObjectType({
  name: 'QueryRoot',
  description: 'Main entrypoint for GraphQL queries',
  fields: () => ({
    me: {
      type: Person,
      resolve: (r, a, c, i) => (new Promise((resolve, reject) => {
          personResolver(r, a, c, i).then((person) => {
            if (person.length === 1) {
              resolve(person[0]);
            } else reject('An error occured');
          }).catch(e => reject(e));
        })
      ),
    },
    people: {
      args: {
        ...namedArgumentList,
      },
      type: new GraphQLList(Person),
      resolve: personResolver,
    },
    articles: {
      type: new GraphQLList(Article),
      args: articleArguments,
      resolve: articleResolver,
    },
    missions: {
      type: new GraphQLList(Mission),
      resolve: (root) => ([]),
    },
    discussions: {
      type: new GraphQLList(Discussion),
      args: {
        ...namedArgumentList,
      },
      resolve: discussionResolver,
    },
  })
});

import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
} from 'graphql';
import request from 'request';

import Recommendations from './Recommendations';
import { makeSourcedString as mkStr } from './SourcedString';
import recommendationResolver from '../../resolvers/recommendation';

const RecommendationsForPerson = new GraphQLObjectType({
  name: 'RecommendationsForPerson',
  description: 'Recommendations for a person',
  fields: () => ({
    context: {
      type: new GraphQLObjectType({
        name: 'ApplicationContext',
        description: 'A GCTools application, such as GCconnex',
        fields: () => ({
          GCpedia: {
            type: new GraphQLObjectType({
              name: 'GCpediaApplicationContext',
              description: 'GCpedia application context',
              fields: () => ({
                article_c1: {
                  type: Recommendations,
                  description: 'Known user on the landing page.',
                  resolve: recommendationResolver('article_c1'),
                },
                article_c2: {
                  type: Recommendations,
                  description: 'Unknown user on the landing page..',
                  resolve: recommendationResolver('article_c2'),
                },
                article_c3: {
                  type: Recommendations,
                  description: 'Known user reading an article.',
                  args: {
                    article: {
                      type: GraphQLString,
                      description: 'Id of article being read'
                    }
                  },
                  resolve: recommendationResolver('article_c3'),
                },
                article_c4: {
                  type: Recommendations,
                  description: 'Unknown user reading an article.',
                  args: {
                    article: {
                      type: GraphQLString,
                      description: 'Id of article being read'
                    }
                  },
                  resolve: recommendationResolver('article_c4'),
                },
              })
            }),
            resolve: root => root,
            description: 'GCpedia application context',
          },
          GCconnex: {
            type: new GraphQLObjectType({
              name: 'GCconnexApplicationContext',
              description: 'GCconnex application context',
              fields: () => ({
                article_c5: {
                  type: Recommendations,
                  description: 'Known user reading a discussion.',
                  args: {
                    article: {
                      type: GraphQLString,
                      description: 'Id of article being read'
                    }
                  },
                  resolve: recommendationResolver('article_c5'),
                },
                article_c6: {
                  type: Recommendations,
                  description: 'Unknown user reading a discussion.',
                  args: {
                    article: {
                      type: GraphQLString,
                      description: 'Id of article being read'
                    }
                  },
                  resolve: recommendationResolver('article_c6'),
                },
              })
            }),
            resolve: root => root,
            description: 'GCconnex application context',
          },
        }),
      }),
    },
  }),
  isTypeOf: () => RecommendationsForPerson,
});

export default RecommendationsForPerson;

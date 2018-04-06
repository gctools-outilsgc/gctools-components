import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';

import ContextEnum from './enums/context';

import { postContextEvent } from '../kafka';

export default new GraphQLObjectType({
  name: 'MutationRoot',
  fields: () => ({
    enterContext: {
      description: 'Tell the system you\'ve entered the specified context',
      type: GraphQLString,
      args: {
        context: {
          type: new GraphQLNonNull(ContextEnum),
        },
        context_obj1: {
          type: GraphQLString,
        },
        context_obj2: {
          type: GraphQLString,
        },
        context_obj3: {
          type: GraphQLString,
        },
      },
      resolve: (root, args) => {
        const data = {
          uuid: root.gcconnex_guid,
          context: args.context,
          context_obj1: args.context_obj1,
          context_obj2: args.context_obj2,
          context_obj3: args.context_obj3,
          action: 'enter'
        }
        return new Promise((resolve, reject) => {
          postContextEvent(data).then(d => resolve(d)).catch(e => reject(e));
        });
      }
    },
  })
});

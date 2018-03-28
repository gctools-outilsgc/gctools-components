import {
  GraphQLObjectType,
} from 'graphql';

import { withFilter } from 'graphql-subscriptions';

import { subscribeToTopic } from '../kafka';
import Recommendations from './types/Recommendations';
import { makeSourcedString as mkStr } from './types/SourcedString';

const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  resolve: (r) => {
    console.log('--top-level--');
    console.log(r);
  },
  fields: {
    newRecommendations: {
      type: Recommendations,
      subscribe: withFilter((filterRoot) => {
        console.log('--withFilter--');
        console.log(filterRoot);
        return subscribeToTopic('recommendation');
      }, (message) => {
        console.log('--InsideFilter--');
        const {
          payload,
          context,
          uuid,
          context_obj1,
          context_obj2,
          context_obj3 } = JSON.parse(message.value);

        console.log(`Target uuid: ${uuid}`);
        return true;
      }),
      resolve: message => {
        const {
          payload,
          context,
          uuid,
          context_obj1,
          context_obj2,
          context_obj3 } = JSON.parse(message.value);

        const articles = payload.map(a => ({
          id: a[0],
          name: mkStr([{
            value: a[3],
            source: 'gcpedia'
          }])
        }));
        return {
          articles
        }
      },
    },
  },
});


export default Subscription;

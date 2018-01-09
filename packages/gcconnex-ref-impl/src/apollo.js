/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2018
 */

import React from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { ApolloProvider, graphql, compose } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { KJUR } from 'jsrsasign';

import EventHandlerRefImpl from './event';

const createToken = (user) => {
  const secret = 'qWxPJrZCLeHZraNTWjEKHdJJxJyho8';
  // eslint-disable-next-line
  const { email, gcconnex_username, gcconnex_guid } = user;
  // Header
  const header = { alg: 'HS256', typ: 'JWT' };
  // Payload
  const payload = { email, gcconnex_guid, gcconnex_username };
  const tEnd = KJUR.jws.IntDate.get('now + 1day');
  payload.exp = tEnd;
  // Token
  const sHeader = JSON.stringify(header);
  const sPayload = JSON.stringify(payload);
  const sJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, secret);
  return `Bearer ${sJWT}`;
};

const apollo = new ApolloClient({
  link: new HttpLink({ uri: 'http://gcrec.lpss.me/graphql' }),
  cache: new InMemoryCache(),
});

const enterContextMutation = gql`
mutation enterContextMutation($context: Context!, $context_obj1: String) {
  enterContext(context: $context, context_obj1: $context_obj1)
}`;

// TODO change how contexts work - pass as variable
const recommendationQueryC5 = gql`
query queryMyRecommendationsC5($context_obj1: String!) {
  me {
    recommendations {
      context {
        GCconnex {
          article_c5(article: $context_obj1) {
            articles {
              id
              rank
              name {
                value
              }
              phraseCloud {
                rank
                text {
                  value
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

const ConnectedRefImpl = compose(
  graphql(enterContextMutation, { name: 'enterContext' }),
  graphql(recommendationQueryC5, {
    name: 'recommendationsC5',
    props: ({
      ownProps: { context },
      recommendationsC5: { loading, me, stopPolling },
    }) => ({
      loading,
      context,
      stopPolling,
      recommendations: (
        loading
        || me.recommendations.context.GCconnex.article_c5 === null)
        ? null :
        me.recommendations.context.GCconnex.article_c5.articles.map(a => ({
          id: a.id,
          title: a.name.value,
          rank: a.rank,
          phraseCloud: a.phraseCloud.map(pc => ({
            phrase: pc.text.value,
            rank: parseFloat(pc.rank),
          })),
        })),
    }),
    skip: ownProps => ownProps.context_obj1 === '',
    options: ownProps => ({
      pollInterval: 1000,
      context: {
        headers: {
          Authorization: ownProps.token,
        },
      },
    }),
  }),
)(EventHandlerRefImpl);


const ApolloRefImpl = props => (
  <ApolloProvider client={apollo}>
    <ConnectedRefImpl {...props} token={createToken(props.user)} />
  </ApolloProvider>
);

ApolloRefImpl.propTypes = {
  /** The currently logged in user */
  user: PropTypes.shape({
    gcconnex_guid: PropTypes.number.isRequired,
    gcconnex_username: PropTypes.string.isRequired,
    email: PropTypes.string,
  }).isRequired,
  context: PropTypes.oneOf(['login', 'article_c5']).isRequired,
  context_obj1: PropTypes.string,
  context_obj2: PropTypes.string,
  context_obj3: PropTypes.string,
};

ApolloRefImpl.defaultProps = {
  context_obj1: '',
  context_obj2: '',
  context_obj3: '',
};

export default ApolloRefImpl;

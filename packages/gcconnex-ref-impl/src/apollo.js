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

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { KJUR } from 'jsrsasign';

import EventHandler from './eventHandler';
import DataProvider from './dataProvider';
import RecommendationView from './index';

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

const ApolloRefImpl = props => (
  <ApolloProvider client={apollo}>
    <DataProvider {...props} token={createToken(props.user)}>
      <EventHandler />
      <RecommendationView />
    </DataProvider>
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

import {
  GraphQLEnumType,
} from 'graphql';

import gcpedia from './gcpedia';
import gcconnex from './gcconnex';

const ContextEnum = new GraphQLEnumType({
  name: 'Context',
  values: Object.assign({}, gcpedia, gcconnex)
});

export const GCconnexContexts = new GraphQLEnumType({
  name: 'GCconnexContexts',
  values: gcconnex
});

export const GCpediaContexts = new GraphQLEnumType({
  name: 'GCpediaContexts',
  values: gcpedia
});

export default ContextEnum;
import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

import NamedObjectInterface, { namedArgumentList }
  from '../interfaces/NamedObjectInterface';
import SourcedString from './SourcedString';
import Phrase, { PhraseArgumentList } from './Phrase';

const Article = new GraphQLObjectType({
  name: 'Article',
  description: 'GCpedia article',
  fields: () => ({
    id: {
      type: GraphQLID,
      description: 'A GUID that uniquely identifies an article'
    },
    name: {
      type: SourcedString,
      description: 'The article title',
    },
    rank: {
      type: GraphQLFloat,
      description: 'Rank of this article if being recommended',
    },
    touched: {
      type: GraphQLInt,
      description: 'Last modified date',
    },
    lang: {
      type: GraphQLString,
      description: 'Language of the article',
    },
    rev: {
      type: GraphQLInt,
      description: 'GCpedia revision',
    },
    phraseCloud: {
      type: new GraphQLList(Phrase),
      description: 'Phrases that describe this article',
      args: PhraseArgumentList,
    },
  }),
  isTypeOf: () => Article,
  interfaces: [ NamedObjectInterface ]
});

export const articleArguments = {
  ...namedArgumentList,
  top: {
    description: 'Returns only the top N articles',
    type: GraphQLInt,
  },
  rankGreaterThan: {
    description: 'Returns articles with a rank greater than the value',
    type: GraphQLFloat,
  },
  rankEqualOrGreaterThan: {
    description: 'Returns articles with a rank greater or equal to the value',
    type: GraphQLFloat,
  },
  rankLesserThan: {
    description: 'Returns articles with a rank lesser than the value',
    type: GraphQLFloat,
  },
  rankEqualOrLesserThan: {
    description: 'Returns articles with a rank lesser or equal to the value',
    type: GraphQLFloat,
  },
  rankEqualTo: {
    description: 'Returns articles with a rank equal to the value',
    type: GraphQLFloat,
  },
  groupBy: {
    description: 'Group results by year or month',
    type: GraphQLString,
  }
}

export default Article;

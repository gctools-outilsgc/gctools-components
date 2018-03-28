import {
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLInt,
} from 'graphql';
import SourcedString from './SourcedString';

const Phrase = new GraphQLObjectType({
  name: 'Phrase',
  description: 'Phrase a person can possess',
  fields: () => ({
    text: {
      type: SourcedString,
      description: 'The phrase text'
    },
    rank: {
      type: GraphQLFloat,
      description: 'Rank of this phrase based on query context'
    }
  }),
  isTypeOf: () => Phrase,
});

export default Phrase;

export const PhraseArgumentList = {
  top: {
    description: 'Returns only the top N phrases',
    type: GraphQLInt,
  },
  rankGreaterThan: {
    description: 'Returns phrases with a rank greater than the value',
    type: GraphQLFloat,
  },
  rankEqualOrGreaterThan: {
    description: 'Returns phrases with a rank greater or equal to the value',
    type: GraphQLFloat,
  },
  rankLesserThan: {
    description: 'Returns phrases with a rank lesser than the value',
    type: GraphQLFloat,
  },
  rankEqualOrLesserThan: {
    description: 'Returns phrases with a rank lesser or equal to the value',
    type: GraphQLFloat,
  },
  rankEqualTo: {
    description: 'Returns phrases with a rank equal to the value',
    type: GraphQLFloat,
  },
};

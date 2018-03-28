import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';

import SourcedStringInterface from '../interfaces/SourcedStringInterface';
import DataSource from './DataSource';

const SourceValuePair = new GraphQLObjectType({
  name: 'SourceValuePair',
  description: 'A value and it\'s source',
  fields: () => ({
    value: {
      type: GraphQLString,
      description: 'The data value'
    },
    source: {
      type: DataSource,
      description: 'The source of this data'
    },
  }),
  interfaces: [ SourcedStringInterface ],
  isTypeOf: () => SourceValuePair
});

const SourcedString = new GraphQLObjectType({
  name: 'SourcedString',
  description: 'A collection of strings, with a default @ value',
  fields: () => ({
    value: {
      type: GraphQLString,
      description: 'The default value chosen'
    },
    source: {
      type: DataSource,
      description: 'The source of the default value'
    },
    list: {
      type: new GraphQLList(SourceValuePair),
      description: "List of all sourced values"
    }
  }),
  interfaces: [ SourcedStringInterface ],
  isTypeOf: () => SourcedString
});

export const makeSourcedString = (obj, default_index) => {
  const getSource = (src) => {
    if (typeof src === 'object') return src;
    return { value: src };
  }
  const data = {list: []}
  const idx = default_index || 0;
  for (let x=0; x < obj.length; x++) {
    const row = { value: obj[x].value, source: getSource(obj[x].source) };
    if (x === idx) {
      data.value = row.value;
      data.source = row.source;
    }
    data.list.push(row);
  }
  return data;
}

export default SourcedString;

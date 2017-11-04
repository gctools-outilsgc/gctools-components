/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

/* eslint-disable */
module.exports = {
  typical: {
    type: 'CallExpression',
    start: 573,
    end: 596,
    loc: { start: { line: 16, column: 13 }, end: { line: 16, column: 36 } },
    range: [573, 596],
    callee: {
      type: 'Identifier', start: 573, end: 575, loc: {start: { line: 16, column: 13 }, end: { line: 16, column: 15 } }, range: [573, 575], name: '__'
    },
    arguments: [{
      type: 'Literal', start: 576, end: 595, loc: { start: { line: 16, column: 16 }, end: { line: 16, column: 35 } }, range: [576, 595], value: 'Language selector', raw: "'Language selector'"
    }]
  },
  plural: {
    type: 'CallExpression',
    start: 10582,
    end: 10604,
    loc: { start: { line: 308, column: 8 }, end: { line: 308, column: 30 } },
    range: [10582, 10604],
    callee: {
      type: 'Identifier', start: 10582, end: 10584, loc: { start: { line: 308, column: 8 }, end: { line: 308, column: 10 } }, range: [10582, 10584], name: '__'
    },
    arguments: [{
      type: 'Literal', start: 10585, end: 10600, loc: { start: { line: 308, column: 11 }, end: { line: 308, column: 26 } }, range: [10585, 10600], value: 'I have %d key', raw: "'I have %d key'"
    }, {
      type: 'Literal', start: 10602, end: 10603, loc: { start: { line: 308, column: 28 }, end: { line: 308, column: 29 } }, range: [10602, 10603], value: 5, raw: '5'
    }]
  },
  interpolate: {"type":"CallExpression","start":13039,"end":13091,"loc":{"start":{"line":405,"column":8},"end":{"line":405,"column":60}},"range":[13039,13091],"callee":{"type":"Identifier","start":13039,"end":13042,"loc":{"start":{"line":405,"column":8},"end":{"line":405,"column":11}},"range":[13039,13042],"name":"___"},"arguments":[{"type":"CallExpression","start":13043,"end":13068,"loc":{"start":{"line":405,"column":12},"end":{"line":405,"column":37}},"range":[13043,13068],"callee":{"type":"Identifier","start":13043,"end":13045,"loc":{"start":{"line":405,"column":12},"end":{"line":405,"column":14}},"range":[13043,13045],"name":"__"},"arguments":[{"type":"Literal","start":13046,"end":13067,"loc":{"start":{"line":405,"column":15},"end":{"line":405,"column":36}},"range":[13046,13067],"value":"I have a %1$s %2$s.","raw":"\"I have a %1$s %2$s.\""}]},{"type":"CallExpression","start":13070,"end":13079,"loc":{"start":{"line":405,"column":39},"end":{"line":405,"column":48}},"range":[13070,13079],"callee":{"type":"Identifier","start":13070,"end":13072,"loc":{"start":{"line":405,"column":39},"end":{"line":405,"column":41}},"range":[13070,13072],"name":"__"},"arguments":[{"type":"Literal","start":13073,"end":13078,"loc":{"start":{"line":405,"column":42},"end":{"line":405,"column":47}},"range":[13073,13078],"value":"red","raw":"\"red\""}]},{"type":"CallExpression","start":13081,"end":13090,"loc":{"start":{"line":405,"column":50},"end":{"line":405,"column":59}},"range":[13081,13090],"callee":{"type":"Identifier","start":13081,"end":13083,"loc":{"start":{"line":405,"column":50},"end":{"line":405,"column":52}},"range":[13081,13083],"name":"__"},"arguments":[{"type":"Literal","start":13084,"end":13089,"loc":{"start":{"line":405,"column":53},"end":{"line":405,"column":58}},"range":[13084,13089],"value":"car","raw":"\"car\""}]}]},
};

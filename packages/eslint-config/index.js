/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

module.exports = {
  extends: 'airbnb',
  globals: {
    __: true,
    ___: true,
    localizer: true,
  },
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  parser: 'babel-eslint',
  rules: {
    'react/jsx-filename-extension': 0,
    'react/no-typos': 0,
    'max-len': [2, 79, 2],
    'no-underscore-dangle': 0,
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'never',
      exports: 'always-multiline',
      functions: 'always-multiline',
    }],
  },
};


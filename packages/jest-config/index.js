/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

module.exports = {
  setupFiles: [
    'jest-localstorage-mock',
    '<rootDir>/node_modules/@gctools-components/jest-config/mocks/raf.js',
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.jsx',
    '**/*.js',
    '!coverage/**',
    '!stories/**',
    '!dist/**',
  ],
  coverageReporters: [
    'text',
    'json',
    'json-summary',
    'lcov',
  ],
  testURL: 'http://localhost',
  testResultsProcessor: 'jest-bamboo-formatter',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css)$': '<rootDir>/node_modules/@gctools-components/jest-config/mocks/fileMock.js', // eslint-disable-line
  },
};

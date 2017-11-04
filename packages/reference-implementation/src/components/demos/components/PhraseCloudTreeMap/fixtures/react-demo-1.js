/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';
import PhraseCloud from '@gctools-components/phrase-cloud-treemap';

const PhraseCloudExample = () => (
  <PhraseCloud
    phrases={[
      { text: 'hello world', size: 10 },
      { text: 'these are phrases', size: 7 },
      { text: 'not words', size: 5 },
      { text: 'I am not an important phrase', size: 1 },
    ]}
  />
);
export default PhraseCloudExample;

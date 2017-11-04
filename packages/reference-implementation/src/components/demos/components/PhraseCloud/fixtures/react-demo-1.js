/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';
import PhraseCloud from '@gctools-components/phrase-cloud';

const PhraseCloudExample = () => (
  <PhraseCloud
    waitForFontFace
    fontFamily="Roboto Condensed"
    placement="onion"
    phrases={[
      { text: 'This phrase is O.K.', size: 7 },
      { text: 'I am not an important phrase', size: 4 },
      { text: 'I am also of no importance', size: 4 },
      { text: 'I am important', size: 13 },
      { text: 'GCTools rocks!', size: 13 },
      { text: 'I am GREAT.', size: 14 },
    ]}
  />
);
export default PhraseCloudExample;

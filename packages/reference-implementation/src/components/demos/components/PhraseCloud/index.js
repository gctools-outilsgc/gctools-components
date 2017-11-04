/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';
import PhraseCloud from '@gctools-components/phrase-cloud';

import Demo, { generateExample } from '../../demo';

const requireContext = require.context('./fixtures', false, /.*/);
const raw = require.context('!!raw-loader!./fixtures', false, /.*/);

const demo = () => (
  <Demo
    name={__('Phrase cloud')}
    component={PhraseCloud}
    title={__('Phrase cloud')}
  >
    {generateExample(__('Example usage'), [
        {
          label: 'react',
          language: 'javascript',
          filename: 'react-demo-1.js',
          require: requireContext,
          raw,
        },
      ])
    }

  </Demo>
);

export default LocalizedComponent(demo);

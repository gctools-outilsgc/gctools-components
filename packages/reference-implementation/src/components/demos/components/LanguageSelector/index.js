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
import LanguageSelector from '@gctools-components/language-selector';
import Demo, { generateExample } from '../../demo';

const demo = () => (
  <Demo
    name="LanguageSelector"
    component={LanguageSelector}
    title={__('Language selector')}
  >
    <p>
      Because the reference implementation also uses
      `i18n-translation-webpack-plugin`, the example below will control the
      language of the demo site as well.
    </p>

    {generateExample('Simple example', [
        {
          label: 'react',
          language: 'javascript',
          filename: 'react-demo-1.js',
          require: require.context('./fixtures', false, /.*/),
          raw: require.context('!!raw-loader!./fixtures', false, /.*/),
        },
      ])
    }

  </Demo>
);

export default LocalizedComponent(demo);

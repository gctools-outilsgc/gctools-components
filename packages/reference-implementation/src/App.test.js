/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Localizer
  from '@gctools-components/i18n-translation-webpack-plugin/dist/localizer';

import App from './App';

global.localizer = new Localizer({
  availableLanguages: ['en_CA', 'fr_CA'],
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

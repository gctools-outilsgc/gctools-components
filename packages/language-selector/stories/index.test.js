/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import initStoryshots from '@storybook/addon-storyshots';
import Localizer
  from '@gctools-components/i18n-translation-webpack-plugin/dist/localizer';

global.localizer = new Localizer({
  availableLanguages: ['en_CA', 'fr_CA'],
});

window.__ = str => str;

initStoryshots();

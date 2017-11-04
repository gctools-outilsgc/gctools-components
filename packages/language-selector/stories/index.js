/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import localized from
  '@gctools-components/react-i18n-translation-webpack';

import LanguageSelector from '../index';

const description = (
  <div>
    <p>
    The language selector component is a simple drop down list allowing
    the end user to choose a language.
    </p>
    <p>
    The list of languages is read directly from the localization service
    made available by using `i18n-translation-webpack-plugin`, and when the
    user chooses a language, that localization service is updated and notifies
    any listeners automatically.
    </p>
  </div>
);

const TranslationExample = () => <p>{__('some text to translate')}</p>;
const Translated = localized(TranslationExample);

storiesOf('LanguageSelector', module)
  .add(
    'Default options',
    withInfo({
      text: description,
      header: true,
      inline: true,
      source: false,
      propTablesExclude: [Translated],
    })(() => (
      <div style={{ margin: '20px' }}>
        <Translated />
        <LanguageSelector />
      </div>
    )),
  )
  .add('setting the labelStyle prop', () => (
    <div style={{ margin: '20px' }}>
      <Translated />
      <LanguageSelector labelStyle={{ border: '1px solid #000' }} />
    </div>
  ))
  .add('setting the selectedLanguageStyle prop', () => (
    <div style={{ margin: '20px' }}>
      <Translated />
      <LanguageSelector selectedLanguageStyle={{ border: '1px solid #000' }} />
    </div>))
  .add('setting the languageItemStyle prop', () => (
    <div style={{ margin: '20px' }}>
      <Translated />
      <LanguageSelector languageItemStyle={{ border: '1px solid #000' }} />
    </div>));

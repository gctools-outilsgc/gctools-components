
import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import I18nEditField from '../index';

const values = [
  {
    lang: 'fr-CA',
    value: 'C\'est une valeur française',
    placeholder: 'placeholder',
  },
  {
    lang: 'en-CA',
    value: 'This is an English value',
    placeholder: 'placeholder',
  },
];

storiesOf('I18nEditField', module)
  .add(
    'Default options',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <I18nEditField />
      </div>
    )),
  )
  .add(
    'With values (displays currently selected language value)',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <I18nEditField
          lang="en-CA"
          values={values}
          edit={false}
          showLabel
          handleChange={(data) => {
            console.log(data); // eslint-disable-line
          }}
        />
      </div>
    )),
  )
  .add(
    'With values in edit mode',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <I18nEditField
          lang="en-CA"
          values={values}
          edit
          showLabel
          handleChange={(data) => {
            console.log(data); // eslint-disable-line
          }}
        />
      </div>
    )),
  )
  .add(
    'With showLabel false in edit mode',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <I18nEditField
          lang="en-CA"
          values={values}
          edit
          showLabel={false}
          handleChange={(data) => {
            console.log(data); // eslint-disable-line
            // eslint-disable-next-line
            for (const i in values) {
              if (values[i].lang === data.lang) {
                Object.assign(values[i], data);
              }
            }
          }}
        />
      </div>
    )),
  );


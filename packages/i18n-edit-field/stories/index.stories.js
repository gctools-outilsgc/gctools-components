
import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import I18nEditField from '../index';

const values = [
  {
    lang: 'fr_CA',
    value: 'C\'est une valeur française',
    placeholder: 'placeholder',
  },
  {
    lang: 'en_CA',
    value: 'This is an English value',
    placeholder: 'placeholder',
  },
];

class ControlledExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values,
    };
  }
  render() {
    return (
      <I18nEditField
        lang="en_CA"
        values={this.state.values}
        edit
        showLabel
        onChange={(data) => {
          const v = this.state.values;
          for (let i = 0; i < v.length; i += 1) {
            if (v[i].lang === data.lang) {
              v[i] = Object.assign(v[i], data);
              break;
            }
          }
          this.setState({ values: v });
        }}
      />
    );
  }
}

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
    'edit=true',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <I18nEditField edit />
      </div>
    )),
  )
  .add(
    'With values',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <I18nEditField
          lang="en_CA"
          values={values}
        />
      </div>
    )),
  )
  .add(
    'With values, edit=true',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <I18nEditField
          lang="en_CA"
          values={values}
          edit
        />
      </div>
    )),
  )
  .add(
    'With values, edit=true, showLabel=false',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <I18nEditField
          lang="en_CA"
          values={values}
          edit
          showLabel={false}
        />
      </div>
    )),
  )
  .add(
    'Controlled example',
    withInfo({
      header: true,
      inline: true,
      source: false,
      propTables: false,
    })(() => <ControlledExample />),
  );

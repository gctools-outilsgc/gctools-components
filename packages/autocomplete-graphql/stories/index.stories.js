
import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import AutoCompleteGraphQL from '../src/AutoCompleteGraphQL';

storiesOf('AutocompletePerson', module)
  .add(
    'with default options',
    withInfo({
      header: true,
      inline: true,
      source: false,
      propTablesExclude: [MuiThemeProvider],
    })(() => (
      <div style={{ margin: '20px' }}>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <AutoCompleteGraphQL id="test" />
        </MuiThemeProvider>
      </div>
    )),
  )
  .add(
    'with Full Width option',
    withInfo({
      header: true,
      inline: true,
      source: false,
      propTablesExclude: [MuiThemeProvider],
    })(() => (
      <div style={{ margin: '20px' }}>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <AutoCompleteGraphQL fullWidth id="test" />
        </MuiThemeProvider>
      </div>
    )),
  )
  .add(
    'with searchText',
    withInfo({
      header: true,
      inline: true,
      source: false,
      propTablesExclude: [MuiThemeProvider],
    })(() => (
      <div style={{ margin: '20px' }}>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <AutoCompleteGraphQL searchText="testing 123" id="test" />
        </MuiThemeProvider>
      </div>
    )),
  )
  .add(
    'with searchText & items',
    withInfo({
      header: true,
      inline: true,
      source: false,
      propTablesExclude: [MuiThemeProvider],
    })(() => (
      <div style={{ margin: '20px' }}>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <AutoCompleteGraphQL
            id="test"
            searchText="testing 123"
            items={[{
              text: 'Item 1',
              value: 'value-1',
            }, {
              text: 'Item 2',
              value: 'value-2',
            }, {
              text: 'Item 3',
              value: 'value-3',
            }]}
          />
        </MuiThemeProvider>
      </div>
    )),
  );



import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import GlobalNav from '../index';

storiesOf('GlobalNav', module)
  .add(
    'Default options',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }} className="gn-story-holder">
        <GlobalNav />
      </div>
    )),
  )
  .add(
    'With Logged in User',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }} className="gn-story-holder">
        <GlobalNav
          currentUser={
            {
              gcID: '1',
              name: 'Jonald',
              avatar: 'url.com',
            }
          }
        />
      </div>
    ))
  );


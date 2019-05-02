
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
    'French Language Toggle / Not Logged in',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }} className="gn-story-holder">
        <GlobalNav
          currentLang='fr_CA'
        />
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
  )
  .add(
    'On A Different App / Logged In',
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
          currentApp={
            {
              name: 'Another App',
              id: '2',
            }
          }
        />
      </div>
    ))
  )
  .add(
    'Minimized / Not Logged In',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }} className="gn-story-holder">
        <GlobalNav
          minimized
        />
      </div>
    ))
  )
  .add(
    'Minimized / Logged In',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }} className="gn-story-holder">
        <GlobalNav
          minimized
	        currentUser={
            {
              gcID: '1',
              name: 'Jonald',
              avatar: 'url.com',
            }
          }
          currentApp={
            {
              id: '2',
            }
          }
        />
      </div>
    ))
);

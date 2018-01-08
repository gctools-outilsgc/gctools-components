
import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import GcconnexRefImpl from '../index';

storiesOf('GcconnexRefImpl', module)
  .add(
    'Default options',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <GcconnexRefImpl
          user={{
            email: 'test@email.com',
            gcconnex_guid: '12345',
            gcconnex_username: 'username',
          }}
          context="article_c5"
          
        />
      </div>
    )),
  );


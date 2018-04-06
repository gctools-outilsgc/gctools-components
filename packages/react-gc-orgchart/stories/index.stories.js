
import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import ReactGcOrgchart from '../index';

const orgStructure = {
  name: 'Jean-Francois Lapointe',
  orgTier: 'HCI',
  uuid: '0',
  subordinates: [
    { name: 'Luc Belliveau', orgTier: 'HCI', uuid: '1' },
    { name: 'Stephen Downes', orgTier: 'HCI', uuid: '2' },
    { name: 'Helene Fournier', orgTier: 'HCI', uuid: '3' },
    { name: 'Bruno Emond', orgTier: 'HCI', uuid: '4' },
    { name: 'Norm Vinson', orgTier: 'HCI', uuid: '5' },
    { name: 'Rodrigue Savoie', orgTier: 'HCI', uuid: '6' },
    { name: 'Scott Buchanan', orgTier: 'HCI', uuid: '7' },
    { name: 'Serge Leger', orgTier: 'HCI', uuid: '8' },
    { name: 'Irina Kondratova', orgTier: 'HCI', uuid: '9' },
    { name: 'Heather Molyneaux', orgTier: 'HCI', uuid: '10' },
  ],
};

storiesOf('ReactGcOrgchart', module)
  .add(
    'Default options',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <ReactGcOrgchart />
      </div>
    )),
  )
  .add(
    'With HCI team structure',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <ReactGcOrgchart orgStructure={orgStructure} />
      </div>
    )),
  )
  .add(
    'With HCI team structure and subject=1',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <ReactGcOrgchart orgStructure={orgStructure} subject="1" />
      </div>
    )),
  );


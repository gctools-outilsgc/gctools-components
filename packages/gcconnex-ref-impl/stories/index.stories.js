
import React from 'react';

import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

import GcconnexRefImpl from '../src';
import exampleRecommendations from './recommendations';

storiesOf('GcconnexRefImpl', module)
  .add(
    'with recommendations',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <GcconnexRefImpl recommendations={exampleRecommendations} />
      </div>
    )),
  )
  .add(
    'with no available recommendations (recommendations=[])',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <GcconnexRefImpl recommendations={[]} />
      </div>
    )),
  )
  .add(
    'with recommendations not ready (recommendations=null)',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <GcconnexRefImpl recommendations={null} />
      </div>
    )),
  )
  .add(
    'context=login',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <GcconnexRefImpl context="login" />
      </div>
    )),
  )
  .add(
    'loading=true',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <GcconnexRefImpl loading />
      </div>
    )),
  )
  .add(
    'Default options',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <GcconnexRefImpl />
      </div>
    )),
  );

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

import PhraseCloudTreemap from '../index';

require('../css/styles.css');

const description = (
  <div>
    <p>
      Word clouds have been a staple of big data visualization for some time,
      NRC recommendation algorithms however leverage more than just single
      words, but phrases.  This component can be used to visualize these
      phrases to end users using D3&apos;s treemap layout.
    </p>
  </div>
);

storiesOf('PhraseCloudTreemap', module)
  .add(
    'Minimum config ( phrases )',
    withInfo({
      text: description,
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloudTreemap
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>)),
  )
  .add(
    'fontFamily="Alfa Slab One" and waitForFontFace=true',
    withInfo({
      text: description,
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloudTreemap
          waitForFontFace
          fontFamily="Alfa Slab One"
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>)),
  )
  .add(
    'with height=50',
    withInfo({
      text: description,
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloudTreemap
          height={50}
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>)),
  )
  .add(
    'with width=150',
    withInfo({
      text: description,
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloudTreemap
          width={150}
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>)),
  )
  .add(
    'with height=150 and width=750',
    withInfo({
      text: description,
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloudTreemap
          width={750}
          height={150}
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>)),
  )
  .add(
    'with maxFontSize=30',
    withInfo({
      text: description,
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloudTreemap
          maxFontSize={30}
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>)),
  )
  .add(
    'with minFontSize=15',
    withInfo({
      text: description,
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloudTreemap
          minFontSize={15}
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>)),
  )
  .add(
    'with minFontSize=15 and maxFontSize=30',
    withInfo({
      text: description,
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloudTreemap
          maxFontSize={30}
          minFontSize={15}
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>)),
  );


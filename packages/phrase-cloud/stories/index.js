/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';

import { storiesOf } from '@storybook/react'; // eslint-disable-line
import { withInfo } from '@storybook/addon-info'; // eslint-disable-line

import PhraseCloud from '../src';

require('../css/styles.css');

const description = (
  <div>
    <p>
      Word clouds have been a staple of big data visualization for some time,
      NRC recommendation algorithms however leverage more than just single
      words, but phrases.  This component can be used to visualize these
      phrases to end users.
    </p>
  </div>
);

storiesOf('PhraseCloud', module)
  .add(
    'Minimum config ( phrases )',
    withInfo({
      text: description,
      header: true,
      inline: true,
      source: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloud
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>
    )),
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
        <PhraseCloud
          waitForFontFace
          fontFamily="Alfa Slab One"
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>
    )),
  )
  .add(
    'with height=50',
    withInfo({
      header: true,
      inline: true,
      source: false,
      propTables: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloud
          height={50}
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>
    )),
  )
  .add(
    'with width=150',
    withInfo({
      header: true,
      inline: true,
      source: false,
      propTables: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloud
          width={150}
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>
    )),
  )
  .add(
    'with height=150 and width=750',
    withInfo({
      header: true,
      inline: true,
      source: false,
      propTables: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloud
          width={750}
          height={150}
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>
    )),
  )
  .add(
    'with placement=grid',
    withInfo({
      header: true,
      inline: true,
      source: false,
      propTables: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloud
          placement="grid"
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>
    )),
  )
  .add(
    'with placement=random',
    withInfo({
      header: true,
      inline: true,
      source: false,
      propTables: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloud
          placement="random"
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>
    )),
  )
  .add(
    'with placement=onion',
    withInfo({
      header: true,
      inline: true,
      source: false,
      propTables: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloud
          placement="onion"
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>
    )),
  )
  .add(
    'with maxFontSize=30',
    withInfo({
      header: true,
      inline: true,
      source: false,
      propTables: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloud
          maxFontSize={30}
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>
    )),
  )
  .add(
    'with minFontSize=15',
    withInfo({
      header: true,
      inline: true,
      source: false,
      propTables: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloud
          minFontSize={15}
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>
    )),
  )
  .add(
    'with minFontSize=15 and maxFontSize=30',
    withInfo({
      header: true,
      inline: true,
      source: false,
      propTables: false,
    })(() => (
      <div style={{ margin: '20px' }}>
        <PhraseCloud
          maxFontSize={30}
          minFontSize={15}
          phrases={[
            { text: 'hello world', size: 10 },
            { text: 'these are phrases', size: 7 },
            { text: 'not words', size: 5 },
            { text: 'I am not an important phrase', size: 1 },
          ]}
        />
      </div>
    )),
  );


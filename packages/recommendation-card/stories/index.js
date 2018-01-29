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

import RecommendationCard from '../src/RecommendationCard';
import CardContainer from '../src/CardContainer';
import '../css/card-container-style.css';
import '../css/card-style.css';

storiesOf('RecommendationCard', module)
  .add(
    'gcpedia-article with string description',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <RecommendationCard
        key={`card${Math.random() * 1000}`}
        type="gcpedia-article"
        title="this is a short title"
        rank={1}
        phrases={[
        { text: 'word', size: 0.3 },
        { text: 'phrase cloud', size: 1 },
      ]}
      />
    )),
  )
  .add(
    'unknown with string description',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <RecommendationCard
        key={`card${Math.random() * 1000}`}
        type="unknown"
        title="this is a short title"
        rank={1}
        phrases={[
        { text: 'word', size: 0.3 },
        { text: 'phrase cloud', size: 1 },
      ]}
      />
    )),
  )
  .add(
    'gcpedia-article with string description in ListView mode',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <RecommendationCard
        key={`card${Math.random() * 1000}`}
        type="gcpedia-article"
        title="this is a short title"
        rank={1}
        listView
        phrases={[
        { text: 'word', size: 0.3 },
        { text: 'phrase cloud', size: 1 },
      ]}
      />
    )),
  )
  .add(
    'unknown with string description in ListView mode',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <RecommendationCard
        key={`card${Math.random() * 1000}`}
        type="unknown"
        title="this is a short title"
        rank={1}
        listView
        phrases={[
        { text: 'word', size: 0.3 },
        { text: 'phrase cloud', size: 1 },
      ]}
      />
    )),
  );

storiesOf('CardContainer', module)
  .add(
    'Container with 1 card',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <CardContainer
        loaded
        cards={[
          <RecommendationCard
            key="card0"
            type="tweet"
            title="this is a short title"
            rank={1}
            phrases={[
            { text: 'word', size: 0.3 },
            { text: 'phrase cloud', size: 1 },
          ]}
          />,
        ]}
      />
    )),
  )
  .add(
    'Container with no cards',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <CardContainer loaded />
    )),
  )
  .add(
    'Container with loaded=false',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <CardContainer />
    )),
  )

  .add(
    'Container with 10 cards',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <CardContainer
        loaded
        cards={[
          <RecommendationCard
            key="card1"
            type="tweet"
            title="this is a short title"
            rank={1}
            touched={new Date() / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card2"
            type="gcpedia-article"
            title="this is a short title"
            rank={1}
            touched={new Date() / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card3"
            type="gcprofile-user"
            title="this is a short title"
            rank={1}
            touched={new Date('01/01/2017') / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card4"
            type="gcpedia-article"
            title="this is a short title"
            rank={1}
            touched={new Date('01/01/2017') / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card5"
            type="tweet"
            title="this is a short title"
            rank={1}
            touched={new Date('01/01/2017') / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card6"
            type="gcpedia-article"
            title="this is a short title"
            rank={1}
            touched={new Date('01/01/2016') / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card7"
            type="tweet"
            title="this is a short title"
            rank={1}
            touched={new Date('01/01/2016') / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card8"
            type="gcpedia-article"
            title="this is a short title"
            rank={1}
            touched={new Date('01/01/2015') / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card9"
            type="gcprofile-user"
            title="this is a short title"
            rank={1}
            touched={new Date('01/01/2014') / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card10"
            type="gcpedia-article"
            title="this is a short title"
            rank={1}
            touched={new Date('01/01/2014') / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
  ]}
      />)),
  )
  .add(
    'Container with 1 card in Drawer View Mode',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <CardContainer
        loaded
        cards={[
          <RecommendationCard
            key="card0"
            type="tweet"
            title="this is a short title"
            rank={1}
            phrases={[
            { text: 'word', size: 0.3 },
            { text: 'phrase cloud', size: 1 },
          ]}
          />,
        ]}
      />
    )),
  )
  .add(
    'Container with no cards  in Drawer View Mode',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <CardContainer loaded />
    )),
  )
  .add(
    'Container with 10 cards in Drawer View Mode',
    withInfo({
      header: true,
      inline: true,
      source: false,
    })(() => (
      <CardContainer
        loaded
        drawerView
        cards={[
          <RecommendationCard
            key="card1"
            type="tweet"
            title="this is a short title"
            rank={1}
            listView
            touched={new Date() / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card2"
            type="gcpedia-article"
            title="this is a short title"
            rank={1}
            listView
            touched={new Date() / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card3"
            type="gcprofile-user"
            title="this is a short title"
            rank={1}
            listView
            touched={new Date('01/01/2017') / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card4"
            type="gcpedia-article"
            title="this is a short title"
            rank={1}
            listView
            touched={new Date('01/01/2017') / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card5"
            type="tweet"
            title="this is a short title"
            rank={1}
            listView
            touched={new Date('01/01/2017') / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card6"
            type="gcpedia-article"
            title="this is a short title"
            rank={1}
            listView
            touched={new Date('01/01/2016') / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card7"
            type="tweet"
            title="this is a short title"
            rank={1}
            listView
            touched={new Date('01/01/2016') / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card8"
            type="gcpedia-article"
            title="this is a short title"
            rank={1}
            listView
            touched={new Date('01/01/2015') / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card9"
            type="gcprofile-user"
            title="this is a short title"
            rank={1}
            listView
            touched={new Date('01/01/2014') / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
          <RecommendationCard
            key="card10"
            type="gcpedia-article"
            title="this is a short title"
            rank={1}
            listView
            touched={new Date('01/01/2014') / 1000}
            phrases={[
          { text: 'word', size: 0.3 },
          { text: 'phrase cloud', size: 1 },
        ]}
          />,
  ]}
      />)),
  );

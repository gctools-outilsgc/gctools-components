/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import { CardContainer }
  from '@gctools-components/recommendation-card';

import Demo from '../../demo';

const loremIpsum = 'Fusce luctus dui quis ipsum commodo';

const demo = () => (
  <div>
    <Demo
      name="CardContainer"
      component={CardContainer}
      title={__('Card Container')}
    >
      <CardContainer
        loaded
        floating
        cards={[
          {
            type: 'gcpedia-article',
            title: loremIpsum,
            rank: 1,
            phrases: [
              { text: 'word', size: 0.4 },
              { text: 'phrase cloud', size: 0.7 },
              { text: 'GCTools', size: 1 },
              { text: 'NRC', size: 0.9 },
            ],
          },
          {
            type: 'gcpedia-article',
            title: loremIpsum,
            rank: '.985676',
            phrases: [
              { text: 'word', size: 0.4 },
              { text: 'phrase cloud', size: 0.7 },
              { text: 'GCTools', size: 1 },
              { text: 'NRC', size: 0.9 },
            ],
          },
          {
            type: 'gcpedia-article',
            title: loremIpsum,
            rank: '.9543',
            phrases: [
              { text: 'word', size: 0.4 },
              { text: 'phrase cloud', size: 0.7 },
              { text: 'GCTools', size: 1 },
              { text: 'NRC', size: 0.9 },
            ],
          },
          {
            type: 'gcpedia-article',
            title: loremIpsum,
            rank: '.91234',
            phrases: [
              { text: 'word', size: 0.4 },
              { text: 'phrase cloud', size: 0.7 },
              { text: 'GCTools', size: 1 },
              { text: 'NRC', size: 0.9 },
            ],
          },
          {
            type: 'gcpedia-article',
            title: loremIpsum,
            rank: '.87463',
            phrases: [
              { text: 'word', size: 0.4 },
              { text: 'phrase cloud', size: 0.7 },
              { text: 'GCTools', size: 1 },
              { text: 'NRC', size: 0.9 },
            ],
          },
          {
            type: 'gcpedia-article',
            title: loremIpsum,
            rank: '.8347',
            phrases: [
              { text: 'word', size: 0.4 },
              { text: 'phrase cloud', size: 0.7 },
              { text: 'GCTools', size: 1 },
              { text: 'NRC', size: 0.9 },
            ],
          },
          {
            type: 'gcpedia-article',
            title: loremIpsum,
            rank: '.77955',
            phrases: [
              { text: 'word', size: 0.4 },
              { text: 'phrase cloud', size: 0.7 },
              { text: 'GCTools', size: 1 },
              { text: 'NRC', size: 0.9 },
            ],
          },
        ]}
      />
    </Demo>
  </div>
);

export default LocalizedComponent(demo);

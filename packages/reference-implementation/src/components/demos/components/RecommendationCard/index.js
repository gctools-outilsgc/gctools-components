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

import RecommendationCard, { CardContainer }
  from '@gctools-components/recommendation-card';

import Demo from '../../demo';

const loremIpsum = 'Fusce luctus dui quis ipsum commodo';

const demo = () => (
  <div>
    <Demo
      name="RecommendationCard"
      component={RecommendationCard}
      title={__('Recommendation Card')}
    >
      <RecommendationCard
        type="gcpedia-article"
        title={loremIpsum}
        rank={1}
        phrases={[
          { text: 'word', size: 0.4 },
          { text: 'phrase cloud', size: 0.7 },
          { text: 'GCTools', size: 1 },
          { text: 'NRC', size: 0.9 },
        ]}
      />
    </Demo>
    <Demo
      name="CardContainer"
      component={CardContainer}
      title={__('Card Container')}
    >
      <CardContainer
        loaded
        cards={[
          <RecommendationCard
            key="1"
            type="gcpedia-article"
            title={loremIpsum}
            rank={1}
          />,
          <RecommendationCard
            key="2"
            type="tweet"
            title={loremIpsum}
            rank={0.98453}
          />,
          <RecommendationCard
            key="3"
            type="gcprofile-user"
            title={loremIpsum}
            rank={0.732876832}
          />,
      ]}
      />
    </Demo>
  </div>
);

export default LocalizedComponent(demo);

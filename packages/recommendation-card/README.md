
# Recommendation card

Recommendation cards provide a consistent interface for recommendations
throughout GCTools and potentially other GoC sites.

## Installation

```
yarn add @gctools-components/recommendation-card
```

## Usage

```
import React from 'react';
import RecommendationCard, { CardContainer }
  from '@gctools-components/recommendation-card';

const demo = () => (
  <CardContainer
    loaded
    cards={[
      <RecommendationCard
        key="1"
        type="gcpedia-article"
        title="testing 123"
        rank={1}
      />,
  ]}
  />
);

export default demo;
```

## Copyright
© Her Majesty the Queen in Right of Canada, as represented by the Minister of
the National Research Council, 2017

/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2018
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RecommendationCard, { CardContainer }
  from '@gctools-components/recommendation-card';

const TEMP_MAX = 3;

/**
 * Reference Implementation of GCconnex integration
 */
// eslint-disable-next-line
class GcconnexRefImpl extends Component {
  render() {
    // const gcpediaUrl = 'http://gcpedia.gctools.nrc.ca/index.php';
    const { loading, recommendations, context } = this.props;
    // const target = (context !== 'article_c5') ? '' : '_blank';
    if (context === 'login') return null;

    let loaded = false;
    let cards = [];
    if (!loading) {
      if ((recommendations !== null) && (recommendations.length > 0)) {
        loaded = true;
        cards = recommendations.slice(0, TEMP_MAX).map(r => (
          <RecommendationCard
            className="grid-item"
            key={`rec_article_${r.id}`}
            type="gcpedia-article"
            title={r.title}
            rank={r.rank}
            phrases={r.phraseCloud.map(pc =>
              ({ text: pc.phrase, size: pc.rank }))
            }
          />
        ));
      } else if (recommendations !== null) {
        loaded = true;
      }
    }
    return (
      <CardContainer loaded={loaded} cards={cards} />
    );
  }
}

GcconnexRefImpl.defaultProps = {
  recommendations: [],
  loading: false,
};

GcconnexRefImpl.propTypes = {
  /** Array of recommended articles */
  recommendations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    title: PropTypes.string.isRequired,
    rank: PropTypes.number.isRequired,
    phraseCloud: PropTypes.arrayOf(PropTypes.shape({
      phrase: PropTypes.string.isRequired,
      rank: PropTypes.number.isRequired,
    })).isRequired,
  })),
  /** True when network request is underway, false when completed */
  loading: PropTypes.bool,
  /** Current component context */
  context: PropTypes.oneOf([
    'login',
    'article_c1',
    'article_c2',
    'article_c3',
    'article_c4',
    'article_c5',
  ]).isRequired,

};


export default GcconnexRefImpl;


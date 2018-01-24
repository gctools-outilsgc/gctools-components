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

/**
 * Reference Implementation of GCconnex integration
 */
// eslint-disable-next-line
class GcconnexRefImpl extends Component {
  constructor() {
    super();
    this.state = {
      recommendations: null,
    };
  }
  componentWillReceiveProps(next) {
    if (next.loading) {
      this.setState({ recommendations: null });
    } else if (!next.loading && this.props.loading) {
      let lastBin = '';
      let filter = 0.5;
      const nextRecommendations = next.recommendations;
      const recommendations = [];
      nextRecommendations.forEach((r) => {
        const year = new Date(parseInt(r.touched, 2) * 1000).getFullYear();
        if (lastBin !== year) {
          filter = r.rank / 2;
          lastBin = year;
        }
        if (r.rank > filter) recommendations.push(r);
      });
      this.setState({ recommendations });
    }
  }
  render() {
    const { loading, context } = this.props;
    const { recommendations } = this.state;
    if (context === 'login') return null;

    const appContext = (context === 'article_c5') ? 'gcconnex' : 'gcpedia';

    let loaded = false;
    let cards = [];
    if (!loading) {
      if ((recommendations !== null) && (recommendations.length > 0)) {
        loaded = true;
        cards = recommendations.map(r => (
          <RecommendationCard
            className="grid-item"
            key={`rec_article_${r.id}`}
            type="gcpedia-article"
            title={r.title}
            context={appContext}
            touched={r.touched}
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
  recommendations: PropTypes.arrayOf(PropTypes.shape({ // eslint-disable-line
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


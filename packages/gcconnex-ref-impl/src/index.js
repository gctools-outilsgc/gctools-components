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

/**
 * Reference Implementation of GCconnex integration
 */
// eslint-disable-next-line
class GcconnexRefImpl extends Component {
  render() {
    const gcpediaUrl = 'http://gcpedia.gctools.nrc.ca/index.php';
    const { loading, recommendations, context } = this.props;
    const target = (context !== 'article_c5') ? '' : '_blank';
    let recommendationOutput = null;
    if (!loading) {
      if (recommendations === null) {
        recommendationOutput = <strong>Not yet available...</strong>;
      } else if (recommendations.length === 0) {
        recommendationOutput = <strong>No recommendations</strong>;
      } else {
        recommendationOutput = (
          <ul key="rec_article_list">
            {recommendations.map(r => (
              <li key={`rec_article_${r.id}`}>
                <h4>
                  <a target={target} href={`${gcpediaUrl}/${r.title}`}>
                    {r.title}
                  </a>
                </h4>
                {r.rank}<br />
                {r.phraseCloud.map(pc => pc.phrase).join(', ')}
              </li>
            ))}
          </ul>
        );
      }
    }
    if (context === 'login') return null;
    return (
      <div>
        <div>
          <h1>Article recommendations</h1>
          {(loading) ? <p>Loading</p> : recommendationOutput}
        </div>
      </div>
    );
  }
}

GcconnexRefImpl.defaultProps = {
  recommendations: [],
  loading: false,
  context: 'article_c5',
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
  context: PropTypes.oneOf(['login', 'article_c5']),
};


export default GcconnexRefImpl;


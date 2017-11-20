/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';
import RecommendationCard, { CardContainer }
  from '@gctools-components/recommendation-card';

const reqwest = require('reqwest');

class ArticleRecommendations extends React.Component {
  constructor() {
    super();
    this.state = {
      recommendations: [],
      loaded: false,
    };
  }
  componentDidMount() {
    reqwest('http://132.246.129.105:6543/recommend/c1/70/', (data) => {
      const parsed = JSON.parse(data);
      const sliced = parsed[1].slice(0, 3);
      const recommendations = [];
      sliced.map((recdata) => {
        const [articleId, rank, clusterId, title, ph] = recdata;
        recommendations.push({
          rank,
          clusterId,
          title,
          articleId,
          phrases: Object.keys(ph).map(p => ({ text: p, size: ph[p] })),
          type: 'gcpedia-article',
        });
        return null;
      });
      this.setState({ recommendations, loaded: true });
    });
  }
  render() {
    return (
      <div>
        <CardContainer
          loaded={this.state.loaded}
          cards={this.state.recommendations.map(rec =>
            (<RecommendationCard
              className="grid-item"
              key={`article_${rec.articleId}`}
              rank={rec.rank}
              title={rec.title}
              phrases={rec.phrases}
              type={rec.type}
            />))}
        />
      </div>
    );
  }
}

export default ArticleRecommendations;

/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TwitterCircle from 'material-ui-community-icons/icons/twitter-circle';
import HelpCircle from 'material-ui-community-icons/icons/help-circle';
import AccountCircle from 'material-ui-community-icons/icons/account-circle';
import FileDocument from 'material-ui-community-icons/icons/file-document';
import StarRatingComponent from 'react-star-rating-component';
import Dotdotdot from 'react-dotdotdot';
import ReactTooltip from 'react-tooltip';
import 'font-awesome/css/font-awesome.min.css';

import WordCloud from './WordCloud';

import '../css/fonts.css';
import '../css/card-style.css';

const FontAwesome = require('react-fontawesome');

/**
 * Recommendation cards provide a consistent interface for recommendations
 * throughout GCTools and potentially other GoC sites.
 */
class RecommendationCard extends Component {
  constructor() {
    super();
    this.cloudElement = false;
    this.cloudLayout = false;
    this.restartCount = 0;
    this.handleCardClick = this.handleCardClick.bind(this);
  }

  handleCardClick() {
    if (this.props.type !== 'gcprofile-user') {
      window.open(`http://www.gcpedia.gc.ca/wiki/${this.props.title}`);
    }
  }

  render() {
    let header = <span />;
    const headerStyle = {
      display: 'flex',
      alignItems: 'center',
      fontFamily: 'Roboto, sans-serif',
    };
    switch (this.props.type) {
      case 'tweet':
        header = (
          <div style={headerStyle}>
            <TwitterCircle
              color="#00aced"
              style={{ height: '50px', width: '50px', marginRight: '15px' }}
            />
            <h3>Tweet</h3>
          </div>
        );
        break;
      case 'gcpedia-article':
        header = (
          <div style={headerStyle}>
            <FileDocument
              data-tip="GCPedia Article"
              color="#1c507f"
              style={{ height: '50px', width: '50px' }}
            />
          </div>
        );
        break;
      case 'gcprofile-user':
        header = (
          <div style={headerStyle}>
            <AccountCircle
              color="#0375b4"
              style={{ height: '50px', width: '50px', marginRight: '15px' }}
            />
            <h3>GCprofile User</h3>
          </div>
        );
        break;
      default:
        header = (
          <div style={headerStyle}>
            <HelpCircle
              style={{ height: '50px', width: '50px', marginRight: '15px' }}
            />
            <h3>Unknown</h3>
          </div>
        );
    }
    let score = null;
    const showExtra = this.props.type !== 'gcprofile-user';

    if (typeof this.props.rank === 'number' && showExtra) {
      score = (
        <div className="score-text">
          <div className="score-star-rating">
            <span className="star-rating">
              <StarRatingComponent
                name={`star-rating${Math.random * 1000}`}
                starCount={5}
                value={
                  Math
                    .floor(parseFloat(this.props.rank * 5).toFixed(2) * 2) / 2
                }
                starColor="#F49633"
                renderStarIcon={
                  (index, value) =>
                    <FontAwesome name={index <= value ? 'star' : 'star-o'} />
                }
                renderStarIconHalf={() => (
                  <FontAwesome
                    name="star-half-full"
                    style={{ color: '#F49633' }}
                  />
                )}
                editing={false}
              />
            </span>
          </div>
        </div>
      );
    }

    const cardStyle = {
      fontFamily: 'Roboto, helvetica, arial, sans-serif',
      padding: '15px',
      cursor: (showExtra) ? 'pointer' : '',
    };
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Paper
          className={this.props.className}
          style={cardStyle}
          zDepth={1}
          onClick={this.handleCardClick}
        >
          <div style={{ height: '9ex' }}>
            <Dotdotdot clamp={3}>
              <h3 className="article-title">{this.props.title}</h3>
            </Dotdotdot>
          </div>
          <div className="wordcloud-score-div">
            {showExtra
              ?
                <h3 className="heading">Matching Characteristics</h3>
              :
                false
            }
            <div
              style={{
                textAlign: 'center',
                marginTop: '15px',
                overflow: 'hidden',
              }}
            >
              <WordCloud phrases={this.props.phrases} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {score}
              {header}
            </div>
          </div>
          <ReactTooltip className="tooltip" effect="solid" />
        </Paper>
      </MuiThemeProvider>
    );
  }
}

RecommendationCard.defaultProps = {
  title: 'Default Recommendation',
  type: 'unknown',
  phrases: [],
  rank: 1,
  className: '',
};

RecommendationCard.propTypes = {
  /**
   * Title of the recommendation card, can be simple text or a node.
   */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * A string describing what type of resource is being recommended.
   *
   * Accepted values: 'gcprofile-user', 'gcpedia-article', 'tweet', 'unknown'
   */
  type: PropTypes.oneOf([
    'gcprofile-user',
    'gcpedia-article',
    'tweet',
    'unknown',
  ]),
  /**
   * Overall rank of a recommendation within a set of recommendations.
   */
  rank: PropTypes.number,
  /**
   * Array of objects of the form { text, size } representing a phrase
   * cloud, where size is the relative importance of the phrase within the set
   */
  phrases: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    size: PropTypes.number,
  })),
  /**
   * CSS class name to give the containing Paper element.
   */
  className: PropTypes.string,
};

export default RecommendationCard;

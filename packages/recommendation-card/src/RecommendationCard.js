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
import { RaisedButton } from 'material-ui';
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
    switch (this.props.type) {
      case 'tweet':
        header = (
          <div className="header">
            <TwitterCircle
              color="#fff"
              style={{ height: '20px', width: '20px', marginRight: '3px' }}
            />
            <h5>Tweet</h5>
          </div>
        );
        break;
      case 'gcpedia-article':
        // header = (
        //   <div className="header">
        //     <FileDocument
        //       data-tip="GCPedia Article"
        //       color="#fff"
        //       style={{ height: '20px', width: '20px', marginRight: '3px' }}
        //     />
        //     <h5>GCPedia Article</h5>
        //   </div>
        // );
        header = (
          <h5 className="header-new">Article Title</h5>
        );
        break;
      case 'gcprofile-user':
        header = (
          <div className="header">
            <AccountCircle
              color="#fff"
              style={{ height: '20px', width: '20px', marginRight: '3px' }}
            />
            <h5>GCprofile User</h5>
          </div>
        );
        break;
      default:
        header = (
          <div className="header">
            <HelpCircle
              style={{ height: '20px', width: '20px', marginRight: '3px' }}
            />
            <h5>Unknown</h5>
          </div>
        );
    }
    let score = null;
    const showExtra = this.props.type !== 'gcprofile-user';

    if (typeof this.props.rank === 'number' && showExtra) {
      score = (
        <div className="star-rating">
          <h5>Overall Rating</h5>
          <StarRatingComponent
            name={`star-rating${Math.random * 1000}`}
            starCount={5}
            value={
              Math
                .floor(parseFloat(this.props.rank * 5).toFixed(2) * 2) / 2
            }
            style={{ display: 'inline' }}
            starColor="#014c75"
            renderStarIcon={
              (index, value) =>
                <FontAwesome name={index <= value ? 'star' : 'star-o'} />
            }
            renderStarIconHalf={() => (
              <FontAwesome
                name="star-half-full"
                style={{ color: '#014c75' }}
              />
            )}
            editing={false}
          />
        </div>
      );
    }

    const cardStyle = {
      fontFamily: 'Roboto, helvetica, arial, sans-serif',
      padding: '15px',
    };
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Paper
          className={this.props.className}
          style={cardStyle}
          zDepth={1}
        >
          {header}
          <div style={{ height: '9ex' }}>
            <Dotdotdot clamp={3}>
              <h3 className="article-title">{this.props.title}</h3>
            </Dotdotdot>
          </div>
          <div className="wordcloud-score-div">
            {showExtra
              ?
                <h5 className="heading">Matching Characteristics</h5>
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
              <WordCloud
                phrases={this.props.phrases}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ alignSelf: 'flex-end' }}>
                <RaisedButton onClick={this.handleCardClick} buttonStyle={{ fontSize: 'small' }}>
                  View Article
                </RaisedButton>
              </div>
              {score}
            </div>
          </div>
          <div className="article-bottom"><h5>GCPedia Article</h5></div>
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

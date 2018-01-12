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
import { Card, CardHeader }
  from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TwitterCircle from 'material-ui-community-icons/icons/twitter-circle';
import HelpCircle from 'material-ui-community-icons/icons/help-circle';
import AccountCircle from 'material-ui-community-icons/icons/account-circle';
import { IconButton } from 'material-ui';
import SocialShare from 'material-ui/svg-icons/social/share';
import 'font-awesome/css/font-awesome.min.css';
import CircularProgressbar from 'react-circular-progressbar';
import WordCloud from './WordCloud';

import '../css/fonts.css';
import '../css/card-style.css';

const gcpedia = require('../img/gcpedia.jpg');

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
        header = (
          <CardHeader
            title={this.props.title}
            subtitle="GCpedia"
            avatar={gcpedia}
            titleStyle={{
              fontFamily: "'Anton', sans-serif",
            }}
          />
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
      const percentage = parseFloat(this.props.rank * 100).toFixed(0);
      score = (
        <div className="score-circle">
          <CircularProgressbar
            percentage={percentage}
            textForPercentage={() => `${percentage}%`}
            strokeWidth={10}
            initialAnimation
          />
        </div>
      );
    }
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Card className="grid-item card">
          {header}
          <div className="card-padding">
            {showExtra
              ?
                <div className="phrases-heading-border-top">
                  <div className="phrases-heading-text">
                    Top Matching Profile Phrases
                  </div>
                </div>
              :
                false
            }
            <div
              style={{
                textAlign: 'center',
                overflow: 'hidden',
              }}
            >
              <WordCloud
                phrases={this.props.phrases}
              />
            </div>
            <div className="phrases-heading-border-bottom" />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '10px',
                }}
            >
              <div style={{ alignSelf: 'flex-end' }}>
                <IconButton
                  tooltip="Share"
                  tooltipPosition="top-center"
                  disableTouchRipple
                >
                  <SocialShare />
                </IconButton>
              </div>
              {score}
            </div>
          </div>
        </Card>
      </MuiThemeProvider>
    );
  }
}

RecommendationCard.defaultProps = {
  title: 'Default Recommendation',
  type: 'unknown',
  phrases: [],
  rank: 1,
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
};

export default RecommendationCard;

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
import { Card } from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TwitterCircle from 'material-ui-community-icons/icons/twitter-circle';
import HelpCircle from 'material-ui-community-icons/icons/help-circle';
import AccountCircle from 'material-ui-community-icons/icons/account-circle';
import { IconButton } from 'material-ui';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import SocialShare from 'material-ui/svg-icons/social/share';
import ToggleStar from 'material-ui/svg-icons/toggle/star';
import ToggleStarBorder from 'material-ui/svg-icons/toggle/star-border';
import Toggle from 'material-ui/Toggle';
import 'font-awesome/css/font-awesome.min.css';
import WordCloud from './WordCloud';

import '../css/fonts.css';
import '../css/card-style.css';

const gcpedia = require('../img/gcpedia.jpg');
const Rating = require('react-rating');

/**
 * Recommendation cards provide a consistent interface for recommendations
 * throughout GCTools and potentially other GoC sites.
 */
class RecommendationCard extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
    };
    this.cloudElement = false;
    this.cloudLayout = false;
    this.restartCount = 0;
    this.handleClick = this.handleClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleClick() {
    window.open(
      `http://gcpedia.gctools.nrc.ca/index.php/${this.props.title}`,
      (this.props.context === 'gcpedia') ? '_self' : '_blank',
    );
  }

  handleToggle() {
    this.setState({ expanded: !this.state.expanded });
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
          <ListItem
            key="listKeyTitle"
            leftAvatar={<Avatar src={gcpedia} />}
            primaryText={<div className="card-title">{this.props.title}</div>}
            secondaryText={<div className="card-subtitle">GCpedia</div>}
            hoverColor="none"
            onClick={this.handleClick}
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
      const rating = (this.props.rank * 10) / 2;
      score = (
        <div style={{ alignSelf: 'flex-end', marginBottom: '-7px' }}>
          <div className="rating-border">
            <Rating
              stop={5}
              readonly
              emptySymbol={
                <ToggleStarBorder
                  color="#0375b4"
                  style={{ width: '15px' }}
                />
              }
              fullSymbol={
                <ToggleStar
                  color="#0375b4"
                  style={{ width: '15px' }}
                />
              }
              fractions={2}
              initialRating={rating}
            />
          </div>
        </div>
      );
    }
    let phraseCloud; // for non list view mode
    if (this.state.expanded) {
      phraseCloud = (
        <div style={{ marginTop: '30px' }}>
          <div className="phrases-heading-text-listview">
            Top Matching Profile Phrases
          </div>
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
        </div>
      );
    }
    const cardBottom = (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: '35px',
        }}
      >
        <div style={{ alignSelf: 'flex-end' }}>
          <IconButton
            disableTouchRipple
            style={{ bottom: '-13px', left: '-12px' }}
          >
            <SocialShare color="#0375b4" />
          </IconButton>
        </div>
        {score}
      </div>
    );
    let retVal;
    if (this.props.listView === true) {
      retVal = (
        <div>
          {header}
          <div className="card-padding-listview">
            <div>
              <Toggle
                toggled={this.state.expanded}
                onToggle={this.handleToggle}
                labelPosition="left"
                label="Why this article?"
                labelStyle={{ fontSize: '13px' }}
              />
            </div>
            {phraseCloud}
            {cardBottom}
          </div>
          <Divider />
        </div>
      );
    } else {
      retVal = (
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
            <div className="wordcloud-container">
              <WordCloud
                phrases={this.props.phrases}
              />
            </div>
            <div className="phrases-heading-border-bottom" />
            {cardBottom}
          </div>
        </Card>
      );
    }
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        {retVal}
      </MuiThemeProvider>
    );
  }
}

RecommendationCard.defaultProps = {
  title: 'Default Recommendation',
  context: 'other',
  type: 'unknown',
  phrases: [],
  rank: 1,
  listView: false,
  touched: 0,
};

RecommendationCard.propTypes = {
  /**
   * Title of the recommendation card, can be simple text or a node.
   */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /**
   * Context where this card is being displayed
   */
  context: PropTypes.oneOf(['gcconnex', 'gcpedia', 'other']),
  /** Timestamp of latest modification */
  touched: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
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
  listView: PropTypes.bool,
};

export default RecommendationCard;

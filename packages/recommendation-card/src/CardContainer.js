/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React, { Component } from 'react';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Drawer from 'material-ui/Drawer';

import '../css/card-container-style.css';
import { fade } from 'material-ui/utils/colorManipulator';

const nrcLogo = require('../img/nrclogo.png');

// const Masonry = require('react-masonry-component');

/**
 * Container component to hold multiple recommendation cards
 */
class ContainerLarge extends Component {
  constructor() {
    super();
    this.state = {
      hasError: false,
      cardsShown: 3,
      drawerOpen: false,
    };
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleOpenDrawer = this.handleOpenDrawer.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
  }

  handleLoadMore() {
    this.setState({ cardsShown: this.state.cardsShown + 3 });
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  handleOpenDrawer() {
    this.setState({ drawerOpen: true });
  }

  handleDrawerClose() {
    this.setState({ drawerOpen: false });
  }

  render() {
    let content = null;
    const cards = this.props.cards.slice(0, this.state.cardsShown);

    let loadMore;
    if (this.state.cardsShown < this.props.cards.length) {
      loadMore = (
        <div className="load-more">
          <MuiThemeProvider muiTheme={getMuiTheme()}>
            <FlatButton
              label="Load More"
              onClick={this.handleLoadMore}
            />
          </MuiThemeProvider>
        </div>
      );
    }
    if (!this.props.loaded &&
        !this.state.hasError &&
        (this.props.noloader === false || this.props.noloader === undefined)) {
      content = (
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div style={{ width: '100%', textAlign: 'center' }}>
            <RefreshIndicator
              size={40}
              left={10}
              top={0}
              status="loading"
              style={{
                display: 'inline-block',
                position: 'relative',
                boxShadow: 'none',
              }}
            />
          </div>
        </MuiThemeProvider>
      );
    } else if (this.state.hasError) {
      content = <h4 className="full-width">An error has occured.</h4>;
    } else if (this.props.cards.length === 0) {
      content = <h4 className="full-width">No recommendations.</h4>;
    } else if (this.props.floating) {
      content = (
        <div className="recommendations-container">
          {cards.map(card => (
            <div>
              {card.title}
            </div>
          ))}
        </div>
      );
    } else {
      // content = (
      //   <Masonry
      //     className="recommendations-container"
      //     options={{
      //       gutter: 15,
      //       transitionDuration: 0,
      //       percentPosition: true,
      //       itemSelector: '.grid-item',
      //       columnWidth: '.grid-sizer',
      //     }}
      //   >
      //     <div className="grid-sizer" key="masonryKey" />
      //     {this.props.cards}
      //   </Masonry>
      // );
      content = (
        <div className="recommendations-container">
          {cards}
        </div>
      );
    }
    let retVal;
    if (this.props.floating) {
      retVal = (
        <div>
          <Drawer
            width={200}
            openSecondary
            docked={false}
            open={this.state.drawerOpen}
            onRequestChange={this.handleDrawerClose}
          >
            yooo
          </Drawer>
          <FloatingActionButton
            onClick={this.handleOpenDrawer}
            style={{ position: 'absolute', bottom: '15px', right: '15px' }}
          >
            <ContentAdd />
          </FloatingActionButton>
        </div>
      );
    } else {
      retVal = (
        <div className="fieldset-container">
          <div
            className="fieldset-heading-text"
            style={{
              backgroundColor: this.props.bgcolour,
            }}
          >
            Article Recommendations
          </div>
          {content}
          {loadMore}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              position: 'relative',
              bottom: '-15px',
            }}
          >
            <span
              style={{
                backgroundColor: this.props.bgcolour,
              }}
            >
              <img className="nrc-logo" src={nrcLogo} alt="NRC" />
            </span>
          </div>
        </div>
      );
    }
    return retVal;
  }
}

ContainerLarge.styles = {
  'blockquote.twitter-tweet': {
    border: 'none',
  },
};

ContainerLarge.propTypes = {
  loaded: PropTypes.bool,
  noloader: PropTypes.bool,
  cards: PropTypes.arrayOf(PropTypes.object),
  bgcolour: PropTypes.string,
  floating: PropTypes.bool,
};

ContainerLarge.defaultProps = {
  loaded: true,
  noloader: false,
  cards: [],
  bgcolour: '#fff',
  floating: false,
};

export default ContainerLarge;

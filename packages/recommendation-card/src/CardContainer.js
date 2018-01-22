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
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionViewHeadline from 'material-ui/svg-icons/action/view-headline';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import NavigationChevronRight
  from 'material-ui/svg-icons/navigation/chevron-right';
import Drawer from 'material-ui/Drawer';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import RecommendationCard from './RecommendationCard';
import '../css/card-container-style.css';

const nrcLogo = require('../img/nrclogo.png');
const canadianFlag = require('../img/canadianflag.png');
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
    if (this.props.drawerView) {
      const styles = {
        largeIcon: {
          width: 48,
          height: 48,
        },
      };
      retVal = (
        <div>
          <Drawer
            openSecondary
            docked={false}
            open={this.state.drawerOpen}
            onRequestChange={this.handleDrawerClose}
            overlayStyle={{ background: 'none' }}
            zDepth={4}
            containerStyle={{ zIndex: 9999 }}
            width={350}
          >
            <List
              style={{
                padding: 0,
                minHeight: '100%',
                marginBottom: '-45px',
              }}
            >
              <div key="firstkey" className="fieldset-heading-text-drawer">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ alignSelf: 'center', paddingLeft: '7px' }}>
                    Recommended Articles
                  </span>
                  <span>
                    <IconButton
                      onClick={this.handleDrawerClose}
                    >
                      <NavigationClose />
                    </IconButton>
                  </span>
                </div>
                <Divider />
              </div>
              {this.props.cards.map(card => (
                <RecommendationCard
                  key={`reccard${Math.random() * 1000}`}
                  listView
                  title={card.title}
                  type="gcpedia-article"
                  phrases={card.phrases}
                  rank={card.rank}
                />
              ))}
            </List>
            <div
              key="lastkey"
              className="nrc-sticky"
              style={{
                backgroundImage: `url(${canadianFlag})`,
                // position: 'fixed',
                // display: 'inline-block',
                // width: '100%',
                // overflow: 'hidden',
                height: '45px',
                overflow: 'hidden',
              }}
            >
              <Divider />
              <img className="nrc-logo" src={nrcLogo} alt="NRC" />
            </div>
          </Drawer>
          <div
            className="floating-button"
            onClick={this.handleOpenDrawer}
            role="button"
            tabIndex={0}
            onKeyPress={this.handleOpenDrawer}
          >
            <div className="btn btn-2">
              <span className="txt">Articles</span>
              <span className="round">
                <NavigationChevronRight className="icon" color="white" />
              </span>
            </div>
          </div>
          {/* <FloatingActionButton
            onClick={this.handleOpenDrawer}
            style={{
              position: 'fixed',
              bottom: '15px',
              right: '15px',
            }}
            iconStyle={styles.largeIcon}
          >
            <ActionViewHeadline />
          </FloatingActionButton> */}
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
            Recommended Articles
          </div>
          {content}
          {loadMore}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              position: 'relative',
              bottom: '-25px',
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
  drawerView: PropTypes.bool,
};

ContainerLarge.defaultProps = {
  loaded: true,
  noloader: false,
  cards: [],
  bgcolour: '#fff',
  drawerView: false,
};

export default ContainerLarge;

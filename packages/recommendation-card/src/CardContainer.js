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
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import NavigationChevronRight
  from 'material-ui/svg-icons/navigation/chevron-right';
import Drawer from 'material-ui/Drawer';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import '../css/card-container-style.css';

const nrcLogo = require('../img/nrclogo.png');
const canadianFlag = require('../img/canadianflag.png');

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
    let lastYear = false;
    const cards = (this.props.drawerView) ?
      this.props.cards :
      this.props.cards.slice(0, this.state.cardsShown);
    const cardOutput = [];
    cards.forEach((c) => {
      const year = new Date(parseInt(c.props.touched, 0) * 1000).getFullYear();
      if (year !== lastYear) {
        cardOutput.push( // eslint-disable-line
          <div
            style={{
                backgroundColor: (this.props.drawerView) ? '#f5f8fa' : '',
              }}
            key={`recommendations_${year}`}
          >
            <span
              className={
                  (this.props.drawerView) ? 'drawer-view-year' : 'view-year'
                }
            >
              {year}
            </span>
            <Divider className="divider" />
          </div>);
        lastYear = year;
      }
      cardOutput.push(c);
    });

    if (!this.props.loaded &&
        !this.state.hasError &&
        (this.props.noloader === false || this.props.noloader === undefined)) {
      content = (
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
      );
    } else if (this.state.hasError) {
      content = <div className="error-message">An error has occured</div>;
    } else if (this.props.cards.length === 0) {
      content = <div className="none-message">No recommendations</div>;
    } else {
      content = (
        <div className="recommendations-container">
          {cardOutput}
        </div>
      );
    }
    let loadMore;
    if (this.state.cardsShown < this.props.cards.length) {
      loadMore = (
        <div className="load-more">
          <FlatButton
            label="Load More"
            onClick={this.handleLoadMore}
          />
        </div>
      );
    }
    let retVal;
    if (this.props.drawerView) {
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
                minHeight: 'calc(100% - 45px)',
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
              {content}
            </List>
            <div
              className="nrc-sticky"
              style={{
                backgroundImage: `url(${canadianFlag})`,
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
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        {retVal}
      </MuiThemeProvider>
    );
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

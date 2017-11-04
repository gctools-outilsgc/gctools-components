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

import '../css/card-container-style.css';

const Masonry = require('react-masonry-component');

/**
 * Container component to hold multiple recommendation cards
 */
class ContainerLarge extends Component {
  constructor() {
    super();
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (!this.props.loaded &&
        !this.state.hasError &&
        (this.props.noloader === false || this.props.noloader === undefined)) {
      return (
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
    }
    if (this.state.hasError || !this.props.cards
      || this.props.cards.length === 0) {
      return <div />;
    }
    return (
      <Masonry
        className="recommendations-container"
        options={{
          gutter: 15,
          transitionDuration: 0,
          percentPosition: true,
          itemSelector: '.grid-item',
          columnWidth: '.grid-sizer',
        }}
      >
        <div className="grid-sizer" />
        {this.props.cards}
      </Masonry>
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
  cards: PropTypes.arrayOf(PropTypes.node),
};

ContainerLarge.defaultProps = {
  loaded: true,
  noloader: true,
  cards: [],
};

export default ContainerLarge;

/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';
import D3WordCloud from 'react-d3-cloud';
import PropTypes from 'prop-types';

class WordCloud extends React.Component {
  constructor() {
    super();
    this.state = {
      hasError: false,
      parentNode: null,
      width: null,
    };
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, true);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.parentNode !== nextState.parentNode) {
      this.setState({ width: nextState.parentNode.parentNode.clientWidth });
    }
    if (this.state.width !== nextState.width) {
      return true;
    }
    if (this.props.phrases !== nextProps.phrases) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  handleResize() {
    this.setState({ width: this.state.parentNode.parentNode.clientWidth });
  }

  render() {
    if (this.state.hasError || !this.props.phrases) return null;

    const b = 27; // max font size
    const a = 10; // min font size
    const { phrases } = this.props;
    let min = Math.min(...phrases.map(p => p.size));
    const max = Math.max(...phrases.map(p => p.size));
    if (max === min) {
      min -= 1;
    }
    const fontSizeMapper = x => (((b - a) * (x.size - min)) / (max - min)) + a;

    return (
      <div
        ref={c => this.setState({ parentNode: c })}
      >
        {(this.state.parentNode) ?
          <D3WordCloud
            data={phrases}
            fontSizeMapper={fontSizeMapper}
            width={this.state.width}
            height={150}
            font="Roboto Condensed"
          />
        : null
      }
      </div>
    );
  }
}

WordCloud.propTypes = {
  /**
   * Array of objects of the form { text, size } representing a phrase
   * cloud, where size is the relative importance of the phrase within the set
   */
  phrases: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    size: PropTypes.number,
  })).isRequired,
};

export default WordCloud;

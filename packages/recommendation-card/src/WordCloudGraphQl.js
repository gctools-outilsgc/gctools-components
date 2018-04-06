
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import WordCloud from './WordCloud';

class PhraseCloudGraphQL extends Component {
  constructor() {
    super();
    this.state = {
      fetched: false,
    };
  }
  componentWillReceiveProps(next) {
    if (
      (this.phrases !== null) &&
      (next.phrases === null) &&
      this.state.fetched) {
      next.startPolling(1000);
      this.setState({ fetched: false });
    } else if (next.phrases !== null) {
      this.setState({ fetched: true });
      next.stopPolling();
    }
  }
  shouldComponentUpdate(next) {
    if (next.loading !== this.props.loading) return true;
    if ((next.phrases === null) && (this.props.phrases !== null)) return true;
    if ((next.phrases !== null) && (this.props.phrases === null)) return true;
    if ((next.phrases !== null) && (this.props.phrases !== null)) {
      if (next.phrases.length !== this.props.phrases.length) return true;
    }
    if (this.props.token !== next.token) return true;
    return false;
  }
  render() {
    if (this.props.loading || (this.props.phrases === null)) {
      return this.props.loadingComponent;
    }
    return <WordCloud phrases={this.props.phrases} />;
  }
}

PhraseCloudGraphQL.defaultProps = {
  loadingComponent: <span>Loading</span>,
  phrases: null,
  loading: false,
};

PhraseCloudGraphQL.propTypes = {
  /**
   * True if data is being loaded from the server, false otherwise.
   */
  loading: PropTypes.bool,
  /**
   * Component to show when data is being loaded
   */
  loadingComponent: PropTypes.node,
  /**
   * Array of objects of the form { text, size } representing a phrase
   * cloud, where size is the relative importance of the phrase within the set
   */
  phrases: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    size: PropTypes.number,
  })),
  /**
   * Authentication token
   */
  token: PropTypes.string.isRequired, // eslint-disable-line
  /**
   * Event triggered when phrases are loaded.
   */
};

const bindWithQuery = (q, pm, s, vf) => graphql(q, {
  skip: s,
  props: props => Object.assign({
    stopPolling: props.data.stopPolling,
    startPolling: props.data.startPolling,
  }, pm(props)),
  options: (props) => {
    const { token } = props;
    return Object.assign({}, {
      pollInterval: 1000,
      context: {
        headers: {
          Authorization: token,
        },
      },
    }, {
      variables: vf(props),
    });
  },
})(PhraseCloudGraphQL);

export default bindWithQuery;

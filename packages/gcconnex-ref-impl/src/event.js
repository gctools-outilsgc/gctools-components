/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2018
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import GcconnexRefImpl from './index';

class EventHandlerRefImpl extends Component {
  componentDidMount() {
    const { context, context_obj1, token } = this.props; // eslint-disable-line
    this.props.enterContext({
      context: {
        headers: {
          Authorization: token,
        },
      },
      variables: {
        context,
        context_obj1,
      },
    });
  }

  componentWillReceiveProps(next) {
    if (!next.loading && next.recommendations !== null) {
      next.stopPolling();
    }
  }

  render() {
    return <GcconnexRefImpl {...this.props} />;
  }
}

EventHandlerRefImpl.propTypes = {
  /** Mutation used to trigger context "enter" events. */
  enterContext: PropTypes.func.isRequired,
  /** Stop polling for recommendations */
  stopPolling: PropTypes.func.isRequired,
  context: PropTypes.oneOf(['login', 'article_c5']).isRequired,
  context_obj1: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default EventHandlerRefImpl;

/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */

import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import PropTypes from 'prop-types';

/**
 * Reference Implementation of GCconnex integration
 */
class GcconnexRefImpl extends Component {
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
    // TOOD change to not null
    if (!next.recommendationsC5.loading) {
      const { article_c5 } // eslint-disable-line
        = next.recommendationsC5.me.recommendations.context.GCconnex;
      // eslint-disable-next-line
      if (article_c5 && article_c5.articles.length >= 0) {
        next.recommendationsC5.stopPolling();
      }
    }
  }

  render() {
    const { context, recommendationsC5 } = this.props;
    if (context === 'login') return null;
    const recommendations = [];
    if (!recommendationsC5.loading) {
      const { article_c5 } // eslint-disable-line
        = recommendationsC5.me.recommendations.context.GCconnex;
      if (article_c5 === null) { // eslint-disable-line
        recommendations.push({
          title: 'Recommendations not yet available...',
        });
      } else if (article_c5.articles.length === 0) {
        recommendations.push({
          title: 'No Recommendations for this discussion.',
        });
      } else {
        article_c5.articles.forEach((r) => {
          recommendations.push({ key: r.id, title: r.name.value });
        });
      }
    }
    return (
      <div>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div>
            <h1>GcconnexRefImpl</h1>
            <p>
              Reference Implementation of GCconnex integration
            </p>
            <h3>{this.props.user.gcconnex_username}</h3>
            <ul>
              <li>context: <strong>{this.props.context}</strong></li>
              <li>guid: {this.props.user.gcconnex_guid}</li>
              <li>obj1: {this.props.context_obj1}</li>
              <li>obj2: {this.props.context_obj2}</li>
              <li>obj3: {this.props.context_obj3}</li>
            </ul>
            <h3>Recommendations</h3>
            {(recommendationsC5.loading) ? <p>Loading</p> : null}
            <ul>
              {recommendations.map(r => <li key={r.title}>{r.title}</li>)}
            </ul>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}


GcconnexRefImpl.defaultProps = {
  context_obj1: '',
  context_obj2: '',
  context_obj3: '',
  recommendationsC5: { loading: true },
  enterContext: () => null,
};

GcconnexRefImpl.propTypes = {
  /** The currently logged in user */
  user: PropTypes.shape({
    gcconnex_guid: PropTypes.number.isRequired,
    gcconnex_username: PropTypes.string.isRequired,
    email: PropTypes.string,
  }).isRequired,
  /** Current recommendation context */
  context: PropTypes.oneOf(['login', 'article_c5', 'article_c6']).isRequired,
  /** Optional additional contextual data */
  context_obj1: PropTypes.string,
  /** Optional additional contextual data */
  context_obj2: PropTypes.string,
  /** Optional additional contextual data */
  context_obj3: PropTypes.string,
  /** Available recommendations */
  recommendationsC5: PropTypes.shape({}),
  /** Mutation used to trigger context "enter" events. */
  enterContext: PropTypes.func,
};


export default GcconnexRefImpl;


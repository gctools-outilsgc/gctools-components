/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2018
 */

import React from 'react';
import PropTypes from 'prop-types';

import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

const enterContextMutation = gql`
mutation enterContextMutation($context: Context!, $context_obj1: String) {
  enterContext(context: $context, context_obj1: $context_obj1)
}`;

// TODO change how contexts work - pass as variable
const recommendationQueryC5 = gql`
query queryMyRecommendationsC5($context_obj1: String!) {
  me {
    recommendations {
      context {
        GCconnex {
          article_c5(article: $context_obj1) {
            articles {
              id
              rank
              name {
                value
              }
              phraseCloud {
                rank
                text {
                  value
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

const dataProvider = (props) => {
  const { children } = props;
  const childrenWithProps = React.Children.map(children, child =>
    React.cloneElement(child, props));
  return <div>{childrenWithProps}</div>;
};

dataProvider.propTypes = {
  children: PropTypes.node,
};

dataProvider.defaultProps = {
  children: [],
};

const ConnectedRefImpl = compose(
  graphql(enterContextMutation, { name: 'enterContext' }),
  graphql(recommendationQueryC5, {
    name: 'recommendationsC5',
    props: ({
      ownProps: { context },
      recommendationsC5: { loading, me, stopPolling },
    }) => ({
      loading,
      context,
      stopPolling,
      recommendations: (
        loading
        || me.recommendations.context.GCconnex.article_c5 === null)
        ? null :
        me.recommendations.context.GCconnex.article_c5.articles.map(a => ({
          id: a.id,
          title: a.name.value,
          rank: a.rank,
          phraseCloud: a.phraseCloud.map(pc => ({
            phrase: pc.text.value,
            rank: parseFloat(pc.rank),
          })),
        })),
    }),
    skip: ownProps => ownProps.context_obj1 === '',
    options: ownProps => ({
      pollInterval: 1000,
      context: {
        headers: {
          Authorization: ownProps.token,
        },
      },
    }),
  }),
)(dataProvider);

export default ConnectedRefImpl;

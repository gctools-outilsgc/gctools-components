/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/multi-comp */
import React from 'react';
import PropTypes from 'prop-types';

import AutoComplete from 'material-ui/AutoComplete';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { Step, Stepper, StepButton } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import ErrorIcon from 'material-ui/svg-icons/alert/error';

import RecommendationCard, { CardContainer, WordCloud }
  from '@gctools-components/recommendation-card';

import { ApolloProvider, graphql, compose } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import createTokenForUser from '../../../_utils/fake_token';

const apollo = new ApolloClient({
  // link: new HttpLink({ uri: 'http://localhost:3001/graphql' }),
  link: new HttpLink({ uri: 'http://gcrec.lpss.me/graphql' }),
  cache: new InMemoryCache(),
});

const CLOUD_SIZE = {
  article: 10,
  top: 100,
  match: 100,
};

const peopleFinderQuery = gql`
query TypeAndFindQuery($nameContains: String!) {
  people(nameContains: $nameContains, limit: 50) {
    id
    name {
      value
    }
  }
}`;
const enterContextMutation = gql`
mutation loginPerson($context: Context!) {
  enterContext(context: $context)
}`;
class PeopleFinder extends React.Component {
  constructor() {
    super();
    this._noFilter = () => true;
    this.selectUser = this.selectUser.bind(this);
  }
  selectUser(selection) {
    const { mutate, context } = this.props;
    const options = {
      context: {
        headers: {
          Authorization: createTokenForUser({
            gcconnex_guid: `${selection.value}`,
            email: '',
            gcconnex_username: '',
          }),
        },
      },
    };
    mutate(Object.assign(options, {
      variables: { context: 'login' },
    }));
    const useContext = `article_${context.toLowerCase()}`;
    mutate(Object.assign(options, {
      variables: {
        context: useContext,
      },
    }));
    this.props.onSelectUser(selection);
  }
  render() {
    const { people } = this.props;
    return (
      <AutoComplete
        hintText={__('Type part of a name')}
        searchText={this.props.searchText}
        dataSource={people}
        onUpdateInput={this.props.onUpdateInput}
        onNewRequest={this.selectUser}
        filter={this._noFilter}
        openOnFocus
      />
    );
  }
}
PeopleFinder.defaultProps = {
  people: [],
  context: '',
};
PeopleFinder.propTypes = {
  searchText: PropTypes.string.isRequired,
  onUpdateInput: PropTypes.func.isRequired,
  onSelectUser: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  context: PropTypes.string,
  people: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
};

const PeopleFinderWithData = graphql(peopleFinderQuery, {
  skip: props => props.searchText.length < 3,
  props: ({ ownProps, data: { people } }) => ({
    ...ownProps,
    people: (people)
      ? people.map(p => ({ text: p.name.value, value: p.id })) : [],
  }),
  options: ({ searchText }) => ({
    variables: {
      nameContains: searchText,
    },
    context: {
      headers: {
        Authorization: createTokenForUser({
          gcconnex_guid: '-1',
          email: '',
          gcconnex_username: '',
        }),
      },
    },
  }),
})(graphql(enterContextMutation)(PeopleFinder));

const articleFinderQuery = gql`
query TypeAndFindQuery($nameContains: String!) {
  people(nameContains: $nameContains, limit: 50) {
    id
    name {
      value
    }
  }
}`;
class ArticleFinder extends React.Component {
  constructor() {
    super();
    this._noFilter = () => true;
    this.selectUser = this.selectUser.bind(this);
  }
  selectUser(selection) {
    const { mutate, context } = this.props;
    const options = {
      context: {
        headers: {
          Authorization: createTokenForUser({
            gcconnex_guid: `${selection.value}`,
            email: '',
            gcconnex_username: '',
          }),
        },
      },
    };
    mutate(Object.assign(options, {
      variables: {
        context: 'login',
      },
    }));
    const useContext = `article_${context.toLowerCase()}`;
    mutate(Object.assign(options, {
      variables: {
        context: useContext,
      },
    }));
    this.props.onSelectUser(selection);
  }
  render() {
    const { people } = this.props;
    return (
      <AutoComplete
        hintText={__('Type part of a name')}
        searchText={this.props.searchText}
        dataSource={people}
        onUpdateInput={this.props.onUpdateInput}
        onNewRequest={this.selectUser}
        filter={this._noFilter}
        openOnFocus
      />
    );
  }
}
ArticleFinder.defaultProps = {
  people: [],
  context: '',
};
ArticleFinder.propTypes = {
  searchText: PropTypes.string.isRequired,
  onUpdateInput: PropTypes.func.isRequired,
  onSelectUser: PropTypes.func.isRequired,
  mutate: PropTypes.func.isRequired,
  context: PropTypes.string,
  people: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),
};

const ArticleFinderWithData = graphql(articleFinderQuery, {
  skip: props => props.searchText.length < 3,
  props: ({ ownProps, data: { people } }) => ({
    ...ownProps,
    people: (people)
      ? people.map(p => ({ text: p.name.value, value: p.id })) : [],
  }),
  options: ({ searchText }) => ({
    variables: {
      nameContains: searchText,
    },
    context: {
      headers: {
        Authorization: createTokenForUser({
          gcconnex_guid: '-1',
          email: '',
          gcconnex_username: '',
        }),
      },
    },
  }),
})(graphql(enterContextMutation)(ArticleFinder));

const personDataQuery = gql`
query PersonDataQuery($hasId: ID!) {
  people(hasId: $hasId) {
    phraseCloud {
      text {
        value
        source {
          name
        }
      }
      rank
    }
  }
}`;
const ProfilePhrases = (props) => {
  const { phraseCloud, loading } = props;
  if (loading === true) {
    return (
      <RefreshIndicator
        size={25}
        left={0}
        top={8}
        status="loading"
        style={{
          marginLeft: 25,
          display: 'inline-block',
          position: 'relative',
          boxShadow: 'none',
        }}
      />);
  }
  if (phraseCloud.length === 0) return null;
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <h2 style={props.headingStyle}>{__('Top profile phrases')}</h2>
      <div>
        <WordCloud
          phrases={phraseCloud}
        />
      </div>
    </div>
  );
};

ProfilePhrases.defaultProps = {
  headingStyle: {},
  phraseCloud: [],
  loading: false,
};

ProfilePhrases.propTypes = {
  headingStyle: PropTypes.objectOf(PropTypes.any),
  phraseCloud: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
  })),
  loading: PropTypes.bool,
};

const ProfilePhrasesWithData = graphql(personDataQuery, {
  skip: props => !props.selectedUser.guid,
  props: ({ ownProps, data: { people, loading } }) => ({
    ...ownProps,
    loading,
    phraseCloud: (people && people[0].phraseCloud)
      ? people[0].phraseCloud.slice(0, CLOUD_SIZE.top).map(p => (
        { text: p.text.value, size: p.rank }
      )) : [],
  }),
  pollInterval: 1000,
  options: ({ selectedUser: { guid } }) => ({
    variables: {
      hasId: guid,
    },
    context: {
      headers: {
        Authorization: createTokenForUser({
          gcconnex_guid: '-1',
          email: '',
          gcconnex_username: '',
        }),
      },
    },
  }),
})(ProfilePhrases);

ProfilePhrasesWithData.defaultProps = {
  selectedUser: {},
};

ProfilePhrasesWithData.propTypes = {
  selectedUser: PropTypes.shape({
    guid: PropTypes.string,
  }).isRequired,
};

const baseRecommendationQuery = `
query RecommendationQuery($hasId: ID!) {
  people(hasId: $hasId) {
    recommendations {
      context {
        [root] {
          [context] {
            articles {
              name {
                value
              },
              id
            }
          }
        }
      }
    }
  }
}
`;

const buildContextQuery = (root, context) =>
  gql(baseRecommendationQuery
    .replace('[context]', context).replace('[root]', root));

const recommendationQueryC1 = buildContextQuery('GCpedia', 'article_c1');
const recommendationQueryC2 = buildContextQuery('GCpedia', 'article_c2');
const recommendationQueryC3 = buildContextQuery('GCpedia', 'article_c3');
const recommendationQueryC4 = buildContextQuery('GCpedia', 'article_c4');
const recommendationQueryC5 = buildContextQuery('GCconnex', 'article_c5');
const recommendationQueryC6 = buildContextQuery('GCconnex', 'article_c6');

const Recommendations = (props) => {
  const {
    showRecommendations,
    loading,
    recommendations,
    context,
    mutate,
  } = props;
  if (!showRecommendations) return null;
  if (loading) {
    if (['c2', 'c4', 'c6'].indexOf(context) >= 0) {
      const useContext = `article_${context.toLowerCase()}`;
      mutate({
        variables: {
          context: useContext,
        },
        context: {
          headers: {
            Authorization: createTokenForUser({
              gcconnex_guid: '-1',
              email: '',
              gcconnex_username: '',
            }),
          },
        },
      });
    }

    return (
      <RefreshIndicator
        size={45}
        left={0}
        top={8}
        status="loading"
        style={{
          marginLeft: 25,
          display: 'inline-block',
          position: 'relative',
          boxShadow: 'none',
        }}
      />);
  }
  return (
    <CardContainer
      loaded={!loading}
      cards={
        (recommendations.length > 0) ?
          recommendations.map(rec =>
            (<RecommendationCard
              className="grid-item"
              key={`article_${rec.articleId}`}
              rank={rec.rank}
              title={rec.title}
              phrases={rec.phrases}
              type={rec.type}
            />)) :
          <div className="grid-item">
            <h3>Recommendations not yet available...</h3>
          </div>
      }
    />
  );
};

Recommendations.defaultProps = {
  loading: false,
  recommendations: [],
  showRecommendations: false,
  context: '',
};

Recommendations.propTypes = {
  loading: PropTypes.bool,
  showRecommendations: PropTypes.bool,
  mutate: PropTypes.func.isRequired,
  context: PropTypes.string,
  recommendations: PropTypes.arrayOf(PropTypes.shape({
    articleId: PropTypes.string.isRequired,
    rank: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    phrases: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
    })),
  })),
};

const getOptions = (root, context) => {
  const defaultOpt = {
    skip: props =>
      !props.selectedUser.guid || context.indexOf(props.context) < 0,
    props: ({ ownProps, data: { loading, people } }) => ({
      ...ownProps,
      loading,
      recommendations: (people
        && people[0].recommendations
        && people[0].recommendations.context[root]
        && people[0].recommendations.context[root][context]
        && !loading) ?
        people[0].recommendations.context[root][context].articles.map(a => ({
          articleId: a.id,
          title: a.name.value,
          phrases: [],
          rank: 1,
        })) : [],
    }),
    options: ({ selectedUser: { guid } }) => ({
      variables: {
        hasId: guid,
      },
      pollInterval: 1000,
      context: {
        headers: {
          Authorization: createTokenForUser({
            gcconnex_guid: `${guid}`,
            email: '',
            gcconnex_username: '',
          }),
        },
      },
    }),
  };
  return defaultOpt;
};

const RecommendationsWithData = compose(
  graphql(recommendationQueryC1, getOptions('GCpedia', 'article_c1')),
  graphql(recommendationQueryC2, getOptions('GCpedia', 'article_c2')),
  graphql(recommendationQueryC3, getOptions('GCpedia', 'article_c3')),
  graphql(recommendationQueryC4, getOptions('GCpedia', 'article_c4')),
  graphql(recommendationQueryC5, getOptions('GCconnex', 'article_c5')),
  graphql(recommendationQueryC6, getOptions('GCconnex', 'article_c6')),
  graphql(enterContextMutation),
)(Recommendations);


const initialState = {

  userSearchText: '',
  selectedUser: {},
  showRecommendations: false,
  articleSearchText: '',
  selectedArticle: {},

  recommendations: [],
  recommendation_error: false,
  no_recommendations: false,
  recommendation_settings: [],
  loaded: true,

  matchedPhraseCloud: null,

  articleSearchResults: [],

  discussion_loaded: true,
  discussion_loaded_error: false,
  discussionSearchText: '',
  discussionSearchResults: [],
  selectedDiscussion: null,

  context: null,
  stepIndex: 0,
};

class ArticleRecommendations extends React.Component {
  constructor() {
    super();
    this.state = initialState;

    this.searchTimer = {};
    this.handleContextChange = this.handleContextChange.bind(this);
    this._needArticle = this._needArticle.bind(this);
    this._needGroupDiscussion = this._needGroupDiscussion.bind(this);
    this._needUser = this._needUser.bind(this);
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
    this._reset = this._reset.bind(this);
    this._recommend = this._recommend.bind(this);

    this._selectUser = this._selectUser.bind(this);
    this._updateUserSearch = this._updateUserSearch.bind(this);

    this._noFilter = () => true;
  }

  _updateUserSearch(txt) {
    this.setState({ userSearchText: txt });
  }

  _selectUser(selected) {
    const guid = selected.value;
    this.setState({ selectedUser: { guid, name: selected.text } });
  }

  handleContextChange(e, context) {
    this.setState({
      context,
      showRecommendations: false,
      matchedPhraseCloud: null,
      loaded: true,
    });
    this._next(e, context);
  }

  _reset() {
    this.setState(initialState);
  }

  _prev(e, context) {
    const tests = [
      this._needUser(context),
      this._needArticle(context),
      this._needGroupDiscussion(context),
    ];
    let stepIndex = 0;
    for (let x = this.state.stepIndex - 2; x >= 0; x -= 1) {
      if (tests[x]) {
        stepIndex = x + 1;
        break;
      }
    }
    this.setState({ stepIndex });
  }

  _next(e, context) {
    const tests = [
      this._needUser(context),
      this._needArticle(context),
      this._needGroupDiscussion(context),
    ];
    let stepIndex = 4;
    for (let x = this.state.stepIndex; x < tests.length; x += 1) {
      if (tests[x]) {
        stepIndex = x + 1;
        break;
      }
    }
    this.setState({ stepIndex });
  }

  _needUser(context) {
    return ['C1', 'C3', 'C5'].indexOf(context || this.state.context) >= 0;
  }

  _needArticle(context) {
    return ['C3', 'C4'].indexOf(context || this.state.context) >= 0;
  }

  _needGroupDiscussion(context) {
    return ['C5', 'C6'].indexOf(context || this.state.context) >= 0;
  }

  _recommend() {
    const { guid } = this.state.selectedUser;
    const obj = { showRecommendations: true };
    if (!guid) {
      obj.selectedUser = { guid: -1 };
    }
    this.setState(obj);
  }

  render() {
    const contexts = {
      C1: __('User logged in, GCpedia landing page'),
      C2: __('Unknown user, GCpedia landing page'),
      C3: __('User logged in, reading an article'),
      C4: __('Unknown user, reading an article'),
      C5: __('User logged in, reading group discussion'),
      C6: __('Unknown user, reading group discussion'),
    };
    const heading = {
      fontFamily: 'Roboto Condensed, arial, sans-serif',
      borderBottom: '1px solid',
      paddingRight: '25px',
      display: 'inline-block',
    };
    const padLeft = {
      paddingLeft: '15px',
    };
    return (
      <ApolloProvider client={apollo}>
        <div>
          <Stepper activeStep={this.state.stepIndex} orientation="horizontal">
            <Step>
              <StepButton onClick={() => this.setState({ stepIndex: 0 })}>
                Context
              </StepButton>
            </Step>
            <Step disabled={!this._needUser()}>
              <StepButton onClick={() => this.setState({ stepIndex: 1 })}>
                User
              </StepButton>
            </Step>
            <Step disabled={!this._needArticle()}>
              <StepButton onClick={() => this.setState({ stepIndex: 2 })}>
                Article
              </StepButton>
            </Step>
            <Step disabled={!this._needGroupDiscussion()}>
              <StepButton onClick={() => this.setState({ stepIndex: 3 })}>
                Group discussion
              </StepButton>
            </Step>
            <Step>
              <StepButton onClick={() => this.setState({ stepIndex: 4 })}>
                Recommendations
              </StepButton>
            </Step>
          </Stepper>
          <div style={{
              display: (this.state.stepIndex === 0) ? 'block' : 'none',
            }}
          >
            <p>
              Contexts bring situational awareness to the recommendations.
              Choose a context to see how the recommendations will behave when
              embedded within GCTools.
            </p>
            <RadioButtonGroup
              name="context"
              onChange={this.handleContextChange}
              valueSelected={this.state.context}
            >
              {Object.keys(contexts).map(c =>
                (<RadioButton
                  key={`context_${c}`}
                  value={c}
                  label={contexts[c]}
                />))}
            </RadioButtonGroup>
            <div style={{ marginTop: 12 }}>
              <RaisedButton
                label={__('Next')}
                disabled={!this.state.context}
                onClick={this._next}
              />
            </div>
          </div>
          <div style={{
              display: (this.state.stepIndex === 1) ? 'block' : 'none',
            }}
          >
            <p>
              Preview the recommendations as if you were logged into any
              GCconnex account.  Type the name of the user you would like to
              simulate below.
            </p>
            <PeopleFinderWithData
              searchText={this.state.userSearchText}
              onUpdateInput={this._updateUserSearch}
              onSelectUser={this._selectUser}
              context={this.state.context}
            />
            <div style={{ marginTop: 12 }}>
              <FlatButton
                label={__('Back')}
                onClick={this._prev}
                style={{ marginRight: 12 }}
              />
              <RaisedButton
                label={__('Next')}
                onClick={this._next}
                disabled={!this.state.selectedUser.guid}
              />
            </div>
          </div>
          <div style={{
              display: (this.state.stepIndex === 2) ? 'block' : 'none',
            }}
          >
            <h3>Choose an article</h3>
            <p>
              Simulate reading a particular article by choosing one from the
              search provided below.
            </p>
            <ArticleFinderWithData
              searchText={this.state.articleSearchText}
              onUpdateInput={this._updateArticleSearch}
              onSelectUser={this._selectArticle}
              context={this.state.context}
            />
            <div style={{ marginTop: 12 }}>
              <FlatButton
                label={__('Back')}
                onClick={this._prev}
                style={{ marginRight: 12 }}
              />
              <RaisedButton
                label={__('Next')}
                onClick={this._next}
                disabled={!this.state.selectedArticle.guid}
              />
            </div>
          </div>
          <div style={{
              display: (this.state.stepIndex === 3) ? 'block' : 'none',
            }}
          >
            <h3>Choose a group discussion</h3>
            <p>
              Simulate reading a particular discussion thread by choosing one
              from the search provided below.
            </p>
            {/* <AutoComplete
              hintText={__('Type part of all of a title')}
              searchText={this.state.discussionSearchText}
              dataSource={this.state.discussionSearchResults}
              onUpdateInput={this._updateDiscussionList}
              onNewRequest={this._getDiscussionPC}
              filter={this._noFilter}
              openOnFocus
              fullWidth
            /> */}
            <div style={{ marginTop: 12 }}>
              <FlatButton
                label={__('Back')}
                onClick={this._prev}
                style={{ marginRight: 12 }}
                disabled={!this.state.discussion_loaded}
              />
              <RaisedButton
                label={__('Next')}
                onClick={this._next}
                disabled={
                  !this.state.selectedDiscussion ||
                  !this.state.discussion_loaded
                }
              />
              {(!this.state.discussion_loaded) ?
                <RefreshIndicator
                  size={25}
                  left={0}
                  top={8}
                  status="loading"
                  style={{
                  marginLeft: 25,
                  display: 'inline-block',
                  position: 'relative',
                  boxShadow: 'none',
                }}
                />
              : null }
              {(this.state.discussion_loaded_error) ?
                <div
                  style={{
                    display: 'inline-block',
                    position: 'relative',
                    boxShadow: 'none',
                    color: 'red',
                    verticalAlign: 'middle',
                  }}
                >
                  <ErrorIcon color="red" />
                  <span style={{ verticalAlign: 'super', marginLeft: 10 }}>
                    An error has occured
                  </span>
                </div>
              : null }
            </div>
          </div>
          <div style={{
              display: (this.state.stepIndex === 4) ? 'block' : 'none',
            }}
          >
            <p>
              Everything is ready to simulate a call to the article
              recommendation service, press the button below to see the result.
            </p>
            <FlatButton
              label={__('Back')}
              onClick={this._prev}
              style={{ marginRight: 12 }}
              disabled={!this.state.loaded}
            />
            <RaisedButton
              label={__('Recommend')}
              primary
              onClick={this._recommend}
              disabled={!this.state.loaded}
            />
            <FlatButton
              label={__('Reset')}
              primary
              onClick={this._reset}
              style={{ marginLeft: 22 }}
              disabled={!this.state.loaded}
            />
            {(!this.state.loaded) ?
              <RefreshIndicator
                size={25}
                left={0}
                top={8}
                status="loading"
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  boxShadow: 'none',
                }}
              />
            : null }
            {(this.state.recommendation_error) ?
              <div
                style={{
                  display: 'inline-block',
                  position: 'relative',
                  boxShadow: 'none',
                  color: 'red',
                  verticalAlign: 'middle',
                }}
              >
                <ErrorIcon color="red" />
                <span className="error-text">
                  An error has occured
                </span>
              </div>
            : null }
          </div>
          {this.state.stepIndex > 0
            ? <hr style={{ border: 0, height: '1px', background: '#ddd' }} />
            : false
          }
          <div style={{ marginTop: 20, padding: 10, marginBottom: 20 }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
              }}
            >
              {(this.state.context) ?
                <div>
                  <h2 style={heading}>{__('Context')}</h2>
                  <div style={padLeft}>{contexts[this.state.context]}</div>
                </div>
              :
                null
              }
              {(this._needUser() && this.state.selectedUser) ?
                <div style={{ marginRight: '25px', order: -1 }}>
                  <h2 style={heading}>{__('GCProfile user')}</h2>
                  <div style={padLeft}>{this.state.selectedUser.name}</div>
                </div>
              : null}
              {(this._needArticle() && this.state.selectedArticle) ?
                <div style={{ marginRight: '25px', order: -1 }}>
                  <h2 style={heading}>{__('GCpedia article')}</h2>
                  <div style={padLeft}>{this.state.selectedArticle.name}</div>
                </div>
              : null}
              {(this._needGroupDiscussion() && this.state.selectedDiscussion) ?
                <div style={{ marginRight: '25px', order: -1 }}>
                  <h2 style={heading}>{__('GCconnex discussion')}</h2>
                  <div style={padLeft}>
                    {this.state.selectedDiscussion.name}
                  </div>
                </div>
              : null}
            </div>
            <div>
              <div style={{ flexGrow: 1 }}>
                { (this._needUser()) ?
                  <ProfilePhrasesWithData
                    headingStyle={heading}
                    selectedUser={this.state.selectedUser}
                  />
                : null
                }
              </div>
              <div style={{ flexGrow: 1 }}>
                {(
                  this._needArticle()
                  && this.state.selectedArticle
                  && this.state.selectedArticle.phrase_cloud
                ) ?
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <h2 style={heading}>Top article phrases</h2>
                    <div>
                      <WordCloud
                        phrases={this.state.selectedArticle.phrase_cloud}
                      />
                    </div>
                  </div>
                : false}
              </div>
              <div style={{ flexGrow: 1 }}>
                {(
                  this._needGroupDiscussion()
                  && this.state.selectedDiscussion
                  && this.state.selectedDiscussion.phrase_cloud
                ) ?
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <h2 style={heading}>Top discussion phrases</h2>
                    <div>
                      <WordCloud
                        phrases={this.state.selectedDiscussion.phrase_cloud}
                      />
                    </div>
                  </div>
                : false}
              </div>
              <div style={{ flexGrow: 1 }}>
                {(this.state.selectedUser && this.state.matchedPhraseCloud) ?
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <h2 style={heading}>Phrase Matches</h2>
                    <div>
                      <WordCloud phrases={this.state.matchedPhraseCloud} />
                    </div>
                  </div>
                : false}
              </div>
            </div>
          </div>
          <RecommendationsWithData
            selectedUser={this.state.selectedUser}
            selectedArticle={this.state.selectedArticle}
            selectedDiscussion={this.state.selectedDiscussion}
            context={(this.state.context)
              ? this.state.context.toLowerCase() : null
            }
            showRecommendations={this.state.showRecommendations}
          />
        </div>
      </ApolloProvider>
    );
  }
}

export default ArticleRecommendations;

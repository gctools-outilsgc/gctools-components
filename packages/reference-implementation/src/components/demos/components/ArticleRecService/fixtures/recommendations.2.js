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

import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { Step, Stepper, StepButton } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import ErrorIcon from 'material-ui/svg-icons/alert/error';

import Login from '@gctools-components/gc-login';
import { WordCloud, WordCloudGraphQl }
  from '@gctools-components/recommendation-card';
import AutoCompleteGraphQL from '@gctools-components/autocomplete-graphql';
import Recommendations, { DataProvider, EventHandler }
  from '@gctools-components/gcconnex-ref-impl';

import { ApolloProvider, graphql } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import createTokenForUser from '../../../_utils/fake_token';

const apollo = new ApolloClient({
  link: new HttpLink({ uri: 'http://gcrec.lpss.me/graphql' }),
  cache: new InMemoryCache(),
});

const AutoCompletePerson = AutoCompleteGraphQL(gql`
  query TypeAndFindQuery($nameContains: String!) {
    people(nameContains: $nameContains, limit: 50) {
      id
      name {
        value
      }
    }
  }`, ({ ownProps, data: { people } }) => ({
    ...ownProps,
    items: (people)
      ? people.map(p => ({ text: p.name.value, value: p.id })) : [],
  }));

const AutoCompleteArticle = AutoCompleteGraphQL(gql`
  query TypeAndFindQuery($nameContains: String!) {
    articles (nameContains: $nameContains, limit: 50) {
      id
      name {
        value
      }
    }
  }
`, ({ ownProps, data: { articles } }) => ({
    ...ownProps,
    items: (articles)
      ? articles.map(p => ({ text: p.name.value, value: p.id })) : [],
  }));

const AutoCompleteDiscussion = AutoCompleteGraphQL(gql`
  query TypeAndFindQuery($nameContains: String!) {
    articles (nameContains: $nameContains, limit: 50) {
      id
      name {
        value
      }
    }
  }
`, ({ ownProps, data: { articles } }) => ({
    ...ownProps,
    items: (articles)
      ? articles.map(p => ({ text: p.name.value, value: p.id })) : [],
  }));

const CLOUD_SIZE = {
  article: 10,
  top: 100,
  match: 100,
};

const enterContextMutation = gql`
mutation loginPerson($context: Context!, $context_obj1: String) {
  enterContext(context: $context, context_obj1: $context_obj1)
}`;

const ProfilePhrases = WordCloudGraphQl(
  gql`
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
    }`,
  ({ ownProps, data: { people, loading } }) => ({
    ...ownProps,
    loading,
    phrases: (people && people[0].phraseCloud)
      ? people[0].phraseCloud.slice(0, CLOUD_SIZE.top).map(p => (
        { text: p.text.value, size: p.rank }
      )) : null,
  }),
  props => props.guid === '',
  props => ({ hasId: props.guid }),
);

const ProfilePhrasesWithHeader = (props) => {
  const display = (props.guid) ? 'block' : 'none';
  return (
    <div style={{ position: 'relative', overflow: 'hidden', display }}>
      <h2 style={props.headingStyle}>{__('Top profile phrases')}</h2>
      <div>
        <ProfilePhrases
          {...props}
        />
      </div>
    </div>
  );
};

ProfilePhrasesWithHeader.propTypes = {
  guid: PropTypes.string.isRequired,
  headingStyle: PropTypes.shape({}).isRequired,
};

const initialState = {

  userSearchText: '',
  selectedUser: {},

  articleSearchText: '',
  selectedArticle: {},

  discussionSearchText: '',
  selectedDiscussion: {},

  showRecommendations: false,

  recommendations: [],
  recommendation_error: false,
  no_recommendations: false,
  recommendation_settings: [],
  loaded: true,

  matchedPhraseCloud: null,

  context: null,
  stepIndex: 0,

  userPending: false,
};

class ArticleRecommendations extends React.Component {
  constructor() {
    super();
    this.state = Object.assign({}, initialState);
    this.state.token = 'invalid';
    this.state.profile = null;

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

    this._selectArticle = this._selectArticle.bind(this);
    this._updateArticleSearch = this._updateArticleSearch.bind(this);

    this._selectDiscussion = this._selectDiscussion.bind(this);
    this._updateDiscussionSearch = this._updateDiscussionSearch.bind(this);

    this._userLoaded = this._userLoaded.bind(this);
    this._userUnloaded = this._userUnloaded.bind(this);
    this._userLoginClick = this._userLoginClick.bind(this);
    this._userLogoutClick = (e, obj) => obj.localLogout();

    this._noFilter = () => true;
  }

  _userLoginClick(e, obj) {
    this.setState({ userPending: true });
    obj.login();
  }

  _userLoaded(data) {
    const { profile } = data;
    const token = createTokenForUser({
      gcconnex_guid: profile.gcconnex_guid,
      email: profile.email,
      gcconnex_username: profile.gcconnex_username,
    });
    this.setState({ profile, token, userPending: false });
  }

  _userUnloaded() {
    this.setState({ profile: null, token: null });
  }

  _updateUserSearch(txt) {
    this.setState({ userSearchText: txt });
  }

  _selectUser(selected) {
    const guid = selected.value;
    this.props.mutate({
      variables: { context: 'login' },
      context: {
        headers: {
          Authorization: this.state.token,
        },
      },
    });
    const token = createTokenForUser({
      gcconnex_guid: guid,
      email: '',
      gcconnex_username: selected.text,
    });
    this.setState({ token, selectedUser: { guid, name: selected.text } });
    this._next();
  }

  _updateArticleSearch(txt) {
    this.setState({ articleSearchText: txt });
  }

  _selectArticle(selected) {
    const guid = selected.value;
    this.props.mutate({
      variables: {
        context: `article_${this.state.context.toLowerCase()}`,
        context_obj1: guid,
      },
      context: {
        headers: {
          Authorization: this.state.token,
        },
      },
    });
    this.setState({ selectedArticle: { guid, name: selected.text } });
    this._next();
  }

  _updateDiscussionSearch(txt) {
    this.setState({ discussionSearchText: txt });
  }

  _selectDiscussion(selected) {
    const guid = selected.value;
    this.props.mutate({
      variables: {
        context: `article_${this.state.context.toLowerCase()}`,
        context_obj1: guid,
      },
      context: {
        headers: {
          Authorization: this.state.token,
        },
      },
    });
    this.setState({ selectedDiscussion: { guid, name: selected.text } });
    this._next();
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
    this.setState({ stepIndex, showRecommendations: false });
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
    this.setState({ showRecommendations: true });
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
    const url = window.location.href;
    const currentContext = (this.state.context)
      ? `article_${this.state.context.toLowerCase()}` : '';

    const LoginComponent = (<Login
      oidcConfig={{
        authority: 'https://gcidentity.lpss.me/openid',
        client_id: '369399',
        scope: 'openid profile email gcconnex',
        post_logout_redirect_uri: `${url}/#!logout`,
        redirect_uri: `${url}/#!callback`,
        silent_redirect_uri: `${url}/#!silent`,
      }}
      onUserLoaded={this._userLoaded}
      onUserFetched={this._userLoaded}
      onUserUnloaded={this._userUnloaded}
      onLoginClick={this._userLoginClick}
      onLogoutClick={this._userLogoutClick}
    />);

    const NotLoggedIn = [
      <h4 key="must-log-in">You must login to use this demo.</h4>,
    ];

    if (this.state.userPending) {
      NotLoggedIn.push((
        <small key="must-log-in-delay">
          (Due to the temporary link with GCconnex, there may be a delay
          after authorizing.)
        </small>
      ));
    }

    const Demo = (
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
          <AutoCompletePerson
            profile={this.state.profile}
            token={this.state.token}
            searchText={this.state.userSearchText}
            onUpdateInput={this._updateUserSearch}
            onSelectItem={this._selectUser}
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
          <AutoCompleteArticle
            fullWidth
            profile={this.state.profile}
            token={this.state.token}
            searchText={this.state.articleSearchText}
            onUpdateInput={this._updateArticleSearch}
            onSelectItem={this._selectArticle}
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
          <AutoCompleteDiscussion
            fullWidth
            profile={this.state.profile}
            token={this.state.token}
            searchText={this.state.discussionSearchText}
            onUpdateInput={this._updateDiscussionSearch}
            onSelectItem={this._selectDiscussion}
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
              disabled={!this.state.selectedDiscussion.guid}
            />
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
              <span style={{ verticalAlign: 'super', marginLeft: 10 }}>
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
              <ProfilePhrasesWithHeader
                headingStyle={heading}
                token={this.state.token}
                loadingComponent={(
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
                  />)}
                guid={(this.state.selectedUser.guid)
                  ? this.state.selectedUser.guid : ''}
              />
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
        {(this.state.showRecommendations) ?
          <DataProvider
            context={currentContext}
            context_obj1={
              this.state.selectedArticle.guid
              || this.state.selectedDiscussion.guid
              || ''
            }
            token={this.state.token}
          >
            <EventHandler />
            <Recommendations />
          </DataProvider>
        : null}
      </div>
    );

    if (this.state.profile === null) {
      return <div>{LoginComponent}{NotLoggedIn}</div>;
    }
    return <div>{LoginComponent}{Demo}</div>;
  }
}

ArticleRecommendations.propTypes = {
  mutate: PropTypes.func.isRequired,
};

const Demo = graphql(enterContextMutation)(ArticleRecommendations);

export default () => (
  <ApolloProvider client={apollo}>
    <Demo />
  </ApolloProvider>
);

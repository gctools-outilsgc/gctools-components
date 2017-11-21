/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
import React from 'react';

import RecommendationCard, { CardContainer, WordCloud }
  from '@gctools-components/recommendation-card';

import AutoComplete from 'material-ui/AutoComplete';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { Step, Stepper, StepButton } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import ErrorIcon from 'material-ui/svg-icons/alert/error';

const cHost = 'http://167.37.33.21:443/';

const profileSearch
  = `${cHost}/profiles/_design/finder/_view/name?key="[term]"&limit=50`;

const articleSearch
  = `${cHost}/articles/_design/finder/_view/title?key="[term]"&limit=50`;

const discussionSearch
  = `${cHost}/discussions/_design/finder/_list/typeahead/title?startkey=` +
  '"[term]"&endkey="[term]\u9999"&top=20&group_level=1';
const discussionResolver
  = `${cHost}/discussions/_design/finder/_view/resolve?key="[term]"&limit=1`;

const couch = `${cHost}/users`;
const topskilled = '_design/gcrec/_view/users-by-skill-count?descending=true';

const article = 'http://gcrec-db.lpss.me';
// const article = 'http://132.246.129.105:6543';

const reqwest = require('reqwest');

const CLOUD_SIZE = {
  article: 10,
  top: 100,
  match: 100,
};

const initialState = {
  recommendations: [],
  recommendation_error: false,
  no_recommendations: false,
  recommendation_settings: [],
  loaded: true,

  profile_loaded: true,
  profile_loaded_error: false,
  userSearchText: '',
  userSearchResults: [],
  matchedPhraseCloud: null,
  selectedUser: null,

  article_loaded: true,
  article_loaded_error: false,
  articleSearchText: '',
  articleSearchResults: [],
  selectedArticle: null,

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
    this._userDataSourceInit = this._userDataSourceInit.bind(this);

    this._updateDataSource = this._updateDataSource.bind(this);
    this._updateUserList =
      this._updateDataSource.bind(
        this, 'userSearchText', 'userSearchResults',
        profileSearch, null,
      );

    this._updateArticleList =
      this._updateDataSource.bind(
        this, 'articleSearchText', 'articleSearchResults',
        articleSearch, null,
      );

    this._updateDiscussionList =
      this._updateDataSource.bind(
        this, 'discussionSearchText', 'discussionSearchResults',
        discussionSearch, null,
      );

    this._updateItemPC = this._updateItemPC.bind(this);
    this._getUserPC = this._updateItemPC.bind(
      this,
      'user',
      'selectedUser',
      'profile_loaded',
    );
    this._getArticlePC = this._updateItemPC.bind(
      this,
      'article',
      'selectedArticle',
      'article_loaded',
    );
    this._getDiscussionPC = this._updateItemPC.bind(
      this,
      'discussion',
      'selectedDiscussion',
      'discussion_loaded',
    );

    this._noFilter = () => true;
  }

  componentWillMount() {
    // this._userDataSourceInit();
  }

  _updateDataSource(
    stateVar, resultStateVar, url,
    emptyCallback, searchString,
  ) {
    const tmpState = {
      recommendations: [],
      matchedPhraseCloud: null,
      loaded: true,
    };
    tmpState[stateVar] = searchString;
    this.setState(tmpState);
    if (this.searchTimer[url]) clearTimeout(this.searchTimer[url]);
    if (searchString.trim() !== '') {
      this.searchTimer[url] = setTimeout(() => {
        this.searchTimer[url] = undefined;
        reqwest({
          url: url.replace(/\[term\]/g, searchString.toLowerCase().trim()),
          type: 'json',
        }, (data) => {
          const newState = {};
          if (!data.rows) {
            const resolved = [];
            let c = data.length;
            const resolve = (term) => {
              reqwest({
                url: discussionResolver
                  .replace(/\[term\]/g, encodeURIComponent(term)),
                type: 'json',
              }, (r) => {
                resolved.push({ text: r.rows[0].key, value: r.rows[0].value });
                c -= 1;
                if (c === 0) {
                  newState[resultStateVar] = resolved;
                  this.setState(newState);
                }
              }, () => { c -= 1; });
            };
            data.forEach(u => setTimeout(() => resolve(u), 0));
          } else {
            newState[resultStateVar] = data.rows.map(u =>
              ({ text: u.value.name || u.value.title, value: u.value.guid }));
            this.setState(newState);
          }
        });
      }, 350);
    } else if (emptyCallback) emptyCallback();
  }

  _updateItemPC(type, stateVar, stateLoaded, item) {
    const newState = {};
    newState[stateLoaded] = false;
    newState[`${stateLoaded}_error`] = false;
    this.setState(newState);
    reqwest({
      url: `${article}/profile/${type}/${item.value}`,
      type: 'json',
      success:
        (ex) => {
          const sorted =
            Object.keys(ex[1].pc).map(p => ({ text: p, size: ex[1].pc[p] }));
          sorted.sort((a, b) => b.size - a.size);
          const phraseCloud
            = sorted.slice(0, Math.min(CLOUD_SIZE.top, sorted.length));

          newState[stateLoaded] = true;
          newState.matched_phraseCloud = null;
          newState[stateVar] = Object.assign({}, {
            guid: item.value,
            name: item.text,
            phraseCloud,
            complete_phrase_cloud: sorted,
          });
          this.setState(newState);
          this._next();
        },
      error: () => {
        newState[`${stateLoaded}_error`] = true;
        newState[stateLoaded] = true;
        newState[stateVar] = [];
        newState.matchedPhraseCloud = null;
      },
    });
  }

  handleContextChange(e, context) {
    this.setState({
      context,
      recommendations: [],
      matchedPhraseCloud: null,
      loaded: true,
    });
    this._next(e, context);
  }

  _userDataSourceInit() {
    reqwest({
      url: `${couch}/${topskilled}&limit=10`,
      type: 'json',
    }, (ids) => {
      let c = 0;
      const users = [];
      const getUsers = () => {
        reqwest({ url: `${couch}/${ids.rows[c].id}`, type: 'json' }, (us) => {
          users.push({ text: us.name, value: ids.rows[c].id });
          c += 1;
          if (c < ids.rows.length) {
            getUsers();
          } else {
            this.setState({
              userSearchResults: users,
            });
          }
        });
      };
      getUsers();
    });
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
    this.setState({
      loaded: false,
      recommendation_error: false,
      no_recommendations: false,
    });
    const context = this.state.context.toLowerCase();
    const { selectedArticle, selectedUser, selectedDiscussion } = this.state;
    let query = '';
    switch (context) {
      case 'c1': {
        query = `${selectedUser.guid}/`;
        break;
      }
      case 'c3': {
        query = `${selectedUser.guid}/${selectedArticle.guid}/`;
        break;
      }
      case 'c4': {
        query = `${selectedArticle.guid}/`;
        break;
      }
      case 'c5': {
        query = `${selectedUser.guid}/${selectedDiscussion.guid}/`;
        break;
      }
      case 'c6': {
        query = `${selectedDiscussion.guid}/`;
        break;
      }
      default: { } // eslint-disable-line no-empty
    }
    reqwest({
      url: `${article}/recommend/${context}/${query}`,
      type: 'json',
      success: (data) => {
        const [status, results] = data;
        if (!status) {
          this.setState({ recommendation_error: true });
          return false;
        }
        if (!results) {
          this.setState({
            no_recommendations: true,
            recommendations: [],
            loaded: true,
            matchedPhraseCloud: null,
          });
          return false;
        }

        const sliced
          = results.slice(0, Math.min(data[1].length, CLOUD_SIZE.article));
        const recommendations = [];
        const matchedPhraseCloud = [];
        const matchedPhraseDupCheck = [];

        const pcUser = (this.state.selectedUser)
          ? this.state.selectedUser.complete_phrase_cloud || [] : [];
        const pcArticle = (this.state.selectedArticle)
          ? this.state.selectedArticle.complete_phrase_cloud || [] : [];
        const pcDiscussion = (this.state.selectedDiscussion)
          ? this.state.selectedDiscussion.complete_phrase_cloud || [] : [];

        // TODO merge scores from profile, article and discussions
        sliced.map((recdata) => {
          const [articleId, rank, clusterId, title, ph] = recdata;
          const phrases = Object.keys(ph).map(p => ({ text: p, size: ph[p] }));
          if (this.state.selectedUser
            || this.state.selectedArticle
            || this.state.selectedDiscussion) {
            phrases.forEach((p) => {
              if (matchedPhraseDupCheck.indexOf(p.text) === -1) {
                matchedPhraseDupCheck.push(p.text);
                matchedPhraseCloud.push({
                  text: p.text,
                  size:
                    []
                      .concat(pcUser, pcArticle, pcDiscussion)
                      .filter(item => item.text === p.text)
                      .reduce((sum, item, idx, arr) => {
                        const newSum = sum + item.size;
                        if (idx === arr.length - 1) {
                          return newSum / arr.length;
                        }
                        return newSum;
                      }, 0),
                });
              }
            });
          }
          recommendations.push({
            rank,
            clusterId,
            title,
            articleId,
            phrases,
            type: 'gcpedia-article',
          });
          return null;
        });
        matchedPhraseCloud.sort((a, b) => b.size - a.size);
        this.setState({
          recommendations,
          matchedPhraseCloud: matchedPhraseCloud.slice(
            0,
            Math.min(matchedPhraseCloud.length, CLOUD_SIZE.match),
          ),
          loaded: true,
        });
        return true;
      },
      error: () => this.setState({
        recommendation_error: true,
        loaded: true,
        recommendations: [],
        matchedPhraseCloud: null,
      }),
    });
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
        <div
          style={{ display: (this.state.stepIndex === 0) ? 'block' : 'none' }}
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
        <div
          style={{ display: (this.state.stepIndex === 1) ? 'block' : 'none' }}
        >
          <p>
            Preview the recommendations as if you were logged into any GCconnex
            account.  Type the name of the user you would like to simulate
            below.
          </p>
          <AutoComplete
            hintText={__('Type part of all of a name')}
            searchText={this.state.userSearchText}
            dataSource={this.state.userSearchResults}
            onUpdateInput={this._updateUserList}
            onNewRequest={this._getUserPC}
            filter={this._noFilter}
            openOnFocus
          />
          <div style={{ marginTop: 12 }}>
            <FlatButton
              label={__('Back')}
              onClick={this._prev}
              style={{ marginRight: 12 }}
              disabled={!this.state.profile_loaded}
            />
            <RaisedButton
              label={__('Next')}
              onClick={this._next}
              disabled={!this.state.selectedUser || !this.state.profile_loaded}
            />
            {(!this.state.profile_loaded) ?
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
            {(this.state.profile_loaded_error) ?
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
        <div
          style={{ display: (this.state.stepIndex === 2) ? 'block' : 'none' }}
        >
          <h3>Choose an article</h3>
          <p>
            Simulate reading a particular article by choosing one from the
            search provided below.
          </p>
          <AutoComplete
            hintText={__('Type part of all of a title')}
            searchText={this.state.articleSearchText}
            dataSource={this.state.articleSearchResults}
            onUpdateInput={this._updateArticleList}
            onNewRequest={this._getArticlePC}
            filter={this._noFilter}
            openOnFocus
            fullWidth
          />
          <div style={{ marginTop: 12 }}>
            <FlatButton
              label={__('Back')}
              onClick={this._prev}
              style={{ marginRight: 12 }}
              disabled={!this.state.article_loaded}
            />
            <RaisedButton
              label={__('Next')}
              onClick={this._next}
              disabled={
                !this.state.selectedArticle || !this.state.article_loaded
              }
            />
            {(!this.state.article_loaded) ?
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
            {(this.state.article_loaded_error) ?
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
        <div
          style={{ display: (this.state.stepIndex === 3) ? 'block' : 'none' }}
        >
          <h3>Choose a group discussion</h3>
          <p>
            Simulate reading a particular discussion thread by choosing one
            from the search provided below.
          </p>
          <AutoComplete
            hintText={__('Type part of all of a title')}
            searchText={this.state.discussionSearchText}
            dataSource={this.state.discussionSearchResults}
            onUpdateInput={this._updateDiscussionList}
            onNewRequest={this._getDiscussionPC}
            filter={this._noFilter}
            openOnFocus
            fullWidth
          />
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
                !this.state.selectedDiscussion || !this.state.discussion_loaded
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
        <div
          style={{ display: (this.state.stepIndex === 4) ? 'block' : 'none' }}
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
                <div style={padLeft}>{this.state.selectedDiscussion.name}</div>
              </div>
            : null}
          </div>
          <div>
            <div style={{ flexGrow: 1 }}>
              {(
                this._needUser()
                && this.state.selectedUser
                && this.state.selectedUser.phrase_cloud
              ) ?
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <h2 style={heading}>{__('Top profile phrases')}</h2>
                  <div>
                    <WordCloud
                      phrases={this.state.selectedUser.phrase_cloud}
                    />
                  </div>
                </div>
              : false}
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
        <CardContainer
          noloader
          loaded={this.state.loaded}
          cards={
            (!this.state.no_recommendations) ?
              this.state.recommendations.map(rec =>
                (<RecommendationCard
                  className="grid-item"
                  key={`article_${rec.articleId}`}
                  rank={rec.rank}
                  title={rec.title}
                  phrases={rec.phrases}
                  type={rec.type}
                />)) :
              <div className="grid-item" key={`noItems${Math.random * 1000}`}>
                <h3>No recommendations are available</h3>
              </div>
          }
        />
      </div>
    );
  }
}

export default ArticleRecommendations;

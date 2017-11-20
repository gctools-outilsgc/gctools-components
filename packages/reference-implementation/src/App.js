/*
 * Author: National Research Council Canada
 * Website: http://www.nrc-cnrc.gc.ca/eng/rd/ict/
 *
 * License: MIT
 * Copyright: Her Majesty the Queen in Right of Canada, as represented by
 * the Minister of National Research Council, 2017
 */
/* eslint-disable global-require */
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LanguageSelector from '@gctools-components/language-selector';
import LocalizedComponent
  from '@gctools-components/react-i18n-translation-webpack';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import ExpandLessIcon from 'material-ui/svg-icons/navigation/expand-less';

import SideLoader from './components/SideLoader';

import Theme from './theme';
import './App.css';

const background = require('./img/flagheader.svg');

const intro = LocalizedComponent(() => (
  <div>
    <h2>{__('Reference Implementation')}</h2>
    <p>{__('description')}</p>
    <p>{__('instructions')}</p>
  </div>
));

const I18nIntro = () => (
  <div>
    <h2>{__('Internationalization')}</h2>
    <p>
      NRC has developed a component, component helper, and webpack plugin
      designed to faciliate translation of single page architecture
      applications built using Webpack and optionally React.
    </p>
    <p>
      Choose a topic from the menu on the left for more information.
    </p>
  </div>
);

const sideLoadWebpackI18n = () =>
  (<SideLoader o={t => require.ensure([], () => {
    t.s(require('./components/demos/components/I18nWebpackPlugin'));
})}
  />);
const sideLoadLanguage = () =>
  (<SideLoader o={t => require.ensure([], () => {
    t.s(require('./components/demos/components/LanguageSelector'));
})}
  />);
const sideLoadLogin = () =>
  (<SideLoader o={t => require.ensure([], () => {
    t.s(require('./components/demos/components/Login'));
})}
  />);
const sideLoadIdentityService = () =>
  (<SideLoader o={t => require.ensure([], () => {
    t.s(require('./components/demos/components/IdentityService'));
})}
  />);
const sideLoadReactHelper = () =>
  (<SideLoader o={t => require.ensure([], () => {
    t.s(require('./components/demos/components/ReactI18n'));
})}
  />);
const sideLoadPhraseCloud = () =>
  (<SideLoader o={t => require.ensure([], () => {
    t.s(require('./components/demos/components/PhraseCloud'));
})}
  />);
const sideLoadPhraseCloudTreeMap = () =>
  (<SideLoader o={t => require.ensure([], () => {
    t.s(require('./components/demos/components/PhraseCloudTreeMap'));
})}
  />);
const sideLoadRecommendationCard = () =>
  (<SideLoader o={t => require.ensure([], () => {
    t.s(require('./components/demos/components/RecommendationCard'));
})}
  />);
const sideLoadArticleRecService = () =>
  (<SideLoader o={t => require.ensure([], () => {
    t.s(require('./components/demos/components/ArticleRecService'));
})}
  />);

class App extends Component {
  constructor() {
    super();
    this.state = {
      active: 'intro',
      flatMenu: [],
    };
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this._flattenMenu = this._flattenMenu.bind(this);
  }

  componentWillMount() {
    const path = document.location.pathname;
    this.setState({ initialPath: path });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!this.state.language_ready && nextState.language_ready) {
      const menuStructure = {
        intro: {
          path: '/',
          label: __('Introduction'),
          component: intro,
        },
        i18n: {
          path: '/i18n',
          label: __('Internationalization'),
          component: I18nIntro,
          children: {
            'i18n-translation-webpack-plugin': {
              path: '/i18n/translation-webpack-plugin',
              label: __('Webpack plugin'),
              component: sideLoadWebpackI18n,
            },
            'react-i18n-translation-webpack': {
              path: '/i18n/react',
              label: __('React helper'),
              component: sideLoadReactHelper,
            },
            language_switcher: {
              path: '/i18n/language_switcher',
              label: __('Language selector'),
              component: sideLoadLanguage,
            },
          },
        },
        authentication: {
          path: '/authentication',
          label: __('Authentication'),
          children: {
            identity: {
              label: __('Identity server'),
              path: '/authentication/identity',
              component: sideLoadIdentityService,
            },
            ssocomp: {
              label: __('Single sign-on'),
              path: '/authentication/sso_component',
              component: sideLoadLogin,
            },
          },
        },
        recommendations: {
          label: __('Recommendations'),
          path: '/recommendations',
          children: {
            phrasecloud: {
              label: __('Phrase cloud'),
              path: '/recommendations/phrase_cloud',
              component: sideLoadPhraseCloud,
            },
            phrasecloudtreemap: {
              label: __('Treemap phrase cloud'),
              path: '/recommendations/treemap_phrase_cloud',
              component: sideLoadPhraseCloudTreeMap,
            },
            recommendation_card: {
              label: __('Recommendation card'),
              path: '/recommendations/card',
              component: sideLoadRecommendationCard,
            },
            article_rec_service: {
              label: __('Article recommendations'),
              path: '/recommendations/article_service',
              component: sideLoadArticleRecService,
            },
          },
        },
      };
      const flatMenu = this._flattenMenu(menuStructure);
      const newState = { flatMenu };
      if (this.state.initialPath) {
        const ensureVisible = (menu) => {
          for (let y = 0; y < flatMenu.length; y += 1) {
            if (flatMenu[y].key === menu.parent) {
              const i = flatMenu[y];
              newState[`expandable_${i.key}`] = true;
              if (i.parent) {
                ensureVisible(i);
              }
            }
          }
        };
        for (let x = 0; x < flatMenu.length; x += 1) {
          if (flatMenu[x].path === this.state.initialPath) {
            newState.active = flatMenu[x].key;
            if (flatMenu[x].parent) {
              ensureVisible(flatMenu[x]);
            }
            break;
          }
        }
        newState.initialPath = false;
      }
      this.setState(newState);
    }
    return true;
  }

  componentWillUnmount() {
    this.state.focusHandle.disengage();
  }

  _flattenMenu(m, parent = '', pad = 0) {
    let ret = [];
    const newState = {};
    Object.keys(m).forEach((c) => {
      const nm = Object.assign({}, m[c]);
      nm.key = c;
      nm.padding = pad;
      if (pad > 0) nm.parent = parent;
      delete nm.children;
      ret.push(nm);
      if (m[c].children) {
        nm.hasChildren = true;
        if (typeof this.state[`expandable_${c}`] !== 'boolean') {
          newState[`expandable_${c}`] = true;
        }
        ret = ret.concat(this._flattenMenu(m[c].children, c, pad + 20));
      }
    });
    this.setState(newState);
    return ret;
  }

  _moreOrLess(item) {
    if (!item.hasChildren) return null;
    if (this.state[`expandable_${item.key}`]) return <ExpandMoreIcon />;
    return <ExpandLessIcon />;
  }

  _blockOrNone(item) {
    if (!item.parent || this.state[`expandable_${item.parent}`]) {
      return 'block';
    }
    return 'none';
  }

  handleMenuClick(e, item, history) {
    const v = item.key;
    const newState = { active: v };
    if (typeof this.state[`expandable_${v}`] === 'boolean') {
      newState[`expandable_${v}`] = !this.state[`expandable_${v}`];
    }
    this.setState(newState);
    history.push(item.path);
  }

  render() {
    if (this.state.flatMenu.length === 0) return false;
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(Theme)}>
        <BrowserRouter>
          <div style={{ margin: 0, padding: 0 }}>
            <AppBar
              showMenuIconButton={false}
              title={(
                <div
                  className="gctools-info-appbar-title"
                  style={{ backgroundImage: `url(${background})` }}
                  dangerouslySetInnerHTML={{ // eslint-disable-line
                    __html: __('Web components | <strong>GC</strong>Tools'),
                  }}
                />
              )}
              titleStyle={{ lineHeight: '68px', height: '68px' }}
              iconElementRight={
                <LanguageSelector labelStyle={{ color: '#fff' }} />
              }
              className="gctools-info-appbar"
            />
            <Drawer open containerClassName="gctools-info-drawer">
              <Route render={({ history }) => (
                <Menu
                  style={{ width: '80%' }}
                  value={this.state.active}
                  onItemTouchTap={(e, v) => {
                    this.handleMenuClick(e, v.props.item, history);
                  }}
                >
                  {this.state.flatMenu.map(item => (
                    <MenuItem
                      item={item}
                      value={item.key}
                      key={item.key}
                      primaryText={item.label}
                      rightIcon={this._moreOrLess(item)}
                      style={{
                          paddingLeft: `${item.padding}px`,
                          display: this._blockOrNone(item),
                        }}
                    />
                    ))}
                </Menu>
              )}
              />
            </Drawer>
            <div className="gctools-info-container">
              <Switch>
                {this.state.flatMenu.map(c => (
                  <Route
                    key={`route_${c.key}`}
                    exact
                    path={c.path}
                    component={c.component}
                  />))}
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default LocalizedComponent(App);

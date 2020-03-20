import React from "react";
import PropTypes from "prop-types";

import "@gctools-components/aurora-css/css/aurora.min.css";
import "../css/style.css";
import "../assets/utils.js";
import MediaQuery from "react-responsive";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

import SidebarToggle from "./SidebarToggle";
import LoginDropdown from "./LoginDropdown";
import AppListDropdown from "./AppListDropdown";
import ToggleLangDropdown from "./ToggleLangDropdown";
import NotificationDropdown from "./NotificationDropdown";
import TopNavBar from "./TopNavBar";

import Canada from "../assets/wmms-spl.svg";

/**
 * Global navigation react component for OADW apps.
 */

class GlobalNav extends React.Component {
  constructor() {
    super();
    this.state = {
      count: 0,
      unreadNotification: [],
      readNotification: []
    };
    this.updateCount = this.updateCount.bind(this);
    this.updateNotifications = this.updateNotifications.bind(this);
  }

  updateCount(number) {
    this.setState({
      count: number
    });
  }

  updateNotifications(unread, read) {
    this.setState({
      unreadNotification: unread,
      readNotification: read
    });
  }

  render() {
    let copy = {};
    if (this.props.currentLang == "en_CA") {
      copy = {
        skip: "Skip to main content",
        help: "Help",
        helpLink: "https://support.gccollab.ca/en/support/home",
        welcome: "Welcome to the GCTools!",
        opensource: "A free and open suite of digital collaboration tools.",
        try: "Haven’t tried it out yet? ",
        register: "Register for a free account.",
        terms: "Terms and Conditions",
        termslink: "https://gccollab.ca/terms"
      };
    } else {
      copy = {
        skip: "Passer au contenu principal",
        help: "Aide",
        helpLink: "https://support.gccollab.ca/fr/support/home",
        welcome: "Bienvenue dans OutilsGC!",
        opensource:
          "Un ensemble libre et ouvert d’outils de collaboration numérique.",
        try: "Vous n’en avez pas encore fait l’essai? ",
        register: "Inscrivez-vous pour ouvrir un compte gratuitement.",
        terms: "Conditions d’utilisation",
        termslink: "https://gccollab.ca/termes"
      };
    }

    return (
      <div>
        <MediaQuery query="(min-width: 768px)">
          <div className="gn-nav">
            <div className="gn-skip-to">
              <a className="sr-only sr-only-focusable" href="#gn-main">
                {copy.skip}
              </a>
            </div>
            <div>
              <TopNavBar
                currentApp={this.props.currentApp}
                minimized={this.props.minimized}
                search={this.props.search}
                searchComponent={this.props.searchComponent}
                currentLang={this.props.currentLang}
                userObject={this.props.currentUser}
                oidcConfig={this.props.oidcConfig}
                doLogin={this.props.doLogin}
              />
              <MediaQuery query="(min-width: 1024px)">
                <SidebarToggle
                  minimized={this.props.minimized}
                  currentLang={this.props.currentLang}
                  onResultClick={e => {
                    this.props.onToggleResultClick(e);
                  }}
                />
              </MediaQuery>
            </div>
            <div
              className={
                "gn-holder " + (this.props.minimized ? "gn-minimize" : "show")
              }
            >
              <LoginDropdown
                userObject={this.props.currentUser}
                oidcConfig={this.props.oidcConfig}
                doLogin={this.props.doLogin}
                currentLang={this.props.currentLang}
              />
              <NotificationDropdown
                userObject={this.props.currentUser}
                accessToken={this.props.accessToken}
                count={this.state.count}
                updateCount={this.updateCount}
                unreadNotification={this.state.unreadNotification}
                readNotification={this.state.readNotification}
                updateNotifications={this.updateNotifications}
                currentLang={this.props.currentLang}
              />
              <AppListDropdown
                currentApp={this.props.currentApp}
                currentLang={this.props.currentLang}
              />
              <ToggleLangDropdown
                currentLang={this.props.currentLang}
                onResultClick={e => {
                  //TODO Send e to parent
                  this.props.onLanguageResultClick(e);
                }}
              />

              <a
                href={copy.helpLink}
                className="gn-dd-btn btn btn-secondary d-flex"
              >
                <div className="align-self-center">
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </div>
                <div className="align-self-center pl-2">{copy.help}</div>
              </a>

              {this.props.currentUser ? (
                ""
              ) : this.props.minimized ? (
                ""
              ) : (
                <MediaQuery query="(min-width: 1024px)">
                  <div className="gn-not-logged-cta">
                    <div>{copy.welcome}</div>
                    <div>{copy.opensource}</div>
                    <div>
                      {copy.try}
                      <a href="https://account.gccollab.ca/register">
                        {copy.register}
                      </a>
                    </div>
                  </div>
                </MediaQuery>
              )}

              <div className="gn-holder-foot">
                <MediaQuery query="(min-width: 1024px)">
                  {this.props.minimized ? (
                    ""
                  ) : (
                    <a href={copy.termslink}>{copy.terms}</a>
                  )}
                </MediaQuery>
                <img src={Canada} alt="Canada" className="float-right" />
              </div>
            </div>
          </div>
        </MediaQuery>
        <MediaQuery query="(max-width: 768px)">
          <div className="gn-nav">
            <div className="gn-skip-to">
              <a className="sr-only sr-only-focusable" href="#gn-main">
                {copy.skip}
              </a>
            </div>
            <TopNavBar
              currentApp={this.props.currentApp}
              minimized={this.props.minimized}
              search={this.props.search}
              currentLang={this.props.currentLang}
              userObject={this.props.currentUser}
              oidcConfig={this.props.oidcConfig}
              doLogin={this.props.doLogin}
              accessToken={this.props.accessToken}
              hamburgerMenu={this.props.hamburgerMenu}
              onLanguageResultClick={e => {
                this.props.onLanguageResultClick(e);
              }}
              count={this.state.count}
              updateCount={this.updateCount}
              unreadNotification={this.state.unreadNotification}
              readNotification={this.state.readNotification}
              updateNotifications={this.updateNotifications}
              searchComponent={this.props.searchComponent}
            />
          </div>
        </MediaQuery>
      </div>
    );
  }
}

GlobalNav.defaultProps = {
  currentLang: "en_CA",
  onLanguageResultClick: () => {},
  currentUser: null,
  currentApp: {},
  accessToken: "",
  oidcConfig: {
    authority: "http://localhost:8080",
    client_id: "js",
    redirect_uri: "http://localhost:8081/#!callback",
    response_type: "id_token token",
    scope: "openid profile api1",
    post_logout_redirect_uri: "http://localhost:8081/#!logout",
    silent_redirect_uri: "http://localhost:8081/#!silent"
  },
  doLogin: () => {},
  minimized: false,
  onToggleResultClick: () => {},
  search: "",
  hamburgerMenu: true,
  searchComponent: null
};

GlobalNav.propTypes = {
  /** This is the current language of the app */
  currentLang: PropTypes.string,
  /** Function will pass the selected language to parent */
  onLanguageResultClick: PropTypes.func,
  /** Information about the current user */
  currentUser: PropTypes.shape({
    /** Logged in user's gcID */
    gcID: PropTypes.string,
    /** Logged in user's name */
    name: PropTypes.string,
    /** Logged in user's avatar */
    avatar: PropTypes.string
  }),
  /** Logged in user's access token */
  accessToken: PropTypes.string,
  /** Information about the parent App */
  currentApp: PropTypes.shape({
    /** A unique client ID for the App */
    id: PropTypes.string,
    /** The name of the App */
    name: PropTypes.string,
    /** The home page URL of the App */
    homeLink: PropTypes.string,
    /** Logo / Icon / Image url for the App */
    logo: PropTypes.string
  }),
  /** The Open ID config for the parent App */
  oidcConfig: PropTypes.shape({}),
  /** Login function from the parent App */
  doLogin: PropTypes.func,
  /** Display status for sidebar*/
  minimized: PropTypes.bool,
  /** Function will pass the sidebar status to parent */
  onToggleResultClick: PropTypes.func,
  /**Send search keyword */
  search: PropTypes.string,
  /** Status of the hamburger menu */
  hamburgerMenu: PropTypes.bool,
  /** A React component that handles searching */
  searchComponent: PropTypes.element
};

export default GlobalNav;

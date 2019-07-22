import React from 'react';
import PropTypes from 'prop-types';

import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Badge,
  } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

import Canada from '../assets/wmms-spl.svg';
import MobileLang from './MobileLang';
import MobileAppList from './MobileAppList';
import NotificationDropdown from './NotificationDropdown';
// import LoginDropdown from './LoginDropdown';
import MobileLogin from './MobileLogin';
import GctoolsIcon from '../assets/gctools-icon.svg';

class MobileMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      closeAll: false,
      collapse: false
    };

    this.toggle = this.toggle.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
  };

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  toggleAll() {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: true
    });
  }

  render() {

    let copy = {}
    if(this.props.currentLang == "en_CA"){
      copy = {
        "skip": "Skip to main content",
        "open": "Open GCTools navigation",
        "closenav": "Close GCTools navigation",
        "unread": " unread notifications",
        "help": "Help",
        "gctools": "GCTools",
        "welcome": "Welcome to the GCTools!",
        "opensource": "A free and open suite of digital collaboration tools.",
        "login": "Log-in to get full access to the apps you need.",
        "try": "Haven’t tried it out yet? ",
        "register":"Register for a free account.",
        "terms": "Terms and Conditions",
        "termslink": "https://gccollab.ca/terms"
      }
    } else {
      copy = {
        "skip": "Passer au contenu principal",
        "open": "Ouvrir le volet navigation dans OutilsGC",
        "closenav": "Fermer la navigation dans OutilsGC",
        "unread": " notifications non lu",
        "gctools": "OutilsGC",
        "help": "Aide",
        "welcome": "Bienvenue dans OutilsGC!",
        "opensource": "Un ensemble libre et ouvert d’outils de collaboration numérique.",
        "login": "Ouvrez une séance pour avoir un accès complet aux applications dont vous avez besoin. ",
        "try": "Vous n’en avez pas encore fait l’essai? ",
        "register": "Inscrivez-vous pour ouvrir un compte gratuitement.",
        "terms": "Conditions d’utilisation",
        "termslink": "https://gccollab.ca/termes"
      }
    }

    const notifBadge = this.props.count < 1 ? ( "" ) :
    (<Badge color="danger" className="align-self-center">
        {this.props.count}
        <span className="sr-only">{copy.unread}</span>
    </Badge>);

    const closeBtn = <button className="close" onClick={this.toggle}>&times;<span className="sr-only">{copy.closenav}</span></button>;

    return (
      <div>
        <Button onClick={this.toggle} className="mobile-menu-btn d-flex">
          <span className="sr-only">{copy.open}</span>
          <img className="align-self-center" src={GctoolsIcon} alt="" style={{width: "30px", height: "30px"}}/> {notifBadge}
        </Button>
        <Modal wrapClassName="gn-modal" zIndex="999" isOpen={this.state.modal} toggle={this.toggle} className="gn-mobile-menu">
          <ModalHeader close={closeBtn} toggle={this.toggle}>{copy.gctools}</ModalHeader>
          <ModalBody>
            <MobileLogin
              closeAll={this.toggle}
              userObject={this.props.userObject}
              oidcConfig={this.props.oidcConfig}
              doLogin={this.props.doLogin}
              currentLang={this.props.currentLang}
            />
            <NotificationDropdown
              currentLang={this.props.currentLang}
              closeAll={this.toggle}
              userObject={this.props.userObject}
              accessToken={this.props.accessToken}
              count={this.props.count}
              updateCount={this.props.updateCount}
            />
            <MobileAppList
              currentLang={this.props.currentLang}
              currentApp={this.props.currentApp}
              closeAll={this.toggle}
            />
            <MobileLang
              currentLang={this.props.currentLang}
              closeAll={this.toggle}
              onResultClick={(e) => {
                this.props.onLanguageResultClick(e);
              }}
            />

            <a href="https://gccollab.gctools-outilsgc.ca/en/support/home" className="gn-grid-btn btn btn-secondary d-inline-block">
              <FontAwesomeIcon icon={faQuestionCircle} />
              <div>
                {copy.help}
              </div>
            </a>
          </ModalBody>
          <ModalFooter>
            <a className="terms" href={copy.termslink}>{copy.terms}</a>
            <img src={Canada} alt="Canada" className="float-right" />
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default MobileMenu;
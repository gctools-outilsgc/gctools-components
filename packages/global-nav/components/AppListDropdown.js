import React from 'react';
import PropTypes from 'prop-types';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import MediaQuery from 'react-responsive';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh } from '@fortawesome/free-solid-svg-icons';

import GCcollabIcon from '../assets/gccollab-icon.svg';
import GCmessageIcon from '../assets/gcmessage-icon.svg';
import GCwikiIcon from '../assets/gcwiki-icon.svg';

const AppListDropdown = (props) => {
  const {
    currentApp,
    currentLang
  } = props;
  // Hardcoded array of apps
  const appList = [
    {
      'nameEN': 'Directory',
      'nameFR': 'Répertoire',
      'color': '#754f8b',
      'id': '4',
      'logo': '',
      'descEN': 'Find the people you need.',
      'descFR': 'Trouver les personnes dont vous avez besoin.',
      'link': 'https://profile.gccollab.ca',
    },
    {
      'nameEN': 'GCmessage',
      'nameFR': 'GCmessage',
      'color': '#46246a',
      'id': '1',
      'logo': GCmessageIcon,
      'descEN': 'Chat instantly with people and groups.',
      'descFR': 'Participer instantanément à des conversations avec d’autres personnes ou des groupes.',
      'link': 'https://message.gccollab.ca',
    },
    {
      'nameEN': 'GCcollab',
      'nameFR': 'GCcollab',
      'color': '#46246a',
      'id': '2',
      'logo': GCcollabIcon,
      'descEN': 'Collaborate and network.',
      'descFR': 'Collaborer et réseauter.',
      'link': 'https://gccollab.ca',
    },
    {
      'nameEN': 'GCwiki',
      'nameFR': 'GCwiki',
      'color': '#46246a',
      'id': '3',
      'logo': GCwikiIcon,
      'descEN': 'Share knowledge and co-create content.',
      'descFR': 'Échanger des connaissances et créer du contenu ensemble.',
      'link': 'https://wiki.gccollab.ca/Main_Page',
    },
  ];

  //Map apps and Identify the app the user is currently on by App ID
  const listComponent = appList.map(a => (
    <DropdownItem key={a.id} className="d-flex" href={a.link} style={{ maxWidth: "340px", whiteSpace: "normal" }}>
      {/*(a.id == currentApp.id) ? 'Current App': ''*/}
      {a.logo != '' ?
        <img className="align-self-center" style={{ width: "40px", height: "40px" }} src={a.logo} alt="" />
        :
        <div className="gn-applist-logo align-self-center d-flex" style={{ 'backgroundColor': a.color }} >
          {currentLang == "en_CA" ?
            <span aria-hidden="true" className="align-self-center">{a.nameEN.charAt(0)}</span>
            :
            <span aria-hidden="true" className="align-self-center">{a.nameFR.charAt(0)}</span>
          }
        </div>
      }
      <div className="align-self-center ml-2">
        <div className="h6 mb-0">
          {currentLang == "en_CA" ?
            a.nameEN
            :
            a.nameFR
          }
        </div>
        <small className="text-muted">
          {currentLang == "en_CA" ?
            a.descEN
            :
            a.descFR
          }
        </small>
      </div>
    </DropdownItem>
  ));

  const mobileList = appList.map(a => (
    <a href={a.link} className="d-flex mb-2" key={`m-${a.id}`}>
      {/*(a.id == currentApp.id) ? 'Current App': ''*/}
      {a.logo != '' ?
        <img className="align-self-center" style={{ width: "40px", height: "40px" }} src={a.logo} alt="" />
        :
        <div className="gn-applist-logo align-self-center d-flex" style={{ 'backgroundColor': a.color }} >
          {currentLang == "en_CA" ?
            <span aria-hidden="true" className="align-self-center">{a.nameEN.charAt(0)}</span>
            :
            <span aria-hidden="true" className="align-self-center">{a.nameFR.charAt(0)}</span>
          }
        </div>
      }
      <div className="align-self-center ml-2">
        <div className="h6 mb-0">
          {currentLang == "en_CA" ?
            a.nameEN
            :
            a.nameFR
          }
        </div>
        <small className="text-muted">
          {currentLang == "en_CA" ?
            a.descEN
            :
            a.descFR
          }
        </small>
      </div>
    </a>
  ));

  let copy = {}
  if (currentLang == "en_CA") {
    copy = {
      "apps": "Apps",
      "welcome": "Welcome to the GCTools!",
      "opensource": "A free and open suite of digital collaboration tools.",
      "login": "Log-in to get full access to the apps you need.",
      "try": "Haven’t tried it out yet? ",
      "register": "Register for a free account."
    }
  } else {
    copy = {
      "apps": "Applications",
      "welcome": "Bienvenue dans OutilsGC!",
      "opensource": "Un ensemble libre et ouvert d’outils de collaboration numérique.",
      "login": "Ouvrez une séance pour avoir un accès complet aux applications dont vous avez besoin. ",
      "try": "Vous n’en avez pas encore fait l’essai? ",
      "register": "Inscrivez-vous pour ouvrir un compte gratuitement. "
    }
  }

  return (
    <div>
      <MediaQuery query="(min-width: 769px)">
        <UncontrolledDropdown direction="left">
          <DropdownToggle className="gn-dd-btn d-flex">
            <div className="align-self-center">
              <FontAwesomeIcon icon={faTh} />
            </div>
            <div className="align-self-center pl-2">
              {copy.apps}
            </div>
          </DropdownToggle>
          <DropdownMenu modifiers={{ computeStyle: { gpuAcceleration: false } }}>
            {listComponent}
          </DropdownMenu>
        </UncontrolledDropdown>
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <div>
          {mobileList}
        </div>
      </MediaQuery>
    </div>
  );
};

AppListDropdown.defaultProps = {
  currentApp: {
    id: '1',
  },
  currentlang: "en_CA"
};

AppListDropdown.propTypes = {
  /** The current app object ID */
  currentApp: PropTypes.shape({
    id: PropTypes.string,
  }),
  currentLang: PropTypes.string,
};

export default AppListDropdown;

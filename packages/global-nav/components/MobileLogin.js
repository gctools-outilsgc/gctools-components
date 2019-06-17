import React from 'react'; import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'reactstrap';
// import Login from '@gctools-components/gc-login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignInAlt, faSignOutAlt, faCog } from '@fortawesome/free-solid-svg-icons';

class MobileLogin extends React.Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      hideHeader: false,
    };

    this.toggle = this.toggle.bind(this);
    this.closeEverything = this.closeEverything.bind(this);
  };
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }
  closeEverything() {
    this.toggle();
    this.props.closeAll();
    this.setState(prevState => ({
      hideHeader: !prevState.hideHeader
    }));
  }
  render() {

    const hideHeaderClass = (this.state.hideHeader ? "gn-header-move" : "");

    let copy = {}
    if(this.props.currentLang == "en_CA"){
      copy = {
        "profile": "My profile",
        "account": "Account settings",
        "logout": "Log-out",
        "login": "Log-in",
        "return": "Return to main menu",
        "closenav": "Close GCTools navigation", 
      }
    } else {
      copy = {
        "profile": "Mon profil",
        "account": "Paramètres du compte",
        "logout": "Quitter la séance",
        "login": "Se connecter",
        "return": "Retour au menu principal",
        "closenav": "Fermer la navigation dans OutilsGC",
      }
    }

    const closeBtn = <button className="close" onClick={this.closeEverything}>&times;<span className="sr-only">{copy.closenav}</span></button>;

    return (
      <div>
        {this.props.userObject ? (
          <Button className="gn-dd-btn" onClick={this.toggle}>
          <div className="d-flex">
            <div className="align-self-center">
              <img
                className="gn-avatar"
                src={this.props.userObject.picture}
                alt=""
              />
            </div>
            <div className="align-self-center pl-2">
              {this.props.userObject.name}
            </div>
          </div>
          </Button>
        ) : (
          <Button className="gn-dd-btn" onClick={(e) => {
            e.stopPropagation();
            if(document.getElementById('login-btn')){
              document.getElementById('login-btn').click();
            }
          }}>
            <div className="d-flex">
              <div className="align-self-center">
                <FontAwesomeIcon icon={faSignInAlt} />
              </div>
              <div className="align-self-center pl-2">
                {copy.login}
              </div>
            </div>
          </Button>
        )}
        
        <Modal
          className="gn-mobile-menu"
          zIndex="999"
          isOpen={this.state.modal}
          toggle={this.toggle}
          wrapClassName="gn-sub-modal"
          backdrop={false}
        >
          <ModalHeader
            className={hideHeaderClass}
            close={closeBtn}
            toggle={this.closeEverything}
          >
            {copy.profile}
          </ModalHeader>
          <div className="d-flex gn-dd-btn gn-mobile-back-btn">
            <div className="align-self-center" >
              <Button
                onClick={this.toggle}
                aria-label="Return"
              >
                <span className="gn-chevron-arrow-left"></span>
                <span className="sr-only">{copy.return}</span>
              </Button>
            </div>

            {this.props.userObject ? (
              <div className="d-flex">
                <div className="align-self-center">
                  <img
                    className="gn-avatar"
                    src={this.props.userObject.picture}
                    alt=""
                  />
                </div>
                <div className="align-self-center pl-2">
                  {this.props.userObject.name}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <ModalBody>
            {this.props.userObject ? (
              <div className="d-flex help-section">
                <Button className="gn-grid-btn help-button" href={`https://profile.gccollab.ca/p/${this.props.userObject.sub}`}>
                  <div>
                    <div>

                    </div>
                    <FontAwesomeIcon icon={faUserCircle} />
                    <div>{copy.profile}</div>
                  </div>
                </Button>
                <Button className="gn-grid-btn help-button" href={`https://account.gccollab.ca/securitypages/`}>
                  <div>
                    <div>

                    </div>
                    <FontAwesomeIcon icon={faCog} />
                    <div>{copy.account}</div>
                  </div>
                </Button>
                <Button className="gn-grid-btn help-button" onClick={(e) => {
                  e.stopPropagation();
                  if(document.getElementById('login-btn')){
                    document.getElementById('login-btn').click();
                  }
                }}>
                  <div>
                    <div>

                    </div>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <div>{copy.logout}</div>
                  </div>
                </Button>
              </div>
            ) : (
                ""
              )}
          </ModalBody>
          <ModalFooter>
            <Button size="sm" color="secondary" onClick={this.toggle}>{copy.return}</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default MobileLogin;


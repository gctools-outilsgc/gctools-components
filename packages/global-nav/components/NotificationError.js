import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBellSlash } from '@fortawesome/free-solid-svg-icons';

import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
  } from 'reactstrap';

class NotificationError extends React.Component {
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

    render(){

        const hideHeaderClass = (this.state.hideHeader ? "gn-header-move" : "");

        let copy = {}
        if(this.props.currentLang == "en_CA"){
            copy = {
            "return": "Return to main menu",
            "close": "Close GCTools navigation",
            "error": "Unable to show notifications. Please try again later."
            }
        } else {
            copy = {
            "return": "Retour au menu principal",
            "close": "Fermer la navigation dans OutilsGC",
            "error": "Incapable de montrer des notifications. S'il vous plaît essayer plus tard. "
            }
        }

        return(
            <div>
                <MediaQuery query="(min-width: 768px)">
                    <UncontrolledDropdown direction="left">
                        <DropdownToggle className="gn-dd-btn d-flex">
                          <div className="align-self-center">
                            <FontAwesomeIcon icon={faBellSlash} />
                          </div>
                          <div className="align-self-center pl-2">
                            Notifications
                          </div>
                        </DropdownToggle>
                        <DropdownMenu className="gn-notif-menu">
                            <p className="m-2">
                              {copy.error}
                            </p>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                </MediaQuery>

                <MediaQuery query="(max-width: 768px)">
                    <div>
                        <Button className="gn-dd-btn d-flex" onClick={this.toggle}>
                            <div className="align-self-center">
                                <FontAwesomeIcon icon={faBellSlash} />
                            </div>
                            <div className="align-self-center pl-2">
                                Notifications
                            </div>
                        </Button>

                        <Modal
                            className="gn-mobile-menu gn-notification-modal" 
                            zIndex="99999" 
                            isOpen={this.state.modal} 
                            toggle={this.toggle}
                            wrapClassName="gn-sub-modal"
                            backdrop={false}
                        >
                            <ModalHeader
                                className={hideHeaderClass} 
                                toggle={this.closeEverything}
                            >
                                Notifications
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
                                <div className="align-self-center">
                                    <FontAwesomeIcon icon={faBellSlash} />
                                </div>
                                <div className="align-self-center pl-2">
                                    Notifications
                                </div>
                            </div>
                            <ModalBody>
                                <div>
                                    <div className="gn-notifications-list">
                                        <div className="align-self-center ml-3 mr-3">
                                            {copy.error}
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button size="sm" color="secondary" onClick={this.toggle} >{copy.return}</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                </MediaQuery>
            </div>
        );
    }
}

NotificationError.defaultProps = {
    currentLang: 'en_CA',
    closeAll: () => {}
};
  
NotificationError.propTypes = {
    currentLang: PropTypes.string,
    closeAll: PropTypes.func
};

export default NotificationError;
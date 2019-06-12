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
                              Unable to fetch notifications. Please try again later.
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
                                            Unable to fetch notifications. Please try again later.
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button size="sm" color="secondary" onClick={this.toggle} >Close</Button>
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
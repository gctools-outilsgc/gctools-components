import React from 'react';
import PropTypes from 'prop-types';

import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Badge
  } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

class MobileNotifications extends React.Component {
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

        const notifBadge = Object.entries(this.props.data.notifications).length === 0 ? ( "" ) :
        (<Badge color="danger" className="align-self-center">
            {Object.entries(this.props.data.notifications).length}
            <span className="sr-only">unread</span>
        </Badge>);

        return (
            <div>
                <Button className="gn-dd-btn d-flex" onClick={this.toggle}>
                    <div className="align-self-center">
                        <FontAwesomeIcon icon={faBell} />
                    </div>
                    {notifBadge}
                    <div className="align-self-center pl-2">
                        Notifications
                    </div>
                </Button>

                <Modal
                    className="gn-mobile-menu" 
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
                        GCTools
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
                            <FontAwesomeIcon icon={faBell} />
                        </div>
                        {notifBadge}
                        <div className="align-self-center pl-2">
                            Notifications
                        </div>
                    </div>
                    <ModalBody>
                        <div>
                        {Object.entries(this.props.data.notifications).length === 0 ? (
                            <li>
                              No new notifications available.
                            </li>
                          ): (
                            this.props.data.notifications.map(notif =>(
                            <li key={notif.id}>
                              {notif.online.titleEn}
                            </li>
                            ))
                          )}
                        </div>
                        <Button className="gn-dd-btn">REd</Button>
                        <Button className="gn-dd-btn">REd</Button>
                        <Button className="gn-dd-btn">REd</Button>
                        <Button className="gn-dd-btn">REd</Button>
                        <Button className="gn-dd-btn">REd</Button>
                        <Button className="gn-dd-btn">REd</Button>
                        <Button className="gn-dd-btn">REd</Button>
                        <Button className="gn-dd-btn">REd</Button>
                        <Button className="gn-dd-btn">REd</Button>
                        <Button className="gn-dd-btn">REd</Button>
                        <Button className="gn-dd-btn">REd</Button>
                        <Button className="gn-dd-btn">REd</Button>
                        <Button className="gn-dd-btn">REd</Button>
                        <Button className="gn-dd-btn">REd</Button>
                        <Button className="gn-dd-btn">REd</Button>
                        <Button className="gn-dd-btn">REd</Button>
                    </ModalBody>

                    <ModalFooter>
                        <Button size="sm" color="primary" onClick={this.toggle}>Done</Button>{' '}
                        <Button size="sm" color="secondary" onClick={this.closeEverything} >All Done</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default MobileNotifications;
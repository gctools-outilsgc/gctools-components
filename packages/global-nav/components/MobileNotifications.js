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
                            <FontAwesomeIcon icon={faBell} />
                        </div>
                        {notifBadge}
                        <div className="align-self-center pl-2">
                            Notifications
                        </div>
                    </div>
                    <ModalBody>
                        <div>
                            <ul className="gn-notifications-list">
                                {Object.entries(this.props.data.notifications).length === 0 ? (
                                    <li className="align-self-center ml-3 mr-3">
                                        No new notifications available.
                                    </li>
                                ): (
                                    this.props.data.notifications.map(notif =>(
                                    <li className="d-inline" key={notif.id}>
                                        <a href="!#" className="d-flex">
                                            {notif.online.viewed ? 
                                            <div className="gn-unread align-self-center">
                                                <span className="sr-only">Unread</span>
                                            </div>
                                            : 
                                            <div style={{"width": "24px"}}/>}
                                            <div
                                                className="gn-applist-logo align-self-center"
                                                style={{ 'backgroundColor': 'green' }}
                                            >
                                                <span>{notif.id}</span>
                                            </div>
                                            <small className="align-self-center ml-2">
                                                {notif.online.titleEn}
                                                <p className="mb-0">timestamp</p>
                                            </small>
                                        </a>
                                    </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button size="sm" color="primary" >Clear all</Button>{' '}
                        <Button size="sm" color="secondary" onClick={this.toggle} >Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

MobileNotifications.defaultProps = {
    currentLang: 'en_CA',
    data: null,
    closeAll: () => {}
  };

MobileNotifications.propTypes = {
    currentLang: PropTypes.string,
    data: PropTypes.shape({
      id: PropTypes.string,
      actionLevel: PropTypes.string,
      gcID: PropTypes.string,
      online: PropTypes.shape({
        titleEn: PropTypes.string,
        viewed: PropTypes.bool,
      }),
    }),
    closeAll: PropTypes.func,
};

export default MobileNotifications;
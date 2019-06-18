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
import { Mutation } from 'react-apollo';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

import NotificationItem from './NotificationItem';

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

        let copy = {}
        if(this.props.currentLang == "en_CA"){
            copy = {
                "notifications": "Notifications",
                "return": "Return to main menu",
                "closenav": "Close GCTools navigation",
                "new": "No new notifications",
                "unread": " unread"
            }
        } else {
            copy = {
                "notifications": "Notifications",
                "return": "Retour au menu principal",
                "closenav": "Fermer la navigation dans OutilsGC",
                "new": "Aucunes notifications nouveaux",
                "unread": " non lu",
            }
        }

        const hideHeaderClass = (this.state.hideHeader ? "gn-header-move" : "");

        const notifBadge = this.props.count < 1 ? ( "" ) :
        (<Badge color="danger">
            {this.props.count}
            <span className="sr-only">{copy.unread}</span>
        </Badge>);

        const closeBtn = <button className="close" onClick={this.closeEverything}>&times;<span className="sr-only">{copy.closenav}</span></button>;

        return (
            <div>
                <Button className="gn-grid-btn" onClick={this.toggle}>
                    <div className="btn-align">
                        <FontAwesomeIcon icon={faBell} />
                        <span className="gn-notification-badge">{notifBadge}</span>
                        <div>
                            Notifications
                        </div>
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
                        close={closeBtn}
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
                            <FontAwesomeIcon icon={faBell} />
                        </div>
                        <div className="align-self-center">
                            {notifBadge}
                        </div>
                        <div className="align-self-center pl-2">
                            Notifications
                        </div>
                    </div>
                    <ModalBody>
                        <div>
                            <div className="gn-notifications-list">
                                {Object.entries(this.props.data.notifications).length === 0 ? (
                                    <div className="align-self-center ml-3 mr-3">
                                        {copy.new}
                                    </div>
                                ): (
                                    this.props.data.notifications.map(notif =>(
                                        <Mutation
                                            key={notif.id}
                                            client={this.props.client}
                                            mutation={this.props.READ_NOTIFICATION}
                                        >
                                            {(updateNotification) => (
                                            <NotificationItem
                                                notification={notif}
                                                currentLang={this.props.currentLang}
                                                readNotification={() => {
                                                updateNotification({ variables: { id: notif.id, online: { viewed: true } } });
                                                }}
                                            />
                                            )}
                                        </Mutation>
                                    ))
                                )}
                            </div>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button size="sm" color="secondary" onClick={this.toggle}>{copy.return}</Button>
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
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

        const hideHeaderClass = (this.state.hideHeader ? "gn-header-move" : "");

        const notifBadge = this.props.count < 1 ? ( "" ) :
        (<Badge color="danger" className="align-self-center">
            {this.props.count}
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
                            <div className="gn-notifications-list">
                                {Object.entries(this.props.data.notifications).length === 0 ? (
                                    <div className="align-self-center ml-3 mr-3">
                                        No new notifications available.
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
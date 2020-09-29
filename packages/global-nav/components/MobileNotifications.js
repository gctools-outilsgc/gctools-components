import React, { Fragment } from "react";
import PropTypes from "prop-types";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import { Mutation } from "react-apollo";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import NotificationItem from "./NotificationItem";

class MobileNotifications extends React.Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      hideHeader: false,
      activeTab: "1"
    };

    this.toggle = this.toggle.bind(this);
    this.closeEverything = this.closeEverything.bind(this);
    this.toggleTabs = this.toggleTabs.bind(this);
  }

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

  toggleTabs(tab) {
    this.setState({
      activeTab: tab
    });
  }

  render() {
    let copy = {};
    if (this.props.currentLang == "en_CA") {
      copy = {
        notifications: "Notifications",
        return: "Return to main menu",
        closenav: "Close GCTools navigation",
        new: "No new notifications",
        unread: " unread",
        unreadtab: "Unread",
        readTab: "Read",
        noUnread: "No unread notifications",
        noRead: "No read notifications"
      };
    } else {
      copy = {
        notifications: "Notifications",
        return: "Retour au menu principal",
        closenav: "Fermer la navigation dans OutilsGC",
        new: "Aucunes notifications nouveaux",
        unread: " non lus",
        unreadtab: "Non lus",
        readTab: "Lus",
        noUnread: "Aucunes notifications non lus",
        noRead: "Aucunes notifications lus"
      };
    }

    const hideHeaderClass = this.state.hideHeader ? "gn-header-move" : "";

    const notifBadge =
      this.props.count < 1 ? (
        ""
      ) : (
          <Badge color="danger">
            {this.props.count}
            <span className="sr-only">{copy.unread}</span>
          </Badge>
        );

    const closeBtn = (
      <button className="close" onClick={this.closeEverything}>
        &times;<span className="sr-only">{copy.closenav}</span>
      </button>
    );

    return (
      <div>
        <Button className="gn-grid-btn" onClick={this.toggle}>
          <div className="btn-align">
            <FontAwesomeIcon icon={faBell} />
            <span className="gn-notification-badge">{notifBadge}</span>
            <div>Notifications</div>
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
            <div className="align-self-center">
              <Button onClick={this.toggle} aria-label="Return">
                <span className="gn-chevron-arrow-left"></span>
                <span className="sr-only">{copy.return}</span>
              </Button>
            </div>
            <div className="align-self-center">
              <FontAwesomeIcon icon={faBell} />
            </div>
            <div className="align-self-center">{notifBadge}</div>
            <div className="align-self-center pl-2">Notifications</div>
          </div>
          <Nav tabs justified>
            <NavItem>
              <NavLink
                className={this.state.activeTab == 1 ? "active" : ""}
                onClick={() => {
                  this.toggleTabs("1");
                }}
                href="#"
                data-toggle="tab"
              >
                {copy.unreadtab}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                data-toggle="tab"
                className={this.state.activeTab == 2 ? "active" : ""}
                onClick={() => {
                  this.toggleTabs("2");
                }}
              >
                {copy.readTab}
              </NavLink>
            </NavItem>
          </Nav>
          <ModalBody>
            <TabContent
              className="gn-notif-tabs"
              activeTab={this.state.activeTab}
            >
              <TabPane tabId="1">
                <ul className="gn-notifications-list">
                  {this.props.unread.length > 0 ? (
                    this.props.unread.map(notif => (
                      <Mutation
                        key={notif.id}
                        mutation={this.props.mutation}
                        client={this.props.client}
                        variables={{
                          id: notif.id,
                          online: { viewed: true }
                        }}
                        context={{
                          headers: {
                            Authorization: `Bearer ${this.props.accessToken}`
                          }
                        }}
                      >
                        {updateNotification => (
                          <NotificationItem
                            key={notif.id}
                            mobile={true}
                            notification={notif}
                            currentLang={this.props.currentLang}
                            updateNotification={updateNotification}
                          />
                        )}
                      </Mutation>
                    ))
                  ) : (
                      <li className="pl-2">{copy.noUnread}</li>
                    )}
                </ul>
              </TabPane>

              <TabPane tabId="2">
                <ul className="gn-notifications-list">
                  {this.props.read.length > 0 ? (
                    this.props.read.map(notif => (
                      <NotificationItem
                        key={notif.id}
                        mobile={true}
                        notification={notif}
                        currentLang={this.props.currentLang}
                      />
                    ))
                  ) : (
                      <li className="pl-2">{copy.noRead}</li>
                    )}
                </ul>
              </TabPane>
            </TabContent>
          </ModalBody>

          <ModalFooter>
            <Button size="sm" color="secondary" onClick={this.toggle}>
              {copy.return}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

MobileNotifications.defaultProps = {
  currentLang: "en_CA",
  data: null,
  closeAll: () => { },
  unreadNotification: [],
  readNotification: []
};

MobileNotifications.propTypes = {
  currentLang: PropTypes.string,
  data: PropTypes.shape({
    id: PropTypes.string,
    actionLevel: PropTypes.string,
    gcID: PropTypes.string,
    online: PropTypes.shape({
      titleEn: PropTypes.string,
      viewed: PropTypes.bool
    })
  }),
  closeAll: PropTypes.func
};

export default MobileNotifications;

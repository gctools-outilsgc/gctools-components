import React, { useState } from "react";
import PropTypes from "prop-types";
import MediaQuery from "react-responsive";

import {
  Button,
  Badge,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody
} from "reactstrap";

import { Mutation } from "react-apollo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import NotificationItem from "./NotificationItem";
import MobileNotifications from "./MobileNotifications";

const DesktopNotifications = props => {
  const {
    accessToken,
    closeAll,
    currentLang,
    data,
    READ_NOTIFICATION,
    notificationClient
  } = props;

  // Define language
  let copy = {};
  if (currentLang == "en_CA") {
    copy = {
      unread: "unread",
      unreadTab: "Unread",
      readTab: "Read",
      new: "No new notifications",
      close: "Close",
      noUnread: "No unread notifications",
      noRead: "No read notifications"
    };
  } else {
    copy = {
      unread: " non lus",
      unreadTab: "Non lus",
      readTab: "Lus",
      new: "Aucunes notifications nouveaux",
      close: "Proche",
      noUnread: "Aucunes notifications non lus",
      noRead: "Aucunes notifications lus"
    };
  }

  const [activeTab, setActiveTab] = useState("1");
  const [modal, setModal] = useState(false);

  const toggleTabs = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const toggleModal = () => setModal(!modal);

  const closeBtn = (
    <button className="close" onClick={toggleModal}>
      &times;<span className="sr-only">{copy.close}</span>
    </button>
  );

  let unread = [];
  let read = [];

  data.notifications.map(notif => {
    notif.online.viewed === false ? unread.push(notif) : read.push(notif)
  });

  let count = unread.length;

  return (
    <div className="query-maybe-it-might-get-mad">
      <MediaQuery query="(min-width: 769px)">
        <Button className="gn-dd-btn d-flex" onClick={toggleModal}>
          <div className="align-self-center">
            <FontAwesomeIcon icon={faBell} />
          </div>
          {count < 1 ? (
            ""
          ) : (
              <Badge
                color="danger"
                className="align-self-center gn-notification-badge"
              >
                {count}
                <span className="sr-only">{copy.unread}</span>
              </Badge>
            )}
          <div className="align-self-center pl-2">Notifications</div>
        </Button>
        <Modal
          className=""
          zIndex="99999"
          isOpen={modal}
          toggle={toggleModal}
          wrapClassName=""
          modalClassName="modal-overflow"
          backdrop={true}
          id="gn-notif-modal"
        >
          <ModalHeader close={closeBtn}>Notifications</ModalHeader>
          <Nav tabs justified>
            <NavItem>
              <NavLink
                className={activeTab == 1 ? "active" : ""}
                onClick={() => {
                  toggleTabs("1");
                }}
                href="#"
                data-toggle="tab"
              >
                {copy.unreadTab}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                data-toggle="tab"
                className={activeTab == 2 ? "active" : ""}
                onClick={() => {
                  toggleTabs("2");
                }}
              >
                {copy.readTab}
              </NavLink>
            </NavItem>
          </Nav>
          <ModalBody>
            <div className="gn-notif-container">
              <TabContent
                className="gn-notif-tabs"
                activeTab={activeTab}
              >
                <TabPane tabId="1">
                  <ul>
                    {unread.length > 0 ? (
                      unread.map(notif => (
                        <Mutation
                          key={notif.id}
                          mutation={READ_NOTIFICATION}
                          client={notificationClient}
                          variables={{
                            id: notif.id,
                            online: { viewed: true }
                          }}
                        >
                          {updateNotification => (
                            <NotificationItem
                              updateNotification={updateNotification}
                              notification={notif}
                              currentLang={currentLang}
                            />
                          )}
                        </Mutation>
                      ))
                    ) : (
                        <li>{copy.noUnread}</li>
                      )}
                  </ul>
                </TabPane>
                <TabPane tabId="2">
                  <ul>
                    {read.length > 0 ? (
                      read.map(notif => (
                        <NotificationItem
                          key={notif.id}
                          notification={notif}
                          currentLang={currentLang}
                        />
                      ))
                    ) : (
                        <li>{copy.noRead}</li>
                      )}
                  </ul>
                </TabPane>
              </TabContent>
            </div>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </Modal>
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <MobileNotifications
          accessToken={accessToken}
          currentLang={currentLang}
          closeAll={closeAll}
          data={data}
          client={notificationClient}
          count={count}
          unread={unread}
          read={read}
          mutation={READ_NOTIFICATION}
        />
      </MediaQuery>
    </div>
  );
}

export default DesktopNotifications;

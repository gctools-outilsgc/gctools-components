/* eslint-disable */
import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import MediaQuery from "react-responsive";

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  Button,
  DropdownItem,
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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import { ApolloClient, InMemoryCache, HttpLink } from "apollo-boost";

import NotificationItem from "./NotificationItem";
import MobileNotifications from "./MobileNotifications";
import NotificationLoad from "./NotificationLoad";
import NotificationError from "./NotificationError";

const notificationClient = new ApolloClient({
  link: new HttpLink({
    uri: "http://10.0.0.226:4000"
  }),
  cache: new InMemoryCache()
});

const GET_NOTIFICATIONS = gql`
  query notifications($orderBy: OrderByInput, $viewed: Boolean) {
    notifications(orderBy: $orderBy, viewed: $viewed) {
      id
      actionLink
      generatedOn
      appID
      online {
        titleEn
        titleFr
        descriptionEn
        descriptionFr
        viewed
      }
    }
  }
`;

const READ_NOTIFICATION = gql`
  mutation UpdateNotification($id: ID!, $online: UpdateOnlineInput) {
    updateNotification(id: $id, online: $online) {
      id
      online {
        viewed
      }
    }
  }
`;

const NotificationDropdown = props => {
  const {
    userObject,
    accessToken,
    closeAll,
    currentLang,
    count,
    updateCount
  } = props;

  let gcID = "";
  if (userObject) {
    gcID = userObject.sub;
  }

  let copy = {};
  if (currentLang == "en_CA") {
    copy = {
      unread: "unread",
      new: "No new notifications"
    };
  } else {
    copy = {
      unread: " non lu",
      new: "Aucunes notifications nouveaux"
    };
  }

  const orderBy = "generatedOn_DESC";

  const [activeTab, setActiveTab] = useState("1");
  const [modal, setModal] = useState(false);
  const [unreadNotification, setUnreadNotifications] = useState([]);
  const [readNotification, setReadNotifications] = useState([]);

  const toggleTabs = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const toggleModal = () => setModal(!modal);

  const addUnread = notif => setUnreadNotifications(notif);
  const addRead = notif => setReadNotifications(notif);

  const closeBtn = (
    <button className="close" onClick={toggleModal}>
      &times;<span className="sr-only">{copy.closenav}</span>
    </button>
  );

  return (
    <div className="gn-inline">
      {userObject ? (
        <Query
          client={notificationClient}
          query={GET_NOTIFICATIONS}
          variables={{ orderBy }}
          onCompleted={data => {
            console.log("complete");
            console.log(data);
            let U = [];
            let R = [];
            data.notifications.map(notif =>
              notif.online.viewed === false ? U.push(notif) : R.push(notif)
            );
            addUnread(U);
            addRead(R);
            updateCount(U.length);
          }}
          context={{
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }}
        >
          {({ loading, error, data }) => {
            if (loading) return <NotificationLoad currentLang={currentLang} />;
            if (error)
              return (
                <NotificationError
                  currentLang={currentLang}
                  closeAll={closeAll}
                />
              );
            return (
              <div className="query-maybe-it-might-get-mad">
                <MediaQuery query="(min-width: 768px)">
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
                          Unread
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
                          Read
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
                              {unreadNotification.length > 0 ? (
                                unreadNotification.map(notif => (
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
                                <li>No notifications</li>
                              )}
                            </ul>
                          </TabPane>
                          <TabPane tabId="2">
                            <ul>
                              {readNotification.length > 0 ? (
                                readNotification.map(notif => (
                                  <NotificationItem
                                    key={notif.id}
                                    notification={notif}
                                    currentLang={currentLang}
                                  />
                                ))
                              ) : (
                                <li>No notifications</li>
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
                    currentLang={currentLang}
                    closeAll={closeAll}
                    data={data}
                    READ_NOTIFICATION={READ_NOTIFICATION}
                    client={notificationClient}
                    count={count}
                    unreadNotification={unreadNotification}
                    readNotification={readNotification}
                    mutation={READ_NOTIFICATION}
                  />
                </MediaQuery>
              </div>
            );
          }}
        </Query>
      ) : (
        ""
      )}
    </div>
  );
};

NotificationDropdown.defaultProps = {
  currentLang: "en_CA",
  userObject: null,
  accessToken: "",
  closeAll: () => {}
};

NotificationDropdown.propTypes = {
  currentLang: PropTypes.string,
  userObject: PropTypes.shape({
    sub: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string
  }),
  accessToken: PropTypes.string,
  closeAll: PropTypes.func
};

export default NotificationDropdown;
/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";

import gql from "graphql-tag";
import { Query } from "react-apollo";
import { ApolloClient, InMemoryCache } from "apollo-boost";

import { split } from 'apollo-link'
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { getMainDefinition } from 'apollo-utilities'

import DesktopNotifications from "./DesktopNotifications";
import NotificationLoad from "./NotificationLoad";
import NotificationError from "./NotificationError";

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

const NEW_NOTIFICATION_SUBSCRIPTION = gql`
  subscription {
    newNotification {
      node {
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
  }
`

const NotificationDropdown = props => {
  const {
    userObject,
    accessToken,
    closeAll,
    currentLang,
    notificationURL
  } = props;

  let gcID = "";
  if (userObject) {
    gcID = userObject.sub;
  }

  // NaaS Connection
  const httpLink = createHttpLink({
    uri: notificationURL,
  })

  const authLink = setContext((_, { headers }) => {
    const token = accessToken
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    }
  })

  let wsNotificationURL = notificationURL.replace(/^https?\:\/\//i, "");

  const wsLink = new SubscriptionClient(`ws://${wsNotificationURL}`, {
    timeout: 30000,
    reconnect: false,
    lazy: true,
    connectionParams: {
      headers: {
        authorization: `Bearer ${accessToken}`,
      }
    }
  })

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    authLink.concat(httpLink)
  );

  const notificationClient = new ApolloClient({
    link,
    cache: new InMemoryCache()
  });

  // Subscriptions
  const _subscribeToNewNotifications = subscribeToMore => {
    subscribeToMore({
      document: NEW_NOTIFICATION_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newNotification = subscriptionData.data.newNotification.node
        console.log(prev.notifications);
        console.log(newNotification);
        const exists = prev.notifications.find(({ id }) => id === newNotification.id);
        if (exists) return prev;

        let test = Object.assign({}, prev, {
          data: {
            notifications: [newNotification, ...prev.notifications]
          }
        });

        console.log(test);

        return Object.assign({}, prev, {
          notifications: [newNotification, ...prev.notifications]
        });
      }
    })
  }

  //Set order
  const orderBy = "generatedOn_DESC";

  let U = [];
  let R = [];

  return (
    <div className="gn-inline">
      {userObject ? (
        <Query
          client={notificationClient}
          query={GET_NOTIFICATIONS}
          variables={{ orderBy }}
          onCompleted={data => {
            data.notifications.map(notif =>
              notif.online.viewed === false ? U.push(notif) : R.push(notif)
            );
          }}
        >
          {({ loading, error, data, subscribeToMore }) => {
            if (loading) return <NotificationLoad currentLang={currentLang} />;
            if (error) {
              console.log(error)
              return (
                <NotificationError
                  currentLang={currentLang}
                  closeAll={closeAll}
                />
              );
            }

            _subscribeToNewNotifications(subscribeToMore);

            return (
              <DesktopNotifications
                unread={U}
                read={R}
                data={data}
                READ_NOTIFICATION={READ_NOTIFICATION}
                notificationClient={notificationClient}
                currentLang={currentLang}
                closeAll={closeAll}
                subscribeToMore={subscribeToMore}
                NEW_NOTIFICATION_SUBSCRIPTION={NEW_NOTIFICATION_SUBSCRIPTION}
              />
            )
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
  closeAll: () => { },
  unreadNotification: [],
  readNotification: []
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

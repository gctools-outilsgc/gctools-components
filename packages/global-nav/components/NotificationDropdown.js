/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink 
} from 'apollo-boost';

import NotificationItem from './NotificationItem';
import MobileNotifications from './MobileNotifications';
import NotificationLoad from './NotificationLoad';
import NotificationError from './NotificationError';

const notificationClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://naas.beta.gccollab.ca/graphql'
  }),
  cache: new InMemoryCache()
});

const GET_NOTIFICATIONS = gql`
query notifications($gcID: String!){
  notifications(gcID:$gcID){
    id,
    actionLink,
    generatedOn,
    appID,
    online{
      titleEn,
      titleFr,
      viewed
    }
  }
}
`;

const READ_NOTIFICATION= gql`
  mutation UpdateNotification($id: ID!, $online: UpdateOnlineInput) {
    updateNotification(id: $id, online: $online) {
      id
      online {
        viewed
      }
    }
  }
`;

const NotificationDropdown = (props) => {
  const {
    userObject,
    accessToken,
    closeAll,
    currentLang,
    count,
    updateCount
  } = props;

  let gcID = '';
  if(userObject){
    gcID = userObject.sub;
  }

    return (
      <div>
         {userObject ? (

         <Query
            client={notificationClient}
            query={GET_NOTIFICATIONS}
            variables={{ gcID }}
            onCompleted={(data) => {
              let unreadCount = 0
              data.notifications.map(notif =>(
                (notif.online.viewed ? "" : unreadCount += 1)
              ))
              updateCount(unreadCount)
            }}
          >
            {({ loading, error, data }) => {
              if (loading)
                return (
                  <NotificationLoad
                    currentLang={currentLang}
                  />
                );
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
                      <UncontrolledDropdown direction="left">
                        <DropdownToggle className="gn-dd-btn d-flex">
                          <div className="align-self-center">
                            <FontAwesomeIcon icon={faBell} />
                          </div>
                          {count < 1 ? ("") :
                            <Badge color="danger" className="align-self-center gn-notification-badge">
                                {count}
                                <span className="sr-only">unread</span>
                            </Badge>
                          }
                          <div className="align-self-center pl-2">
                            Notifications
                          </div>
                        </DropdownToggle>
                        <DropdownMenu modifiers={{ computeStyle: { gpuAcceleration: false }}} className="gn-notif-menu">
                          <div className="gn-notif-container">
                            {Object.entries(data.notifications).length === 0 ? (
                              <DropdownItem >
                                No notifications available
                              </DropdownItem>
                            ): (
                              data.notifications.map(notif =>(
                                <Mutation
                                  key={notif.id}
                                  client={notificationClient}
                                  mutation={READ_NOTIFICATION}
                                >
                                  {(updateNotification) => (
                                    <NotificationItem
                                      notification={notif}
                                      currentLang={currentLang}
                                      readNotification={() => {
                                        updateNotification({ variables: { id: notif.id, online: { viewed: true } } });
                                      }}
                                    />
                                  )}
                                </Mutation>
                              ))
                            )}
                          </div>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </MediaQuery>
                    <MediaQuery query="(max-width: 768px)">
                      <MobileNotifications
                        currentLang={currentLang}
                        closeAll={closeAll}
                        data={data}
                        READ_NOTIFICATION={READ_NOTIFICATION}
                        client={notificationClient}
                        count={count}
                      />
                    </MediaQuery>
                  </div>
                 );
          }}
          </Query>
        ) : ''}
      </div>
    );
  };

  NotificationDropdown.defaultProps = {
    currentLang: 'en_CA',
    userObject: null,
    accessToken: '',
    closeAll: () => {}
  };

  NotificationDropdown.propTypes = {
    currentLang: PropTypes.string,
    userObject: PropTypes.shape({
      sub: PropTypes.string,
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
    accessToken: PropTypes.string,
    closeAll: PropTypes.func,
  };

export default NotificationDropdown;

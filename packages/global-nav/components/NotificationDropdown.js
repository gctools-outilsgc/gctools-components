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
import { Query } from 'react-apollo';
import MobileNotifications from './MobileNotifications';

const GET_NOTIFICATIONS = gql`
query notifications($gcID: String!){
  notifications(gcID:$gcID, actionLevel:"Featured"){
    id,
    online{
      titleEn,
      titleFr
    }
  }
}
`;
const NotificationDropdown = (props) => {
  const {
    userObject,
    accessToken,
    closeAll,
    currentLang
  } = props;
  const gcID = '';
  if(userObject){
    const gcID = userObject.sub;
  }

    return (
      <div>
         {userObject ? (

         <Query
            query={GET_NOTIFICATIONS}
            variables={{ gcID }}
          >
            {({ loading, error, data }) => {
              if (loading) return 'loading...';
              if (error) return `Error!: ${error}`;
                return (
                  <div className="query-maybe-it-might-get-mad">
                    <MediaQuery query="(min-device-width: 1224px)">
                      <UncontrolledDropdown direction="left">
                        <DropdownToggle className="gn-dd-btn d-flex">
                          <div className="align-self-center">
                            <FontAwesomeIcon icon={faBell} />
                          </div>
                          {Object.entries(data.notifications).length === 0 ? ( "" ) :
                            (<Badge color="danger" className="align-self-center gn-notification-badge">
                                {Object.entries(data.notifications).length} 
                                <span className="sr-only">unread</span>
                            </Badge>)
                          }
                          <div className="align-self-center pl-2">
                            Notifications
                          </div>
                        </DropdownToggle>
                        <DropdownMenu>
                          {Object.entries(data.notifications).length === 0 ? (
                            <DropdownItem >
                              notification
                            </DropdownItem>
                          ): (
                            data.notifications.map(notif =>(
                            <DropdownItem key={notif.id}>
                              {notif.online.titleEn}
                            </DropdownItem>
                            ))
                          )}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </MediaQuery>
                    <MediaQuery query="(max-device-width: 1224px)">
                      <MobileNotifications
                        currentLang={currentLang}
                        closeAll={closeAll}
                        data={data}
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



export default NotificationDropdown;

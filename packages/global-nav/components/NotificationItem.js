import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import {
    DropdownItem
  } from 'reactstrap';

const NotificationItem = (props) => {
    const {
        notification,
        currentLang,
        readNotification
    } = props;

    const time = parseInt(notification.generatedOn, 10)/1000;

    let copy = {}
    if(currentLang != "fr_CA"){
      copy = {
        "unread": "unread",
        "title": notification.online.titleEn
      }
    } else {
      copy = {
        "unread": "unread",
        "title": notification.online.titleFr
      }
    }

    return (
        <DropdownItem
            className="d-inline d-flex"
            href={
                (notification.actionLink ? notification.actionLink : "#")
            }
            onClick={() => 
                ( notification.online.viewed ? "" : readNotification() )
            }
        >
        {notification.online.viewed ? 
            <div className="gn-read align-self-center" />
        : 
            <div className="gn-unread align-self-center">
                <span className="sr-only">{copy.unread}</span>
            </div>
            }
            <div className="gn-applist-logo align-self-center d-flex" style={{ 'backgroundColor': '#754f8b' }} >
              {currentLang == "en_CA" ?
                <span aria-hidden="true" className="align-self-center">D</span>
              :
                <span aria-hidden="true" className="align-self-center">R</span>
              }
            </div>
            <div style={{"maxWidth": "250px"}} className="align-self-center ml-2">
                {copy.title}
                <p className="mb-0">
                    <small>
                        <Moment format="YYYY-MM-DD HH:mm" unix>
                            {time}
                        </Moment>
                    </small>
                </p>
            </div>
        </DropdownItem>
    );
};

NotificationItem.defaultProps = {
    currentLang: 'en_CA',
    notification: null
  };
  
  NotificationItem.propTypes = {
    currentLang: PropTypes.string,
    notification: PropTypes.shape({
      id: PropTypes.string,
      actionLink: PropTypes.string,
      generatedOn: PropTypes.string,
      appID: PropTypes.string,
      online: PropTypes.shape({
        titleEn: PropTypes.string,
        titleFr: PropTypes.string,
        viewed: PropTypes.bool,
      })
    }),
  };

export default NotificationItem;
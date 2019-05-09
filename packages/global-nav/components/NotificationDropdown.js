import React from 'react';
import PropTypes from 'prop-types';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const NotificationDropdown = (props) => {
  const {
    userObject,
    accessToken,
  } = props;
  //TODO query the notification COUNT on component render
  //TODO query the notification LIST on dropdown click
  //TODO map the DropdownItems based on that query
  //TODO mutate the notifications on dropdown click
  //TODO display something when all messages are read / deleted / it fetches nothing
  return (
    <div>
      {userObject ? (
        <div className="query-maybe-it-might-get-mad">
          <UncontrolledDropdown direction="left">
            <DropdownToggle className="gn-dd-btn d-flex">
              <div className="align-self-center">
                <FontAwesomeIcon icon={faBell} />
              </div>
              <div className="align-self-center pl-2">
                Notifications
              </div>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                {userObject.gcID}
              </DropdownItem>
              <DropdownItem>
                {accessToken}
              </DropdownItem>
              <DropdownItem>
                You've got Mail!
              </DropdownItem>
              <DropdownItem>
                You've got Mail!
              </DropdownItem>
              <DropdownItem>
                You've got Mail!
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      ) : ''}
    </div>
  );
};

NotificationDropdown.defaultProps = {
  userObject: null,
  accessToken: '',
};

NotificationDropdown.propTypes = {
  userObject: PropTypes.shape({
    gcID: PropTypes.string,
    name: PropTypes.string,
  }),
  accessToken: PropTypes.string,
};

export default NotificationDropdown;

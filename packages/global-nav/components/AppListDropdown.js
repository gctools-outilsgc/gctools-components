import React from 'react';
import PropTypes from 'prop-types';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import MediaQuery from 'react-responsive';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh } from '@fortawesome/free-solid-svg-icons';

const AppListDropdown = (props) => {
  const {
    currentApp,
  } = props;
  // Hardcoded array of apps
  const appList = [
    {
      'name':'GCmessage',
      'color': '#46246a',
      'id': '1',
      'logo': 'MS',
      'desc': 'Create and join chat rooms',
      'link': 'https://message.gccollab.ca',
    },
    {
      'name': 'GCcollab',
      'color': '#46246a',
      'id': '2',
      'logo': 'CO',
      'desc': 'Connect and Collaborate with anyone',
      'link': 'https://gccollab.ca',
    },
    {
      'name': 'GCwiki',
      'color': '#46246a',
      'id': '3',
      'logo': 'WI',
      'desc': 'Co-create and share information',
      'link': 'https://wiki.gccollab.ca/Main_Page',
    },
    {
      'name': 'GCcareers',
      'color': '#46246a',
      'id': '4',
      'logo': 'CA',
      'desc': 'Look at me!',
      'link': '!#',
    },
    {
      'name': 'GCsomething',
      'color': '#46246a',
      'id': '4',
      'logo': 'TA',
      'desc': 'Look at me!',
      'link': '!#',
    },
  ];

  //Map apps and Identify the app the user is currently on by App ID
  const listComponent = appList.map(a => (
    <DropdownItem key={a.id} className="d-flex" href={a.link}>
      {/*(a.id == currentApp.id) ? 'Current App': ''*/}
      <div className="gn-applist-logo align-self-center" style={{ 'backgroundColor': a.color }}>
        <span>{a.logo}</span>
      </div>
      <div className="align-self-center ml-2">
        <div className="h6 mb-0">
          {a.name}
        </div>
        <small className="text-muted">
          {a.desc}
        </small>
      </div>
    </DropdownItem>
  ));

  const mobileList = appList.map(a => (
    <a href={a.link} className="d-flex mb-2" key={`m-${a.id}`}>
      {/*(a.id == currentApp.id) ? 'Current App': ''*/}
      <div className="gn-applist-logo align-self-center" style={{ 'backgroundColor': a.color }}>
        <span>{a.logo}</span>
      </div>
      <div className="align-self-center ml-2">
        <div className="h6 mb-0">
          {a.name}
        </div>
        <small className="text-muted">
          {a.desc}
        </small>
      </div>
    </a>
  ));

  return (
    <div>
      <MediaQuery query="(min-width: 768px)">
        <UncontrolledDropdown direction="left">
          <DropdownToggle className="gn-dd-btn d-flex">
            <div className="align-self-center">
              <FontAwesomeIcon icon={faTh} />
            </div>
            <div className="align-self-center pl-2">
              Apps {currentApp.id}
            </div>
          </DropdownToggle>
          <DropdownMenu>
            {listComponent}
            <DropdownItem className="text-center bg-light" href="#">
              See All Apps
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <div>
          {mobileList}
        </div>
      </MediaQuery>
    </div>
  );
};

AppListDropdown.defaultProps = {
  currentApp: {
    id: '1',
  },
};

AppListDropdown.propTypes = {
  /** The current app object ID */
  currentApp: PropTypes.shape({
    id: PropTypes.string,
  }),
};

export default AppListDropdown;

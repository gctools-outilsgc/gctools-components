import React from 'react';
import PropTypes from 'prop-types';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import appWaffle from '../assets/app-waffle.gif';

const AppListDropdown = (props) => {
  const {
    currentApp,
  } = props;
  // Hardcoded array of apps
  const appList = [
    {
      'name':'Testing App',
      'color': 'red',
      'id': '1',
    },
    {
      'name': 'Another App',
      'color': 'blue',
      'id': '2',
    },
    {
      'name': 'A Third App',
      'color': 'green',
      'id': '3',
    },
  ];

  //Map apps and Identify the app the user is currently on by App ID
  const listComponent = appList.map(a => (
    <DropdownItem key={a.id}>
      {(a.id == currentApp.id) ? 'Current App': ''}
      <h5 style={{'color': a.color}}>
        {a.name}
      </h5>
    </DropdownItem>
  ));

  return (
    <UncontrolledDropdown direction="left">
      <DropdownToggle className="gn-dd-btn d-flex">
        <div className="align-self-center">
          <img src={appWaffle} alt="" />
        </div>
        <div className="align-self-center pl-2">
          Apps {currentApp.id}
        </div>
      </DropdownToggle>
      <DropdownMenu>
        {listComponent}
      </DropdownMenu>
    </UncontrolledDropdown>
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

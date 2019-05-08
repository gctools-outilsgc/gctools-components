import React from 'react';
import PropTypes from 'prop-types';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import helpIcon from '../assets/help-icon.gif';
//This currently contains fake hrefs as examples
const HelpDropdown = (props) => {
  const {
    currentApp,
    windowLocation,
  } = props;
  return (
    <UncontrolledDropdown direction="left">
      <DropdownToggle className="gn-dd-btn d-flex">
        <div className="align-self-center">
          <img src={helpIcon} alt="" />
        </div>
        <div className="align-self-center pl-2">
          Help
        </div>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem href={`somewhere.gccollab.ca/report?app=${currentApp.name}&url=${windowLocation}`}>
          Report a Bug
        </DropdownItem>
        <DropdownItem href={`somewhere.gccollab.ca/feedback?app=${currentApp.name}`}>
          Submit Feedback
        </DropdownItem>
        <DropdownItem>
          Account Issues
        </DropdownItem>
        <DropdownItem href={`somewhere.gccollab.ca/report?app=${currentApp.name}&url=${windowLocation}`}>
          Report Content
        </DropdownItem>
        <DropdownItem className="text-center bg-light" href="#">
          Take me to Help Portal
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

HelpDropdown.defaultProps = {
  currentApp: {
    name: 'Google',
    id: '1',
  },
  windowLocation: 'google.ca',
};

HelpDropdown.propTypes = {
  /** Current app object name and ID */
  currentApp: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }),
  /** The current URL of the page (might not be needed) */
  windowLocation: PropTypes.string,
};

export default HelpDropdown;

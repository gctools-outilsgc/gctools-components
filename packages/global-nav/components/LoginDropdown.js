import React from 'react';
import PropTypes from 'prop-types';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

const LoginDropdown = (props) => {
  const {
    userObject,
  } = props;

  return (
    <div>
      {userObject ? (
        <UncontrolledDropdown direction="left">
          <DropdownToggle caret>
            {userObject.avatar} / {userObject.name}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem>
              Profile {userObject.gcID}
            </DropdownItem>
            <DropdownItem>
              More Links
            </DropdownItem>
            <DropdownItem>
              More Links
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ) : (
        <div>Login</div>
      )}
    </div>
  );
};

LoginDropdown.defaultProps = {
  userObject: {},
};

LoginDropdown.propTypes = {
  userObject: PropTypes.shape({
    gcID: PropTypes.string,
    name: PropTypes.string,
    avatar: PropTypes.string,
  }),
};

export default LoginDropdown;

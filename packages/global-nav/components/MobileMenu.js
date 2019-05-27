import React from 'react';
import PropTypes from 'prop-types';

import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
  } from 'reactstrap';

import Canada from '../assets/wmms-spl.svg';
import MobileMenuSubModal from './MobileMenuSubModal';
import MobileLang from './MobileLang';
import MobileAppList from './MobileAppList';
import NotificationDropdown from './NotificationDropdown';

class MobileMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      closeAll: false
    };

    this.toggle = this.toggle.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
  };

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  toggleAll() {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: true
    });
  }

  render() {
    return (
      <div>
        <Button onClick={this.toggle} className="mobile-menu-btn">O</Button>
        <Modal wrapClassName="gn-modal" zIndex="99999" isOpen={this.state.modal} toggle={this.toggle} className="gn-mobile-menu">
          <ModalHeader toggle={this.toggle}>GCTools</ModalHeader>
          <ModalBody>
            <ul>
              <li><a href="#">Profile</a></li>
              <li><a href="#">Notifications</a></li>
              <li><a href="#">Apps</a></li>
              <li><a href="#">Language</a></li>
              <li><a href="#">Help</a></li>
            </ul>
            
            <MobileMenuSubModal closeAll={this.toggle} />
            <NotificationDropdown
              currentLang={this.props.currentLang}
              closeAll={this.toggle}
              userObject={this.props.userObject}
              accessToken={this.props.accessToken}
            />
            <MobileAppList />
            <MobileLang
              closeAll={this.toggle}
              onResultClick={(e) => {
                this.props.onLanguageResultClick(e);
              }}
            />

          </ModalBody>
          <ModalFooter>
            <img src={Canada} alt="Canada" className="float-right" />
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default MobileMenu;
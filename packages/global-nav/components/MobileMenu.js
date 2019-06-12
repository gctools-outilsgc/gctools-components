import React from 'react';
import PropTypes from 'prop-types';

import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Badge
  } from 'reactstrap';

import Canada from '../assets/wmms-spl.svg';
import MobileLang from './MobileLang';
import MobileAppList from './MobileAppList';
import NotificationDropdown from './NotificationDropdown';
// import LoginDropdown from './LoginDropdown';
import MobileLogin from './MobileLogin';
import MobileHelp from './MobileHelp';

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

    const notifBadge = this.props.count < 1 ? ( "" ) :
        (<Badge color="danger" className="align-self-center">
            {this.props.count}
            <span className="sr-only">unread notifications</span>
        </Badge>);

    return (
      <div>
        <Button onClick={this.toggle} className="mobile-menu-btn">O {notifBadge}</Button>
        <Modal wrapClassName="gn-modal" zIndex="99999" isOpen={this.state.modal} toggle={this.toggle} className="gn-mobile-menu">
          <ModalHeader toggle={this.toggle}>GCTools</ModalHeader>
          <ModalBody>
            <MobileLogin
              closeAll={this.toggle}
              userObject={this.props.userObject}
              oidcConfig={this.props.oidcConfig}
              doLogin={this.props.doLogin}
            />
            <NotificationDropdown
              currentLang={this.props.currentLang}
              closeAll={this.toggle}
              userObject={this.props.userObject}
              accessToken={this.props.accessToken}
              count={this.props.count}
              updateCount={this.props.updateCount}
            />
            <MobileAppList
              currentApp={this.props.currentApp}
              closeAll={this.toggle}
            />
            <MobileLang
              currentLang={this.props.currentLang}
              closeAll={this.toggle}
              onResultClick={(e) => {
                this.props.onLanguageResultClick(e);
              }}
            />
            <MobileHelp
              currentApp={this.props.currentApp}
              closeAll={this.toggle}
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
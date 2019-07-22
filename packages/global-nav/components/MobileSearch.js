import React from 'react';
import PropTypes from 'prop-types';

import {
  Modal,
  ModalHeader,
  ModalBody,
  Button
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

class MobileSearch extends React.Component {
  constructor() {
    super();
    this.state = {
      modal: false,
    };

    this.toggle = this.toggle.bind(this);
  };

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {

    const closeBtn = <button className="close" onClick={this.toggle}>&times;<span className="sr-only">Close</span></button>;

    return (
      <React.Fragment>
        <Button onClick={this.toggle} className="mobile-menu-btn" >
          <span className="sr-only">Search</span>
          <FontAwesomeIcon icon={faSearch} />
        </Button>
        <Modal wrapClassName="gn-modal" zIndex="999" isOpen={this.state.modal} toggle={this.toggle} className="gn-mobile-menu">
          <ModalHeader close={closeBtn} toggle={this.toggle}>Search</ModalHeader>
          <ModalBody>
            {this.props.searchComponent}  
          </ModalBody> 
        </Modal>
      </React.Fragment>
    );
  }
}

MobileSearch.deafultProps = {
  searchComponent: null,
};

MobileSearch.propTypes = {
  searchComponent: PropTypes.element,
};

export default MobileSearch;

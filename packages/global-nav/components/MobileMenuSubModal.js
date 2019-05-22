import React from 'react';
import PropTypes from 'prop-types';

import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
  } from 'reactstrap';

/**
 * Example of how to dothe nested modal for each menu item.
 */

class MobileMenuSubModal extends React.Component {
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
        return (
            <div>
                <Button color="success" onClick={this.toggle}>Show Nested Modal</Button>
                <Modal 
                    className="gn-mobile-menu" 
                    zIndex="99999" 
                    isOpen={this.state.modal} 
                    toggle={this.toggle} 
                >
                    <ModalHeader toggle={this.props.closeAll}>Nested Modal title</ModalHeader>
                    <ModalBody>Stuff and things</ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle}>Done</Button>{' '}
                        <Button color="secondary" onClick={this.props.closeAll}>All Done</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default MobileMenuSubModal;
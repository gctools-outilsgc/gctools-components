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
          hideHeader: false,
        };
    
        this.toggle = this.toggle.bind(this);
        this.closeEverything = this.closeEverything.bind(this);
    };

    toggle() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
      }

    closeEverything() {
        this.toggle();
        this.props.closeAll();
        this.setState(prevState => ({
            hideHeader: !prevState.hideHeader
          }));
    }

    render() {

        const hideHeaderClass = (this.state.hideHeader ? "gn-header-move" : "");

        return (
            <div>
                <Button color="success" onClick={this.toggle}>Show Nested Modal</Button>
                <Modal 
                    className="gn-mobile-menu" 
                    zIndex="99999" 
                    isOpen={this.state.modal} 
                    toggle={this.toggle}
                    wrapClassName="gn-sub-modal"
                    backdrop={false}
                >
                    <ModalHeader className={hideHeaderClass} toggle={this.closeEverything}>GCTools</ModalHeader>
                    <ModalBody>Stuff and things</ModalBody>
                    <ModalFooter>
                        <Button size="sm" color="primary" onClick={this.toggle}>Done</Button>{' '}
                        <Button size="sm" color="secondary" onClick={this.closeEverything} >All Done</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default MobileMenuSubModal;
import React from 'react';
import PropTypes from 'prop-types';

import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
  } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh } from '@fortawesome/free-solid-svg-icons';

import AppListDropdown from './AppListDropdown';  
/**
 * Example of how to dothe nested modal for each menu item.
 */

class MobileAppList extends React.Component {
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
      const {
        currentApp,
      } = this.props;

        return (
            <div>
                <Button className="d-flex gn-dd-btn" onClick={this.toggle}>
                  <FontAwesomeIcon icon={faTh} />
                  Apps
                </Button>
                <Modal 
                    className="gn-mobile-menu" 
                    zIndex="99999" 
                    isOpen={this.state.modal} 
                    toggle={this.toggle}
                    wrapClassName="gn-sub-modal"
                    backdrop={false}
                >
                    <ModalHeader toggle={this.props.closeAll}>Nested Modal title</ModalHeader>
                    <div>
                      <Button className="d-flex gn-dd-btn gn-mobile-back-btn" onClick={this.toggle}>
                        Apps
                      </Button>
                    </div>
                    <ModalBody>
                      <AppListDropdown currentApp={currentApp} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle}>Done</Button>{' '}
                        <Button color="secondary" onClick={this.props.closeAll}>All Done</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

MobileAppList.defaultProps = {
  currentApp: {
    id: '1',
  },
};

MobileAppList.propTypes = {
  /** The current app object ID */
  currentApp: PropTypes.shape({
    id: PropTypes.string,
  }),
};


export default MobileAppList;

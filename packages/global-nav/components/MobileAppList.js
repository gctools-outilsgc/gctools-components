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
      const {
        currentApp,
      } = this.props;

      const hideHeaderClass = (this.state.hideHeader ? "gn-header-move" : "");

        return (
            <div>
                <Button className="d-flex gn-dd-btn" onClick={this.toggle}>
                  <div className="align-self-center">
                    <FontAwesomeIcon icon={faTh} />
                  </div>
                  <div className="align-self-center pl-2">
                    Apps
                  </div>
                </Button>
                <Modal 
                    className="gn-mobile-menu" 
                    zIndex="99999" 
                    isOpen={this.state.modal} 
                    toggle={this.toggle}
                    wrapClassName="gn-sub-modal"
                    backdrop={false}
                >
                    <ModalHeader
                        className={hideHeaderClass} 
                        toggle={this.closeEverything}
                    >
                      Apps
                    </ModalHeader>
                    <div className="d-flex gn-dd-btn gn-mobile-back-btn">
                      <div className="align-self-center" >
                        <Button
                            onClick={this.toggle}
                            aria-label="Return"
                        >
                          <span className="gn-chevron-arrow-left"></span>
                        </Button>
                      </div>
                      <div className="align-self-center">
                        <FontAwesomeIcon icon={faTh} />
                      </div>
                      <div className="align-self-center pl-2">
                        Apps
                      </div>
                    </div>
                    <ModalBody>
                      <AppListDropdown currentApp={currentApp} />
                    </ModalBody>
                    <ModalFooter>
                      <Button size="sm" color="secondary" onClick={this.toggle} >Close</Button>
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

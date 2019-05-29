/* eslint-disable */ 
import React from 'react'; import PropTypes from 
'prop-types'; import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
  } from 'reactstrap';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faQuestionCircle, faPen, faCommentAlt, faFlag } from '@fortawesome/free-solid-svg-icons';
  import accountissue from '../assets/account-issue.svg';

 class MobileHelp extends React.Component {
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
        onResultClick,
      } = this.props;

      const hideHeaderClass = (this.state.hideHeader ? "gn-header-move" : "");
    
        return (
            <div>
                <Button className="d-flex gn-dd-btn" onClick={this.toggle}>
                  <div className="align-self-center">
                  <FontAwesomeIcon icon={faQuestionCircle} />
                  </div>
                  <div className="align-self-center pl-2">
                  Help
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
                      Help
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
                    <FontAwesomeIcon icon={faQuestionCircle} />
                    </div>
                    <div className="align-self-center pl-2">
                      Help
                    </div>
                  </div>
                    <ModalBody>
                      <div className="d-flex help-section">
                        <Button className="gn-grid-btn help-button" onClick={() => {
                          onResultClick();
                        }}>
                          <div>
                            <div>
                             
                            </div>
                            <FontAwesomeIcon icon={faPen} />
                            <div>Report a bug</div>
                          </div>
                        </Button>
                        <Button className="gn-grid-btn help-button" onClick={() => {
                          onResultClick();
                        }}>
                          <div>
                            <div>
                              
                            </div>
                            <FontAwesomeIcon icon={faCommentAlt} />
                            <div>Submit Feedback</div>
                          </div>
                        </Button>
                        <Button className="gn-grid-btn help-button" onClick={() => {
                          onResultClick();
                        }}>
                          <div>
                            <div>
                              
                            </div>
                            <img src={accountissue} alt="" className="lang-icon" />
                            <div>Account Issues</div>
                          </div>
                        </Button>
                        <Button className="gn-grid-btn help-button" onClick={() => {
                          onResultClick();
                        }}>
                          <div>
                            <div>
                              
                            </div>
                            <FontAwesomeIcon icon={faFlag} />
                            <div>Report Content</div>
                          </div>
                        </Button>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button size="sm" color="secondary" onClick={this.toggle} >Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
MobileHelp.defaultProps = {
  currentLang: 'en_CA',
  onResultClick: () => {},
};
MobileHelp.propTypes = {
  /** Gets the value of the option clicked */
  onResultClick: PropTypes.func,
};
export default MobileHelp;

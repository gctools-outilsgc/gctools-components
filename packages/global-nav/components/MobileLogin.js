import React from 'react'; import PropTypes from 'prop-types'; 
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Badge
  } from 'reactstrap';
import Login from '@gctools-components/gc-login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faUserCircle, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; 

class MobileLogin extends React.Component {
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
                <Button className="gn-dd-btn d-flex" onClick={this.toggle}>
                {this.props.userObject ? ( 
                  <div>
                  <div className="align-self-center">
                  <img
                      className="gn-avatar"
                      src={this.props.userObject.picture}
                      alt=""
                  />  
                                         
                  </div>
                  <div className="align-self-center pl-2">
                  {this.props.userObject.name}
                  </div>
                  </div>
                 ) : ( 
                   <div>
                  <div className="align-self-center">  
                    <FontAwesomeIcon icon={faSignInAlt} />  
                  </div>
                  <div className="align-self-center pl-2">
                      Sign in
                  </div> 
                  </div>
                  )} 
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
                        GCTools
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
                       
                        {this.props.userObject ? ( 
                        <div>
                        <div className="align-self-center">
                        <img
                            className="gn-avatar"
                            src={this.props.userObject.picture}
                            alt=""
                        />  
                                               
                        </div>
                        <div className="align-self-center pl-2">
                        {this.props.userObject.name}
                        </div>
                        </div>
                       ) : ( 
                         <div>
                        <div className="align-self-center">  
                          <FontAwesomeIcon icon={faUserCircle} />  
                        </div>
                        <div className="align-self-center pl-2">
                            Profile
                        </div> 
                        </div>
                        )} 
                    </div>
                    <ModalBody>
                    {this.props.userObject ? (
                    <div className="d-flex help-section">
                    <Button className="gn-grid-btn help-button" href={`https://profile.gccollab.ca/p/${this.props.userObject.sub}`}>
                      <div>
                        <div>
                        
                        </div>
                        <FontAwesomeIcon icon={faUserCircle} />
                        <div>My profile</div>
                      </div>
                    </Button>
                    <Button className="gn-grid-btn help-button" onClick={() => {
                      onResultClick();
                    }}>
                      <div>
                        <div>
                          
                        </div>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <div>Sign out</div>
                      </div>
                    </Button>
                  </div>
                  ) : (
                    <div>
                      <Login
                        oidcConfig={this.props.oidcConfig}
                        onUserLoaded={this.props.doLogin}
                        onUserFetched={this.props.doLogin}
                      >
                        {({ onClick }) => (
                          <Button
                            className="gn-dd-btn d-flex"
                            onClick={(e) => {
                              e.stopPropagation();
                              onClick(e);
                            }}
                          >
                            <div className="align-self-center">
                              <FontAwesomeIcon icon={faSignInAlt} />
                            </div>
                            <div className="align-self-center pl-2">
                              Login
                            </div>
                          </Button>
                        )}
                      </Login>
                    </div>
                  )}
                    </ModalBody>
                    <ModalFooter>
                        <Button size="sm" color="primary" onClick={this.toggle}>Done</Button>{' '}
                        <Button size="sm" color="secondary" onClick={this.closeEverything} >All Done</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
export default MobileLogin;


import React from 'react';
import PropTypes from 'prop-types';

import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
  } from 'reactstrap';

import langEn from '../assets/enIcon.svg';
import langFr from '../assets/frIcon.svg';

/**
 * Example of how to dothe nested modal for each menu item.
 */

class MobileLang extends React.Component {
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
        currentLang,
        onResultClick,
      } = this.props;
      
      const hideHeaderClass = (this.state.hideHeader ? "gn-header-move" : "");
      const langIcon = (currentLang === 'en_CA' ? langEn : langFr );

        let copy = {}
        if(this.props.currentLang == "en_CA"){
            copy = {
              "change":"Change language",
              "return": "Return to main menu",
              "closenav": "Close GCTools navigation",
            }
        } else {
            copy = {
              "change":"Changer la langue",
              "return": "Retour au menu principal",
              "closenav": "Fermer la navigation dans OutilsGC",
            }
        }

        const closeBtn = <button className="close" onClick={this.closeEverything}>&times;<span className="sr-only">{copy.closenav}</span></button>;

        return (
            <div className="d-inline-block">
                <Button className="gn-grid-btn" onClick={this.toggle}>
                  <div className="btn-align">
                    <img src={langIcon} alt="" className="lang-icon" />
                    <div>
                      {(currentLang == 'en_CA') ? 'English' : 'Français'}
                    </div>
                  </div>
                </Button>
                <Modal 
                    className="gn-mobile-menu" 
                    zIndex="999" 
                    isOpen={this.state.modal} 
                    toggle={this.toggle}
                    wrapClassName="gn-sub-modal"
                    backdrop={false}
                >
                    <ModalHeader
                        className={hideHeaderClass}
                        close={closeBtn}
                        toggle={this.closeEverything}
                    >
                      {copy.change}
                    </ModalHeader>
                    <div className="d-flex gn-dd-btn gn-mobile-back-btn">
                      <div className="align-self-center" >
                        <Button
                            onClick={this.toggle}
                            aria-label="Return"
                        >
                          <span className="gn-chevron-arrow-left"></span>
                          <span className="sr-only">{copy.return}</span>
                        </Button>
                      </div>
                      <div className="align-self-center">
                        <img src={langIcon} alt="" className="lang-icon" />
                      </div>
                      <div className="align-self-center pl-2">
                        {(currentLang == 'en_CA') ? 'English' : 'Français'}
                      </div>
                    </div>
                    <ModalBody>
                      <div className="d-flex">
                        <Button className="gn-grid-btn" onClick={() => {
                          onResultClick('en_CA');
                          this.toggle();
                        }}>
                          <div className="btn-align">
                            <div>
                              <img src={langEn} alt="" className="lang-icon" />
                            </div>
                            <div lang="en">English</div>
                          </div>
                        </Button>
                        <Button className="gn-grid-btn" onClick={() => {
                          onResultClick('fr_CA');
                          this.toggle();
                        }}>
                          <div className="btn-align">
                            <div>
                              <img src={langFr} alt="" className="lang-icon" />
                            </div>
                            <div lang="fr">Français</div>
                          </div>
                        </Button>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button size="sm" color="secondary" onClick={this.toggle} >{copy.return}</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

MobileLang.defaultProps = {
  currentLang: 'en_CA',
  onResultClick: () => {},
};

MobileLang.propTypes = {
  /** Gets the current language of the application */
  currentLang: PropTypes.string,
  /** Gets the value of the option clicked */
  onResultClick: PropTypes.func,
};


export default MobileLang;

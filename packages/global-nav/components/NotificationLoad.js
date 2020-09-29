import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

class NotificationLoad extends React.Component {
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

        let copy = {}
        if (this.props.currentLang == "en_CA") {
            copy = {
                "loading": "loading"
            }
        } else {
            copy = {
                "loading": "chargement"
            }
        }

        return (
            <div>
                <MediaQuery query="(min-width: 769px)">
                    <div className="gn-dd-btn d-flex">
                        <div className="align-self-center">
                            <FontAwesomeIcon icon={faSpinner} spin />
                            <span className="sr-only">{copy.loading}</span>
                        </div>
                        <div className="align-self-center pl-2">
                            Notifications
                        </div>
                    </div>
                </MediaQuery>

                <MediaQuery query="(max-width: 768px)">
                    <button className="gn-grid-btn btn btn-secondary">
                        <div className="btn-align">
                            <FontAwesomeIcon icon={faSpinner} spin />
                            <span className="sr-only">{copy.loading}</span>
                            <div>
                                Notifications
                                </div>
                        </div>
                    </button>
                </MediaQuery>
            </div>
        );
    }
}

NotificationLoad.defaultProps = {
    currentLang: 'en_CA',
};

NotificationLoad.propTypes = {
    currentLang: PropTypes.string
};

export default NotificationLoad;
import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

import { Button, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";

const NotificationItem = props => {
  const { notification, currentLang, updateNotification, mobile } = props;

  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);
  const closeModal = () => {
    if (notification.online.viewed === false) updateNotification();
  };

  const time = parseInt(notification.generatedOn, 10) / 1000;

  let copy = {};
  if (currentLang != "fr_CA") {
    copy = {
      unread: "unread",
      title: notification.online.titleEn,
      body: notification.online.descriptionEn,
      return: "Return to notifications",
      seemore: "See more"
    };
  } else {
    copy = {
      unread: "unread",
      title: notification.online.titleFr,
      body: notification.online.descriptionFr,
      return: "Return to notifications",
      seemore: "Voir plus"
    };
  }

  const closeBtn = (
    <button className="close" onClick={toggleModal}>
      &times;<span className="sr-only">close</span>
    </button>
  );

  let modalClass = "sub-notif-modal";
  if (mobile) {
    modalClass = "gn-mobile-menu";
  }

  return (
    <li>
      <Button
        block
        onClick={toggleModal}
        className="d-inline d-flex gn-notif-btn-item"
      >
        {notification.online.viewed ? (
          <div className="gn-read align-self-center" />
        ) : (
            <div className="gn-unread align-self-center">
              <span className="sr-only">{copy.unread}</span>
            </div>
          )}
        <div
          className="gn-applist-logo align-self-center d-flex"
          style={{ backgroundColor: "#754f8b" }}
        >
          {currentLang == "en_CA" ? (
            <span aria-hidden="true" className="align-self-center">
              D
            </span>
          ) : (
              <span aria-hidden="true" className="align-self-center">
                R
              </span>
            )}
        </div>
        <div style={{ maxWidth: "375px" }} className="align-self-center ml-2">
          <p className="mb-0" style={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden"
          }}>{copy.title}</p>
          <p className="mb-0">
            <small>
              <Moment format="YYYY-MM-DD HH:mm" unix>
                {time}
              </Moment>
            </small>
          </p>
        </div>
      </Button>
      <Modal
        className={modalClass}
        zIndex="99999"
        isOpen={modal}
        toggle={toggleModal}
        wrapClassName="gn-sub-notif-modal"
        backdrop={true}
        onClosed={closeModal}
      >
        <ModalHeader close={closeBtn}>{copy.title}</ModalHeader>
        <ModalBody>
          <p className="mb-1">
            <small>
              <Moment format="YYYY-MM-DD HH:mm" unix>
                {time}
              </Moment>
            </small>
          </p>
          {copy.body}
          {notification.actionLink ? (
            <div className="text-center mt-3">
              <a href={notification.actionLink} className="btn btn-primary">
                {copy.seemore}
              </a>
            </div>
          ) : (
              ""
            )}
        </ModalBody>
        <ModalFooter>
          <Button size="sm" color="secondary" onClick={toggleModal}>
            {copy.return}
          </Button>
        </ModalFooter>
      </Modal>
    </li>
  );
};

NotificationItem.defaultProps = {
  currentLang: "en_CA",
  notification: null
};

NotificationItem.propTypes = {
  currentLang: PropTypes.string,
  notification: PropTypes.shape({
    id: PropTypes.string,
    actionLink: PropTypes.string,
    generatedOn: PropTypes.string,
    appID: PropTypes.string,
    online: PropTypes.shape({
      titleEn: PropTypes.string,
      titleFr: PropTypes.string,
      descriptionEn: PropTypes.string,
      descriptionFr: PropTypes.string,
      viewed: PropTypes.bool
    })
  })
};

export default NotificationItem;

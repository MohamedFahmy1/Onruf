import { Modal } from "react-bootstrap"
import React from "react"
import t from "../../translations.json"
import { pathOr } from "ramda"
import { useRouter } from "next/router"

const SendNotificationModal = ({ setOpenNotificationModal, openNotificationModal }) => {
  const { locale } = useRouter()
  return (
    <Modal show={openNotificationModal} onHide={() => setOpenNotificationModal(false)} className="my-5">
      <Modal.Header>
        <h5 className="modal-title m-0 f-b" id="staticBackdropLabel">
          {pathOr("", [locale, "Users", "sendNotfi"], t)}
        </h5>
        <button type="button" className="btn-close" onClick={() => setOpenNotificationModal(false)}></button>
      </Modal.Header>
      <Modal.Body>
        <ul className="form-group">
          <h6 className="fs-4 f-b">{pathOr("", [locale, "Users", "sendingMethod"], t)}</h6>
          <li className="item">
            <div className="gray-color">
              <button type="button" className="btn border mx-2">
                SMS
              </button>
              <button type="button" className="btn border mx-2">
                Whatsapp
              </button>
              <button type="button" className="btn border mx-2">
                App
              </button>
            </div>
          </li>
        </ul>
        <div className="form-group">
          <h6 className="fs-4 f-b">{pathOr("", [locale, "Users", "notificationMessage"], t)}</h6>
          <input type="text" className="form-control" />
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <button type="button" className="btn-main">
          {pathOr("", [locale, "Users", "sendNotfi"], t)}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default SendNotificationModal

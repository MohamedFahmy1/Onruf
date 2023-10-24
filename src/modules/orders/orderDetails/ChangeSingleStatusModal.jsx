import { Row, Col, Modal } from "react-bootstrap"
import React, { useState } from "react"
import t from "../../../translations.json"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import axios from "axios"

const ChangeStatusModal = ({ openModal, setOpenModal, selectedOrder }) => {
  const { locale } = useRouter()
  const changeOrderStatus = async (statusId) => {
    if (selectedOrder) {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/ChangeOrderStatus?orderId=${selectedOrder?.orderId}&status=${statusId}`,
        )
        toast.success(locale === "en" ? "Order Status Updated Successfully!" : "!تم تغيير حالة المنتج بنجاح")
        setOpenModal(false)
      } catch (error) {
        toast.error(error.response.data.message)
      }
    }
  }
  return (
    <Modal show={openModal} onHide={() => setOpenModal(false)} className="mt-5">
      <Modal.Header>
        <h5 className="modal-title f-b main-color text-center" id="staticBackdropLabel">
          {pathOr("", [locale, "Orders", "changeOrderStatus"], t)}
        </h5>
        <button type="button" className="btn-close" onClick={() => setOpenModal(false)} />
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={12}>
            <div className="mb-2 text-center">
              <button
                className={`fs-5 f-b ${selectedOrder?.orderStatus == 1 ? `main-color` : ``}`}
                onClick={() => changeOrderStatus(1)}
              >
                {pathOr("", [locale, "Orders", "waiting_for_payment"], t)}
              </button>
            </div>
          </Col>
          <Col md={12}>
            <div className="mb-2 text-center">
              <button
                className={`fs-5 f-b ${selectedOrder?.orderStatus == 2 ? `main-color` : ``}`}
                onClick={() => changeOrderStatus(2)}
              >
                {pathOr("", [locale, "Orders", "waiting_for_review"], t)}
              </button>
            </div>
          </Col>
          <Col md={12}>
            <div className="mb-2 text-center">
              <button
                className={`fs-5 f-b ${selectedOrder?.orderStatus == 3 ? `main-color` : ``}`}
                onClick={() => changeOrderStatus(3)}
              >
                {pathOr("", [locale, "Orders", "in_progress"], t)}
              </button>
            </div>
          </Col>
          <Col md={12}>
            <div className="mb-2 text-center">
              <button
                className={`fs-5 f-b ${selectedOrder?.orderStatus == 4 ? `main-color` : ``}`}
                onClick={() => changeOrderStatus(4)}
              >
                {pathOr("", [locale, "Orders", "ready_for_delivery"], t)}
              </button>
            </div>
          </Col>
          <Col md={12}>
            <div className="mb-2 text-center">
              <button
                className={`fs-5 f-b ${selectedOrder?.orderStatus == 5 ? `main-color` : ``}`}
                onClick={() => changeOrderStatus(5)}
              >
                {pathOr("", [locale, "Orders", "delivery_in_progress"], t)}
              </button>
            </div>
          </Col>
          <Col md={12}>
            <div className="mb-2 text-center">
              <button
                className={`fs-5 f-b ${selectedOrder?.orderStatus == 6 ? `main-color` : ``}`}
                onClick={() => changeOrderStatus(6)}
              >
                {pathOr("", [locale, "Orders", "delivered"], t)}
              </button>
            </div>
          </Col>
          <Col md={12}>
            <div className="mb-2 text-center">
              <button
                className={`fs-5 f-b ${selectedOrder?.orderStatus == 7 ? `main-color` : ``}`}
                onClick={() => changeOrderStatus(7)}
              >
                {pathOr("", [locale, "Orders", "canceled"], t)}
              </button>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default ChangeStatusModal

import axios from "axios"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { Row, Col } from "react-bootstrap"
import Modal from "react-bootstrap/Modal"
import { formatDate } from "../../../common/functions"

import { pathOr } from "ramda"
import t from "../../../translations.json"

const Comment = ({ id, rate, comment, productName, userName, image, createdAt }) => {
  const [openReplyModal, setOpenReplyModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const { locale, push } = useRouter()

  // Handle Delete a review
  const handleDeleteReview = async (id) => {
    const result = await axios.delete(process.env.REACT_APP_API_URL + "/RemoveRateProduct", {
      params: {
        id,
      },
    })
    push({ pathname: "/reviews", query: { tab: "reviews" } })
  }

  // Handle Share a review
  const handleShareReview = async (id) => {
    const result = await axios.post(
      process.env.REACT_APP_API_URL + "/ShareRate",
      {},
      {
        params: {
          id,
        },
      },
    )
  }

  // Handle Edit a review
  const handleEditReview = async (comment, rate) => {
    const result = await axios.put(process.env.REACT_APP_API_URL + "/EditRateProduct", { comment, rate, id })
    setOpenEditModal(false)
    push({ pathname: "/reviews", query: { tab: "reviews" } })
  }

  return (
    <>
      <div className="contint_paner box-Rev-Que">
        <div className="title_">
          <div className="d-flex align-items-center gap-2">
            <div className="font-11">
              <div>{pathOr("", [locale, "questionsAndReviews", "ad"], t)}</div>
              <div className="f-b">{productName}</div>
            </div>
            <div className="num">
              {pathOr("", [locale, "questionsAndReviews", "reqNumber"], t)} #{id}
            </div>
          </div>
          <div>{formatDate(createdAt)}</div>
        </div>
        <div className="px-4 py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center gap-2">
              <img src={image} className="img_user" />
              <div className="f-b">
                <h6 className="m-0 f-b">{userName}</h6>
                <div className="gray-color">{comment}</div>
              </div>
            </div>
            <div className="imogy">
              <span>{rate}</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => setOpenReplyModal((prev) => !prev)}
              className="btn-main"
              data-bs-toggle="modal"
              data-bs-target="#send_review"
            >
              {pathOr("", [locale, "questionsAndReviews", "reply"], t)}
            </button>
            <button
              onClick={() => setOpenEditModal((prev) => !prev)}
              className="btn-main"
              data-bs-toggle="modal"
              data-bs-target="#edit_review"
            >
              {pathOr("", [locale, "questionsAndReviews", "edit"], t)}
            </button>
            <button className="btn-main" onClick={() => handleDeleteReview(id)}>
              {pathOr("", [locale, "questionsAndReviews", "delete"], t)}{" "}
            </button>
            <div className="form-check form-switch p-0 m-0">
              <input
                onChange={() => handleShareReview(id)}
                className="form-check-input m-0"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckChecked"
              />
              <span className="mx-1"> {pathOr("", [locale, "questionsAndReviews", "share"], t)}</span>
            </div>
          </div>
        </div>
        <ReplyModal
          openModal={openReplyModal}
          setOpenModal={setOpenReplyModal}
          rate={rate}
          comment={comment}
          userName={userName}
          image={image}
        />
        <EditModal
          openModal={openEditModal}
          setOpenModal={setOpenEditModal}
          rate={rate}
          comment={comment}
          userName={userName}
          image={image}
          id={id}
          handleEditReview={handleEditReview}
        />
      </div>
    </>
  )
}

const EditModal = ({ openModal, setOpenModal, userName, comment, rate, image, handleEditReview }) => {
  const [commentEdit, setComment] = useState(comment)
  const [rateEdit, setRate] = useState(rate)

  return (
    <Modal show={openModal} onHide={() => setOpenModal(false)}>
      <div className="modal-dialog modal-dialog-centered modal-lg" style={{ width: "100%" }}>
        <div className="modal-content">
          <Modal.Header>
            <h5 className="modal-title m-0 f-b" id="staticBackdropLabel">
              Edit Review
            </h5>
            <button
              onClick={() => setOpenModal(false)}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </Modal.Header>
          <Modal.Body className="d-flex align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <img src="../core/imgs/user.png" className="img_user" />
              <div className="f-b">
                <h6 className="m-0 f-b">{userName}</h6>
              </div>
            </div>
            <div className="imogy">
              <input
                value={rateEdit}
                onChange={(e) => setRate(e.target.value)}
                type="number"
                style={{ border: "0", maxWidth: "48px" }}
              />
              <img src={image} />
            </div>
          </Modal.Body>
          <hr />
          <div className="form-group">
            <label>اكتب ردك</label>
            <input
              value={commentEdit}
              onChange={(e) => setComment(e.target.value)}
              type="text"
              className="form-control"
              placeholder="اكتب ردك"
            />
          </div>

          <Row>
            <Col>
              <button
                onClick={() => handleEditReview(commentEdit, rateEdit)}
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
                className="btn-main w-100"
              >
                حفظ
              </button>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  )
}

const ReplyModal = ({ openModal, setOpenModal, comment, userName, rate, image }) => {
  return (
    <Modal show={openModal} onHide={() => setOpenModal(false)}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <Modal.Header>
            <h5 className="modal-title m-0 f-b" id="staticBackdropLabel">
              الرد علي التقييم
            </h5>
            <button
              onClick={() => setOpenModal(false)}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </Modal.Header>
          <Modal.Body className="d-flex align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <img src="../core/imgs/user.png" className="img_user" />
              <div className="f-b">
                <h6 className="m-0 f-b">{userName}</h6>
                <div className="gray-color">{comment}</div>
              </div>
            </div>
            <div className="imogy">
              <span>{rate}</span>
              <img src={image} />
            </div>
          </Modal.Body>
          <hr />
          <div className="form-group">
            <label>اكتب ردك</label>
            <input type="text" className="form-control" placeholder="اكتب ردك" />
          </div>

          <Row>
            <Col>
              <button type="button" data-bs-dismiss="modal" aria-label="Close" className="btn-main w-100">
                ارسال الرد
              </button>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  )
}

export default Comment

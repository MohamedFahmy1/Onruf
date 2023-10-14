import axios from "axios"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { Row, Col } from "react-bootstrap"
import Modal from "react-bootstrap/Modal"
import { headers, headersJson } from "../../../../token"
import { formatDate } from "../../../common/functions"
import { pathOr } from "ramda"
import t from "../../../translations.json"

const Question = ({ id, question, isActive, productName, clientName, image, createdAt }) => {
  const [openReplyModal, setOpenReplyModal] = useState(false)
  const { locale, push } = useRouter()

  // Handle Share a review
  const handleShareQuestion = async (id) => {
    const result = await axios.patch(
      process.env.REACT_APP_API_URL + "/ChangeQuestionStatus",
      { id },
      {
        ...headers,
      },
    )
    push({ pathname: "/reviews", query: { tab: "questions" } })
  }

  // Handle Edit a review
  const handleAnswerQuestion = async (answer) => {
    const result = await axios.post(process.env.REACT_APP_API_URL + "/ReplyQuestion", { answer, id }, headers)
    setOpenReplyModal(false)
    push({
      pathname: "/reviews",
      query: {
        tab: "questions",
      },
    })
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
                <h6 className="m-0 f-b">{clientName}</h6>
                <div className="gray-color">{question}</div>
              </div>
            </div>
            <div className="imogy">
              {/* <span>{rate}</span> */}
              {/* <img src={image} /> */}
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

            <div className="form-check form-switch p-0 m-0">
              <input
                onChange={() => handleShareQuestion(id)}
                checked={isActive}
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
          handleAnswerQuestion={handleAnswerQuestion}
          clientName={clientName}
          question={question}
        />
      </div>
    </>
  )
}

const ReplyModal = ({ openModal, setOpenModal, clientName, question, handleAnswerQuestion }) => {
  const [answer, setAnswer] = useState("")
  return (
    <Modal show={openModal} onHide={() => setOpenModal(false)}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <Modal.Header>
            <h5 className="modal-title m-0 f-b" id="staticBackdropLabel">
              الرد علي السؤال
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </Modal.Header>
          <Modal.Body className="d-flex align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <img src="../core/imgs/user.png" className="img_user" />
              <div className="f-b">
                <h6 className="m-0 f-b">{clientName}</h6>
                <div className="gray-color">{question}</div>
              </div>
            </div>
            <div className="imogy">
              {/* <span>{rate}</span> */}
              {/* <img src={image} /> */}
            </div>
          </Modal.Body>
          <hr />
          <div className="form-group">
            <label>اكتب ردك</label>
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              type="text"
              className="form-control"
              placeholder="اكتب ردك"
            />
          </div>

          <Row>
            <Col>
              <button
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
                className="btn-main w-100"
                onClick={() => handleAnswerQuestion(answer)}
              >
                ارسال الرد
              </button>
            </Col>
            <Col>
              <button type="button" data-bs-dismiss="modal" aria-label="Close" className="btn-main btn-main-B w-100">
                الغاء
              </button>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  )
}

export default Question

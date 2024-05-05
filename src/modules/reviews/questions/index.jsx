import axios from "axios"
import { useRouter } from "next/router"
import { Fragment, useState } from "react"
import { Row, Col } from "react-bootstrap"
import Modal from "react-bootstrap/Modal"
import { formatDate } from "../../../common/functions"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import Image from "next/image"
import { toast } from "react-toastify"
import { multiFormData } from "../../../common/axiosHeaders"

const Question = ({ id, question, isShared, productName, clientName, clientImage, createdAt }) => {
  const [openReplyModal, setOpenReplyModal] = useState(false)
  const { locale, push } = useRouter()

  // Handle Share a review
  // const handleShareQuestion = async (id) => {
  //   const result = await axios.patch( "/ChangeQuestionStatus", { id })
  //   push({ pathname: "/reviews", query: { tab: "questions" } })
  // }

  const handleAnswerQuestion = async (answer) => {
    try {
      await axios.post("/ReplyQuestion", { answer, id }, multiFormData)
      toast.success(locale === "en" ? "Your reply has been sent successfully!" : "!تم إرسال ردك بنجاح")
      setOpenReplyModal(false)
      push({
        pathname: "/reviews",
        query: {
          tab: "questions",
        },
      })
    } catch (error) {
      toast.error(locale === "en" ? "Failed to sent your reply!" : "!فشل ارسال ردك")
    }
  }

  return (
    <Fragment>
      <div className="contint_paner box-Rev-Que">
        <div className="title_">
          <div className="d-flex align-items-center gap-2">
            <div className="font-11">
              <div>{pathOr("", [locale, "questionsAndReviews", "ad"], t)}</div>
              <div className="f-b">{productName}</div>
            </div>
            {/*<div className="num">
  {pathOr("", [locale, "questionsAndReviews", "reqNumber"], t)} #{id}
            </div>*/}
          </div>
          <div>{formatDate(createdAt)}</div>
        </div>
        <div className="px-4 py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center gap-2">
              <Image src={clientImage} className="img_user" alt="client" width={70} height={70} />
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

            {/*<div className="form-check form-switch p-0 m-0">
              <input
                onChange={() => handleShareQuestion(id)}
                checked={isShared}
                className="form-check-input m-0"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckChecked"
              />
              <span className="mx-1"> {pathOr("", [locale, "questionsAndReviews", "shareQuestion"], t)}</span>
          </div>*/}
          </div>
        </div>
        <ReplyModal
          openModal={openReplyModal}
          setOpenModal={setOpenReplyModal}
          handleAnswerQuestion={handleAnswerQuestion}
          clientName={clientName}
          question={question}
          clientImage={clientImage}
        />
      </div>
    </Fragment>
  )
}

const ReplyModal = ({ openModal, setOpenModal, clientName, question, handleAnswerQuestion, clientImage }) => {
  const [answer, setAnswer] = useState("")
  const { locale } = useRouter()
  return (
    <Modal
      show={openModal}
      onHide={() => setOpenModal(false)}
      style={{
        textAlign: locale === "en" ? "left" : "right",
        direction: locale === "en" ? "rtl" : "ltr",
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg mx-5">
        <div className="modal-content" style={{ border: "none" }}>
          <Modal.Header className="py-1 px-0">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setOpenModal(false)}
            ></button>
            <h5 className="modal-title m-0 f-b" id="staticBackdropLabel">
              {pathOr("", [locale, "questionsAndReviews", "respondToQuestion"], t)}
            </h5>
          </Modal.Header>
          <Modal.Body className="d-flex align-items-center justify-content-end gap-2  px-0 pt-3 pb-0">
            <div className="d-flex align-items-center gap-2">
              <div className="f-b">
                <h6 className="m-0 f-b">{clientName}</h6>
                <div className="gray-color">{question}</div>
              </div>
            </div>
            <Image src={clientImage} className="img_user" alt="client" width={50} height={50} />
          </Modal.Body>
          <hr />
          <div className="form-group">
            <label>{pathOr("", [locale, "questionsAndReviews", "writeYourReply"], t)}</label>
            <input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              type="text"
              className="form-control"
              placeholder={pathOr("", [locale, "questionsAndReviews", "writeYourReply"], t)}
            />
          </div>

          <Row>
            <Col>
              <button
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
                className="btn-main btn-main-B w-100"
                style={{ backgroundColor: "#45495e" }}
                onClick={() => setOpenModal(false)}
              >
                {pathOr("", [locale, "Products", "cancel"], t)}
              </button>
            </Col>
            <Col>
              <button
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
                className="btn-main w-100"
                onClick={() => handleAnswerQuestion(answer)}
              >
                {pathOr("", [locale, "questionsAndReviews", "sendReply"], t)}
              </button>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  )
}

export default Question

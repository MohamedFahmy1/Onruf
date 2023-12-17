import axios from "axios"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { Row, Col } from "react-bootstrap"
import Modal from "react-bootstrap/Modal"
import { formatDate } from "../../../common/functions"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { Fragment } from "react"
import Image from "next/image"
import ratingImage from "../../../../public/images/rating.png"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { mulitFormData } from "../../../../token"

const Comment = ({ orderId, rate, comment, productName, userName, userImage, createdAt, id, isShare }) => {
  const { locale, push } = useRouter()
  const [openReplyModal, setOpenReplyModal] = useState(false)
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)
  const [reply, setReply] = useState()
  // const [openEditModal, setOpenEditModal] = useState(false)
  // Handle Delete a review
  // const handleDeleteReview = async (id) => {
  //   const result = await axios.delete(process.env.REACT_APP_API_URL + "/RemoveRateProduct", {
  //     params: {
  //       id,
  //     },
  //   })
  //   push({ pathname: "/reviews", query: { tab: "reviews" } })
  // }

  const handleShareReview = async (id) => {
    try {
      const result = await axios.post(process.env.REACT_APP_API_URL + `/ShareRate?id=${id}`)
      toast.success(locale === "en" ? "Rating share status successfully changed!" : "!تم تغيير حالة نشر التقييم")
      push({ pathname: "/reviews", query: { tab: "reviews" } })
    } catch (error) {
      toast.error(
        locale === "en" ? "Error happend please try again later!" : "!حدث خطأ الرجاء اعادة المحاولة في وقت أخر",
      )
    }
  }
  const handleReplyReview = async (id) => {
    try {
      await axios.post(
        process.env.REACT_APP_API_URL + `/ReplyToRate`,
        {
          rateId: id,
          userId: buisnessAccountId,
          reply: reply,
        },
        mulitFormData,
      )
      toast.success(locale === "en" ? "Your Reply has been sent!" : "!تم إرسال الرد بنجاح")
      setOpenReplyModal(false)
      push({ pathname: "/reviews", query: { tab: "reviews" } })
    } catch (error) {
      toast.error(
        locale === "en" ? "Error happend please try again later!" : "!حدث خطأ الرجاء اعادة المحاولة في وقت أخر",
      )
    }
  }
  // Handle Edit a review
  // const handleEditReview = async (comment, rate) => {
  //   const result = await axios.put(process.env.REACT_APP_API_URL + "/EditRateProduct", { comment, rate, id })
  //   setOpenEditModal(false)
  //   push({ pathname: "/reviews", query: { tab: "reviews" } })
  // }

  return (
    <Fragment>
      <div className="contint_paner box-Rev-Que">
        <div className="title_">
          <div className="d-flex align-items-center gap-2">
            <div className="font-11">
              <div>{pathOr("", [locale, "questionsAndReviews", "ad"], t)}</div>
              <div className="f-b fs-5">{productName}</div>
            </div>
            <div className="num">
              {pathOr("", [locale, "questionsAndReviews", "reqNumber"], t)} {orderId}#
            </div>
          </div>
          <div className="f-b fs-6">{formatDate(createdAt)}</div>
        </div>
        <div className="px-4 py-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="d-flex align-items-center gap-2">
              <Image src={userImage} className="img_user" alt="user" width={70} height={70} />
              <div className="f-b">
                <h6 className="m-0 f-b">{userName}</h6>
                <div className="gray-color">{comment}</div>
              </div>
            </div>
            <div className="imogy">
              <Image src={ratingImage} alt="rating" width={40} height={40} />
              <span className="fs-4">{rate.toFixed(1)}</span>
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
            {/*
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
  </button>*/}
            <div className="form-check form-switch p-0 m-0">
              <input
                onChange={() => handleShareReview(id)}
                className="form-check-input m-0"
                type="checkbox"
                role="switch"
                id="flexSwitchCheckChecked"
                defaultChecked={isShare ? true : false}
              />
              <span className="mx-1"> {pathOr("", [locale, "questionsAndReviews", "shareRating"], t)}</span>
            </div>
          </div>
        </div>
        <ReplyModal
          openModal={openReplyModal}
          setOpenModal={setOpenReplyModal}
          rate={rate}
          comment={comment}
          userName={userName}
          image={userImage}
          id={id}
          setReply={setReply}
          handleReplyReview={handleReplyReview}
        />
        {/*<EditModal
          openModal={openEditModal}
          setOpenModal={setOpenEditModal}
          rate={rate}
          comment={comment}
          userName={userName}
          image={userImage}
          id={orderId}
          handleEditReview={handleEditReview}
/>*/}
      </div>
    </Fragment>
  )
}
const ReplyModal = ({ openModal, setOpenModal, comment, userName, rate, image, handleReplyReview, id, setReply }) => {
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
              onClick={() => setOpenModal(false)}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
            <h5 className="modal-title m-0  f-b" id="staticBackdropLabel">
              {pathOr("", [locale, "questionsAndReviews", "respondToReview"], t)}
            </h5>
          </Modal.Header>
          <Modal.Body className="d-flex align-items-center justify-content-between gap-2 px-0 pt-3 pb-0">
            <div className="imogy">
              <span>{rate.toFixed(1)}</span>
              <Image src={ratingImage} alt="rating" width={30} height={30} />
            </div>
            <div className="d-flex align-items-center gap-2 px-2">
              <div className="f-b">
                <h6 className="m-0 f-b">{userName}</h6>
                <div className="gray-color">{comment}</div>
              </div>
              <Image src={image} alt="user" width={50} height={50} />
            </div>
          </Modal.Body>
          <hr />
          <div className="form-group">
            <label>{pathOr("", [locale, "questionsAndReviews", "writeYourReply"], t)}</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setReply(e.target.value)}
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
                onClick={() => handleReplyReview(id)}
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

// const EditModal = ({ openModal, setOpenModal, userName, comment, rate, image, handleEditReview }) => {
//   const [commentEdit, setComment] = useState(comment)
//   const [rateEdit, setRate] = useState(rate)

//   return (
//     <Modal show={openModal} onHide={() => setOpenModal(false)}>
//       <div className="modal-dialog modal-dialog-centered modal-lg" style={{ width: "100%" }}>
//         <div className="modal-content">
//           <Modal.Header>
//             <h5 className="modal-title m-0 f-b" id="staticBackdropLabel">
//               Edit Review
//             </h5>
//             <button
//               onClick={() => setOpenModal(false)}
//               type="button"
//               className="btn-close"
//               data-bs-dismiss="modal"
//               aria-label="Close"
//             ></button>
//           </Modal.Header>
//           <Modal.Body className="d-flex align-items-center justify-content-between gap-2">
//             <div className="d-flex align-items-center gap-2">
//               <img src="../core/imgs/user.png" className="img_user" />
//               <div className="f-b">
//                 <h6 className="m-0 f-b">{userName}</h6>
//               </div>
//             </div>
//             <div className="imogy">
//               <input
//                 value={rateEdit}
//                 onChange={(e) => setRate(e.target.value)}
//                 type="number"
//                 style={{ border: "0", maxWidth: "48px" }}
//               />
//               <img src={image} />
//             </div>
//           </Modal.Body>
//           <hr />
//           <div className="form-group">
//             <label>اكتب ردك</label>
//             <input
//               value={commentEdit}
//               onChange={(e) => setComment(e.target.value)}
//               type="text"
//               className="form-control"
//               placeholder="اكتب ردك"
//             />
//           </div>

//           <Row>
//             <Col>
//               <button
//                 onClick={() => handleEditReview(commentEdit, rateEdit)}
//                 type="button"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//                 className="btn-main w-100"
//               >
//                 حفظ
//               </button>
//             </Col>
//           </Row>
//         </div>
//       </div>
//     </Modal>
//   )
// }

export default Comment

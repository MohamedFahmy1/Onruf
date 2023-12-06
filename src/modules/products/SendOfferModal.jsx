import { useState } from "react"
import { Modal } from "react-bootstrap"
import t from "../../translations.json"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { Alerto } from "../../common/Alerto"
import axios from "axios"
import { useFetch } from "../../hooks/useFetch"
import Image from "next/image"
import { formatDate } from "../../common/functions"

const SendOfferModal = ({ sendOfferModal, setSendOfferModal, id }) => {
  const { locale } = useRouter()
  const [selectedUsers, setSelectedUsers] = useState([])
  const { data: offersData } = useFetch(`/GetBids?productId=${id}`)
  const acceptOffer = async () => {
    // if (offerExpireHours) {
    //   try {
    //     await axios.post(
    //       `${
    //         process.env.NEXT_PUBLIC_API_URL
    //       }/AcceptRejectOffer?offerId=${offerId}&productId=${productId}&acceptOffer=${true}&OfferExpireHours=${offerExpireHours}`,
    //     )
    //     toast.success(locale === "en" ? "Offer Sent Successfully!" : "تم ارسال العرض بنجاح")
    //     setSendOfferModal(false)
    //     getOffers()
    //   } catch (error) {
    //     toast.error(error.response.data.message)
    //   }
    // } else toast.error(pathOr("", [locale, "negotiation", "please_select_expiration_hours"], t))
  }
  const selectedUsersHandler = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers((prev) => prev.filter((user) => user !== userId))
    } else setSelectedUsers((prev) => [...prev, userId])
  }
  const selectAllUsersHandler = () => {
    let allUsers = []
    offersData.map((item) => allUsers.push(item.userId))
    setSelectedUsers(allUsers)
  }
  return (
    <Modal
      show={sendOfferModal}
      onHide={() => setSendOfferModal(false)}
      centered
      className="unique-send-offer-modal text-left"
    >
      <Modal.Header className="justify-content-end">
        <button type="button" className="btn-close" onClick={() => setSendOfferModal(false)}></button>
      </Modal.Header>
      <Modal.Body className="py-0">
        <h5 className="disc-header fs-4 text-center m-0 p-0">{pathOr("", [locale, "Products", "send_offer"], t)}</h5>
        <div className="d-flex justify-content-between my-1">
          <p className="fs-5">
            {offersData?.length} {pathOr("", [locale, "Products", "user"], t)}
          </p>
          <button className="fs-5" type="button" onClick={selectAllUsersHandler}>
            {pathOr("", [locale, "Products", "selectAll"], t)}
          </button>
        </div>
        {offersData?.map((item) => (
          <div className="justify-content-between d-flex align-items-center my-2" key={item.bidId}>
            <label className="d-flex align-items-center gap-2">
              <Image src={item.userImage} className="img-fluid" alt="user" width={60} height={60} />
              <div>
                <p className="fs-6">{formatDate(item.createdAt)}</p>
                <p className="f-b fs-5">{item.userName}</p>
                <p>
                  {item.bidPrice} {pathOr("", [locale, "Products", "currency"], t)}
                </p>
              </div>
            </label>
            <input
              type="checkbox"
              id={item.bidId}
              checked={selectedUsers.includes(item.userId)}
              onChange={() => selectedUsersHandler(item.userId)}
            />
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <button type="button" className="btn-main" onClick={acceptOffer}>
          {pathOr("", [locale, "Products", "next"], t)}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default SendOfferModal

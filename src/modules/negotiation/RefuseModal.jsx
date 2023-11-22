import { useState } from "react"
import { Modal } from "react-bootstrap"
import t from "../../translations.json"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import axios from "axios"

const RefuseModal = ({ refuseModal, setRefuseModal, offerId, productId, getOffers }) => {
  const { locale } = useRouter()
  const [refuseReason, setRefuseReason] = useState()
  const refuseOffer = async () => {
    if (refuseReason) {
      try {
        await axios.post(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/AcceptRejectOffer?offerId=${offerId}&productId=${productId}&acceptOffer=${false}&refuseReason=${refuseReason}&OfferExpireHours=${0}`,
        )
        toast.success(locale === "en" ? "Offer rejected Successfully!" : "تم رفض العرض ")
        setRefuseModal(false)
        getOffers()
      } catch (error) {
        toast.error(error.response.data.message)
      }
    } else toast.error(pathOr("", [locale, "negotiation", "please_add_reason"], t))
  }

  return (
    <Modal show={refuseModal} onHide={() => setRefuseModal(false)} centered>
      <Modal.Header>
        <h5 className="disc-header">{pathOr("", [locale, "negotiation", "reject_negotiation_offer"], t)}</h5>
        <button type="button" className="btn-close" onClick={() => setRefuseModal(false)}></button>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <h5 className="disc-header" style={{ textAlign: locale === "en" ? "left" : "right" }}>
            {pathOr("", [locale, "negotiation", "please_add_reason"], t)}
          </h5>
          <input
            type="text"
            minLength={0}
            className="form-control form-input"
            style={{ textAlign: locale === "en" ? "left" : "right" }}
            placeholder={pathOr("", [locale, "negotiation", "write_reject_reason"], t)}
            onChange={(e) => setRefuseReason(e.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <button type="button" className="btn-main" onClick={refuseOffer}>
          {pathOr("", [locale, "negotiation", "reject"], t)}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default RefuseModal

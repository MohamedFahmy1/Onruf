import { useState } from "react"
import { Modal } from "react-bootstrap"
import t from "../../translations.json"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { Alerto } from "../../common/Alerto"
import axios from "axios"

const AcceptModal = ({ acceptModal, setAcceptModal, offerId, productId, getOffers }) => {
  const { locale } = useRouter()
  const [offerExpireHours, setOfferExpireHours] = useState()
  const acceptOffer = async () => {
    if (offerExpireHours) {
      try {
        await axios.post(
          `/AcceptRejectOffer?offerId=${offerId}&productId=${productId}&acceptOffer=${true}&OfferExpireHours=${offerExpireHours}`,
        )
        toast.success(locale === "en" ? "Offer Sent Successfully!" : "تم ارسال العرض بنجاح")
        setAcceptModal(false)
        getOffers()
      } catch (error) {
        toast.error(error.response.data.message)
      }
    } else toast.error(pathOr("", [locale, "negotiation", "please_select_expiration_hours"], t))
  }

  return (
    <Modal show={acceptModal} onHide={() => setAcceptModal(false)} centered>
      <Modal.Header>
        <h5 className="disc-header">{pathOr("", [locale, "negotiation", "accept_negotiation_offer"], t)}</h5>
        <button type="button" className="btn-close" onClick={() => setAcceptModal(false)}></button>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <h5 className="disc-header">{pathOr("", [locale, "negotiation", "please_select_expiration_hours"], t)}</h5>
          <select
            defaultValue={"0"}
            className="form-control form-select"
            onChange={(e) => setOfferExpireHours(+e.target.value)}
          >
            <option hidden disabled value="0">
              {pathOr("", [locale, "negotiation", "please_select_expiration_hours"], t)}
            </option>
            <option value="3">3</option>
            <option value="6">6</option>
            <option value="12">12</option>
            <option value="24">24</option>
            <option value="48">48</option>
          </select>
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <button type="button" className="btn-main" onClick={acceptOffer}>
          {pathOr("", [locale, "negotiation", "accept"], t)}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default AcceptModal

import { useState } from "react"
import { Modal } from "react-bootstrap"
import t from "../../translations.json"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import axios from "axios"

const AcceptModal = ({ acceptModal, setAcceptModal, offerId, productId }) => {
  const { locale } = useRouter()
  const [offerExpireHours, setOfferExpireHours] = useState()
  const acceptOffer = async () => {
    await axios.post(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/AcceptRejectOffer?offerId=${offerId}&productId=${productId}&acceptOffer=${true}&OfferExpireHours=${offerExpireHours}`,
    )
    toast.success(locale === "en" ? "Offer Sent Successfully!" : "تم ارسال العرض بنجاح")
  }

  return (
    <Modal show={acceptModal} onHide={() => setAcceptModal(false)}>
      <Modal.Header>
        <h5 className="disc-header">{pathOr("", [locale, "Products", "discount"], t)}</h5>
        <button type="button" className="btn-close" onClick={() => setAcceptModal(false)}></button>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <h5 className="disc-header"></h5>
          <div className="inpt_numb my-3">
            <button className="btn_ plus" onClick={() => setPriceValue((prev) => prev + 1)}>
              +
            </button>
            <input type="number" min="0" className="form-control" onChange={(e) => setPriceValue(e.target.value)} />
            <button className="btn_ minus" onClick={() => setPriceValue((prev) => (priceValue ? prev - 1 : 0))}>
              -
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>{pathOr("", [locale, "Products", "discountEndDate"], t)}</label>
          <input type="date" className="form-control" onChange={(e) => setDiscountDate(e.target.value)} />
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <button type="button" className="btn-main">
          {pathOr("", [locale, "Products", "save"], t)}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default AcceptModal

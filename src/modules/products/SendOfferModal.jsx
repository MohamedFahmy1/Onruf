import { useState } from "react"
import { Modal } from "react-bootstrap"
import t from "../../translations.json"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { Alerto } from "../../common/Alerto"
import axios from "axios"
import { useFetch } from "../../hooks/useFetch"

const SendOfferModal = ({ sendOfferModal, setSendOfferModal, id }) => {
  const { locale } = useRouter()
  const [offerExpireHours, setOfferExpireHours] = useState()
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

  return (
    <Modal show={sendOfferModal} onHide={() => setSendOfferModal(false)} centered className="unique-send-offer-modal">
      <Modal.Header>
        <h5 className="disc-header">{pathOr("", [locale, "Products", "negotiationOffers"], t)}</h5>
        <button type="button" className="btn-close" onClick={() => setSendOfferModal(false)}></button>
      </Modal.Header>
      <Modal.Body></Modal.Body>
      <Modal.Footer className="modal-footer">
        <button type="button" className="btn-main" onClick={acceptOffer}>
          {pathOr("", [locale, "negotiation", "accept"], t)}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default SendOfferModal

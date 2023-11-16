import Link from "next/link"
import { useEffect, useState } from "react"
import styles from "./marketing.module.css"
import { useSelector } from "react-redux"
import axios from "axios"
import { pathOr } from "ramda"
import t from "../../translations.json"
import { useRouter } from "next/router"
const Marketing = () => {
  const token = useSelector((state) => state.authSlice.token)
  const providerId = useSelector((state) => state.authSlice.providerId)
  const { locale } = useRouter()
  const [offers, setOffers] = useState()
  const getOffers = async () => {
    const {
      data: { data: offers },
    } = await axios(`${process.env.REACT_APP_API_URL}/ListAdminCoupons?currentPage=${1}&maxRows=${10}`)
    setOffers(offers)
  }

  useEffect(() => {
    getOffers()
  }, [token])

  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <div className="d-flex align-items-center">
            <h6 className="f-b m-0">
              {pathOr("", [locale, "marketing", "marketing_with_onruf"], t)} ({offers && offers.length})
            </h6>
          </div>
        </div>
        <div className="row">
          {Boolean(offers && offers?.length) &&
            offers.map((offer) => (
              <div className="col-lg-4" key={offer.id}>
                <div className={styles["box_shopping"]}>
                  <img src={offer.image} />
                  <h6 className="f-b">{offer.couponCode}</h6>
                  <p className="mb-2">{offer.description}</p>
                  {offer.discountTypeID === 1 && (
                    <>
                      <div className="font-18">{pathOr("", [locale, "marketing", "discount_value"], t)}</div>
                      <h4 className="f-b main-color">{offer.discountValue}%</h4>
                    </>
                  )}
                  {offer.discountTypeID === 2 && (
                    <>
                      <div className="font-18">{pathOr("", [locale, "marketing", "discount_percentage"], t)}</div>
                      <h4 className="f-b main-color">{offer.discountPercentage}%</h4>
                    </>
                  )}
                  <Link href={`marketing/join-campaign/${offer.id}`}>
                    <a className="btn-main d-block">{pathOr("", [locale, "marketing", "join_the_coupon"], t)}</a>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Marketing

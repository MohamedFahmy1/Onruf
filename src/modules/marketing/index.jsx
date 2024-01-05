import Link from "next/link"
import { useEffect, useState } from "react"
import styles from "./marketing.module.css"
import { useSelector } from "react-redux"
import axios from "axios"
import { pathOr } from "ramda"
import t from "../../translations.json"
import { useRouter } from "next/router"
import ResponsiveImage from "../../common/ResponsiveImage"
import Image from "next/image"

const Marketing = () => {
  const token = useSelector((state) => state.authSlice.token)
  const { locale } = useRouter()
  const [offers, setOffers] = useState()
  const getOffers = async () => {
    const {
      data: { data: offers },
    } = await axios(`${process.env.REACT_APP_API_URL}/ListAdminCoupons?currentPage=${1}&maxRows=${10}`)
    setOffers(offers)
    console.log(offers)
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
              <div className="col-md-4" key={offer.id}>
                <div className={styles["box_shopping"]}>
                  <Image
                    src={offer.image.includes("http") ? offer.image.replace("http", "https") : offer.image}
                    alt="offer"
                    width={340}
                    height={260}
                  />
                  <h6 className="f-b">{offer.title}</h6>
                  <p className="mb-2">{offer.description}</p>
                  {offer.discountTypeID === "FixedAmount" ? (
                    <>
                      <div className="font-18">{pathOr("", [locale, "marketing", "discount_value"], t)}</div>
                      <h4 className="f-b main-color">
                        {offer.discountValue} {pathOr("", [locale, "Products", "currency"], t)}
                      </h4>
                    </>
                  ) : (
                    <>
                      <div className="font-18">{pathOr("", [locale, "marketing", "discount_percentage"], t)}</div>
                      <h4 className="f-b main-color">{offer.discountValue}%</h4>
                    </>
                  )}
                  <Link href={`marketing/join-campaign/${offer.id}`}>
                    <button className="btn-main d-block w-100 fs-5">
                      {pathOr("", [locale, "marketing", "join_the_coupon"], t)}
                    </button>
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

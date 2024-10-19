import Link from "next/link"
import styles from "./marketing.module.css"
import { pathOr } from "ramda"
import t from "../../translations.json"
import { useRouter } from "next/router"
import Image from "next/image"
import { useFetch } from "../../hooks/useFetch"
import { LoadingScreen } from "../../common/Loading"

const Marketing = () => {
  const { locale } = useRouter()
  const { data: offers, isLoading } = useFetch(`/ListAdminCoupons?currentPage=${1}&maxRows=${10}`)

  if (isLoading) return <LoadingScreen />

  return (
    <article className="body-content">
      <section className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
        <div className="d-flex align-items-center">
          <h6 className="f-b m-0">
            {pathOr("", [locale, "marketing", "marketing_with_onruf"], t)} ({offers && offers.length})
          </h6>
        </div>
      </section>
      <section className="row">
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
      </section>
    </article>
  )
}

export default Marketing

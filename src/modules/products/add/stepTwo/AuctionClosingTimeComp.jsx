import { useState, Fragment } from "react"
import styles from "./stepTwo.module.css"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../../../translations.json"
const AuctionClosingTimeComp = ({ productPayload, setProductPayload }) => {
  const { locale } = useRouter()
  return (
    <Fragment>
      {productPayload?.IsAuctionEnabled && (
        <div className="col-md-6">
          <h5 className="f-b" style={{ textAlign: locale === "en" ? "left" : "right", display: "block" }}>
            {pathOr("", [locale, "Products", "offer_duration"], t)}
          </h5>
          <div
            onClick={() => setProductPayload({ ...productPayload, appointment: 3 })}
            className={`form-group contint_paner ${styles.p_select} ${
              productPayload.appointment == 3 ? styles.p_select_active : ""
            }`}
          >
            <label style={{ textAlign: locale === "en" ? "left" : "right", display: "block" }}>
              {pathOr("", [locale, "Products", "fixed_length"], t)}
            </label>
            <div className="d-flex gap-3">
              <div
                onClick={() => setProductPayload({ ...productPayload, appointment: 1 })}
                className={`${styles.p_select} ${productPayload.appointment == 1 ? styles.p_select_active : ""}`}
              >
                {pathOr("", [locale, "Products", "one_week"], t)}
              </div>
              <div
                onClick={() => setProductPayload({ ...productPayload, appointment: 2 })}
                className={`${styles.p_select} ${productPayload.appointment == 2 ? styles.p_select_active : ""}`}
              >
                {pathOr("", [locale, "Products", "two_weeks"], t)}
              </div>
              <div
                onClick={() => setProductPayload({ ...productPayload, appointment: 3 })}
                className={`${styles.p_select} ${productPayload.appointment == 3 ? styles.p_select_active : ""}`}
              >
                {"3"} {pathOr("", [locale, "Products", "weeks"], t)}
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  )
}

export default AuctionClosingTimeComp

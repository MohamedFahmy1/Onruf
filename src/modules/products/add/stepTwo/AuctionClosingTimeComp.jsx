import { useState } from "react"
import styles from "./stepTwo.module.css"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../../../translations.json"
import { toast } from "react-toastify"
const AuctionClosingTimeComp = ({ productPayload, setProductPayload, selectedCatProps }) => {
  const { locale } = useRouter()
  const [fixedLength, setFixedLength] = useState(true)
  const [activeElementIndex, setActiveElementIndex] = useState(null)
  function renderFixedLengthDays(item) {
    switch (item) {
      case 1:
        return pathOr("", [locale, "Products", "one_day"], t)
      case 2:
        return pathOr("", [locale, "Products", "two_days"], t)
      default:
        return `${item} ${pathOr("", [locale, "Products", "days"], t)}`
    }
  }
  function renderFixedLengthWeeks(item) {
    switch (item) {
      case 1:
        return pathOr("", [locale, "Products", "one_week"], t)
      case 2:
        return pathOr("", [locale, "Products", "two_weeks"], t)
      default:
        return `${item} ${pathOr("", [locale, "Products", "weeks"], t)}`
    }
  }
  function renderFixedLengthMonths(item) {
    switch (item) {
      case 1:
        return pathOr("", [locale, "Products", "one_month"], t)
      case 2:
        return pathOr("", [locale, "Products", "two_months"], t)
      default:
        return `${item} ${pathOr("", [locale, "Products", "months"], t)}`
    }
  }
  return (
    <div className="col-md-12 col-lg-6 d-flex flex-wrap flex-lg-nowrap w-100 gap-5 mb-4">
      <div
        className={`form-group contint_paner w-100 ${styles.p_select} ${
          fixedLength == true ? styles.p_select_active : ""
        }`}
      >
        <div className="d-flex justify-content-between p-2">
          <label className="fs-5" style={{ textAlign: locale === "en" ? "left" : "right", display: "block" }}>
            {pathOr("", [locale, "Products", "fixed_length"], t)}
          </label>
          <input
            type="radio"
            name="AuctionDuration"
            id="AuctionDuration"
            onClick={() => {
              setFixedLength(true)
              setActiveElementIndex(null)
              setProductPayload({ ...productPayload, AuctionClosingTime: "", IsAuctionClosingTimeFixed: true })
            }}
            checked={productPayload?.IsAuctionClosingTimeFixed}
          />
        </div>
        <div className="d-flex gap-3">
          {selectedCatProps.auctionClosingPeriods.split(",").map((item, index) => {
            if (selectedCatProps.auctionClosingPeriodsUnit == 1) {
              const daysToAdd = item * 1
              const millisecondsPerDay = 24 * 60 * 60 * 1000
              const futureTimestamp = Date.now() + daysToAdd * millisecondsPerDay
              const futureDate = new Date(futureTimestamp)
              const auctionClosingTimeIso = futureDate.toISOString()
              return (
                <div
                  key={index}
                  onClick={() => {
                    if (fixedLength) {
                      setProductPayload({
                        ...productPayload,
                        AuctionClosingTime: auctionClosingTimeIso,
                        IsAuctionClosingTimeFixed: true,
                      })
                      setActiveElementIndex(+item)
                    } else
                      return toast.error(locale === "en" ? "Please Select Duration Type First!" : "رجاء اختر نوع المدة")
                  }}
                  className={`${styles.p_select} ${item == activeElementIndex ? styles.p_select_active : ""}`}
                >
                  {renderFixedLengthDays(+item)}
                </div>
              )
            }
            if (selectedCatProps.auctionClosingPeriodsUnit == 2) {
              const daysToAdd = item * 7
              const millisecondsPerDay = 24 * 60 * 60 * 1000
              const futureTimestamp = Date.now() + daysToAdd * millisecondsPerDay
              const futureDate = new Date(futureTimestamp)
              const auctionClosingTimeIso = futureDate.toISOString()
              return (
                <div
                  key={index}
                  onClick={() => {
                    if (fixedLength) {
                      setProductPayload({
                        ...productPayload,
                        AuctionClosingTime: auctionClosingTimeIso,
                        IsAuctionClosingTimeFixed: true,
                      })
                      setActiveElementIndex(+item)
                    } else
                      return toast.error(locale === "en" ? "Please Select Duration Type First!" : "رجاء اختر نوع المدة")
                  }}
                  className={`${styles.p_select} ${item == activeElementIndex ? styles.p_select_active : ""}`}
                >
                  {renderFixedLengthWeeks(+item)}
                </div>
              )
            }
            if (selectedCatProps.auctionClosingPeriodsUnit == 3) {
              const daysToAdd = item * 30
              const millisecondsPerDay = 24 * 60 * 60 * 1000
              const futureTimestamp = Date.now() + daysToAdd * millisecondsPerDay
              const futureDate = new Date(futureTimestamp)
              const auctionClosingTimeIso = futureDate.toISOString()
              return (
                <div
                  key={index}
                  onClick={() => {
                    if (fixedLength) {
                      setProductPayload({
                        ...productPayload,
                        AuctionClosingTime: auctionClosingTimeIso,
                        IsAuctionClosingTimeFixed: true,
                      })
                      setActiveElementIndex(+item)
                    } else
                      return toast.error(locale === "en" ? "Please Select Duration Type First!" : "رجاء اختر نوع المدة")
                  }}
                  className={`${styles.p_select} ${item == activeElementIndex ? styles.p_select_active : ""}`}
                >
                  {renderFixedLengthMonths(+item)}
                </div>
              )
            }
          })}
        </div>
      </div>
      <div
        className={`form-group contint_paner w-100 ${styles.p_select} ${
          fixedLength == false ? styles.p_select_active : ""
        }`}
      >
        <div className="d-flex justify-content-between p-2">
          <label className="fs-5" style={{ textAlign: locale === "en" ? "left" : "right", display: "block" }}>
            {pathOr("", [locale, "Products", "set_your_own_datetime"], t)}
          </label>
          <input
            type="radio"
            name="AuctionDuration"
            id="AuctionDuration"
            onClick={() => {
              setFixedLength(false)
              setActiveElementIndex(null)
              setProductPayload({ ...productPayload, AuctionClosingTime: "", IsAuctionClosingTimeFixed: false })
            }}
            checked={!productPayload?.IsAuctionClosingTimeFixed}
          />
        </div>
        <p style={{ textAlign: locale === "en" ? "left" : "right", display: "block" }}>{`+ ${
          selectedCatProps.auctionClosingTimeFee
        } ${pathOr("", [locale, "Products", "currency"], t)}`}</p>
        <input
          type="datetime-local"
          onChange={(e) => {
            if (!fixedLength) {
              setProductPayload({
                ...productPayload,
                AuctionClosingTime: e.target.value,
                IsAuctionClosingTimeFixed: false,
              })
            } else return toast.error(locale === "en" ? "Please Select Duration Type First!" : "رجاء اختر نوع المدة")
          }}
          disabled={fixedLength}
          className="rounded"
        />
      </div>
    </div>
  )
}

export default AuctionClosingTimeComp

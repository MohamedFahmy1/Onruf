import { pathOr } from "ramda"
import { Accordion, Row } from "react-bootstrap"
import React, { useEffect, useState } from "react"
import styles from "./stepTwo.module.css"
import { useRouter } from "next/router"
import { textAlignStyle } from "../../../../styles/stylesObjects"
import t from "../../../../translations.json"
import { onlyNumbersInInputs } from "../../../../common/functions"
import { useFetch } from "../../../../hooks/useFetch"
import BanksData from "./BanksData"

const SaleDetails = ({ productPayload, setProductPayload, validateSaleDetails, setEventKey }) => {
  const { locale, pathname } = useRouter()
  const { data: userBanksData } = useFetch("/BankTransfersList")
  const [showBanksData, setShowBanksData] = useState(false)

  const paymentOptionsHandler = (optionIndex) => {
    if (optionIndex === 2) {
      setProductPayload((prev) => ({
        ...prev,
        PaymentOptions: [...prev.PaymentOptions, 2],
      }))
    } else if (!productPayload.PaymentOptions?.includes(optionIndex)) {
      setProductPayload((prev) => ({
        ...prev,
        PaymentOptions: [...prev.PaymentOptions, optionIndex],
      }))
    } else if (productPayload.PaymentOptions?.includes(optionIndex)) {
      setProductPayload((prev) => ({
        ...prev,
        PaymentOptions: prev.PaymentOptions.filter((value) => value !== optionIndex),
      }))
    }
  }

  const handleSendNegotiationOffer = () => {
    if (productPayload.SendOfferForAuction === true) {
      return setProductPayload({
        ...productPayload,
        SendOfferForAuction: !productPayload.SendOfferForAuction,
        AuctionNegotiatePrice: null,
        AuctionNegotiateForWhom: null,
      })
    } else
      setProductPayload({
        ...productPayload,
        SendOfferForAuction: !productPayload.SendOfferForAuction,
      })
  }

  const { PaymentOptions } = productPayload
  useEffect(() => {
    if (PaymentOptions?.includes(1)) {
      setProductPayload((prev) => ({ ...prev, IsCashEnabled: true }))
    } else setProductPayload((prev) => ({ ...prev, IsCashEnabled: false }))
  }, [PaymentOptions, setProductPayload])

  const RequiredSympol = () => <span style={{ color: "red", fontSize: "1.3rem" }}>*</span>

  return (
    <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
      <div className="form-content">
        <form>
          <Row>
            <div className="col-12">
              <div className="form-group">
                <label style={{ textAlign: locale === "en" ? "left" : undefined, display: "block" }}>
                  {pathOr("", [locale, "Products", "salesType"], t)}
                  <RequiredSympol />
                </label>
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="form-group">
                      <div className="form-control outer-check-input">
                        <div className="form-check form-switch p-0 m-0 d-flex">
                          <input
                            className="form-check-input m-0"
                            type="checkbox"
                            role="switch"
                            id="IsFixedPriceEnabled"
                            checked={productPayload.IsFixedPriceEnabled === 0 ? "" : productPayload.IsFixedPriceEnabled}
                            onChange={() => {
                              setProductPayload({
                                ...productPayload,
                                IsFixedPriceEnabled: !productPayload.IsFixedPriceEnabled,
                                // if you choose negotion you must set price to 0
                                Price: productPayload.IsNegotiationEnabled ? 0 : productPayload.Price,
                              })
                            }}
                            disabled={pathname.includes("edit")}
                          />
                          <label htmlFor="IsFixedPriceEnabled">{pathOr("", [locale, "Products", "adFixed"], t)}</label>
                          <span className="bord" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-group">
                      <div className="form-control outer-check-input">
                        <div className="form-check form-switch p-0 m-0">
                          <input
                            className="form-check-input m-0"
                            type="checkbox"
                            role="switch"
                            id="IsAuctionEnabled"
                            checked={productPayload.IsAuctionEnabled === 0 ? "" : productPayload.IsAuctionEnabled}
                            onChange={() =>
                              setProductPayload({
                                ...productPayload,
                                IsAuctionEnabled: !productPayload.IsAuctionEnabled,
                              })
                            }
                            disabled={pathname.includes("edit")}
                          />
                          <label htmlFor="IsAuctionEnabled">{pathOr("", [locale, "Products", "adAuct"], t)}</label>
                          <span className="bord" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="form-group">
                      <div className="form-control outer-check-input">
                        <div className="form-check form-switch p-0 m-0">
                          <input
                            className="form-check-input m-0"
                            type="checkbox"
                            role="switch"
                            id="IsNegotiationEnabled"
                            checked={
                              productPayload.IsNegotiationEnabled === 0 ? "" : productPayload.IsNegotiationEnabled
                            }
                            onChange={() =>
                              setProductPayload({
                                ...productPayload,
                                IsNegotiationEnabled: !productPayload.IsNegotiationEnabled,
                                Price: !productPayload.IsNegotiationEnabled ? 0 : productPayload.Price,
                              })
                            }
                            disabled={pathname.includes("edit")}
                          />
                          <label htmlFor="IsNegotiationEnabled">
                            {pathOr("", [locale, "Products", "negotiation"], t)}
                          </label>
                          <span className="bord" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {(!!(productPayload.IsFixedPriceEnabled && !productPayload.IsNegotiationEnabled) ||
              !!productPayload.IsFixedPriceEnabled) && (
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="Price" style={{ ...textAlignStyle(locale), display: "block" }}>
                    {pathOr("", [locale, "Products", "purchasingPrice"], t)}
                    <RequiredSympol />
                  </label>
                  <div
                    className={`input-group ${styles["input-group"]}  flex-nowrap`}
                    style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}
                  >
                    <span className={`${styles["input-group-text"]} input-group-text main-color f-b`} id="basic-addon1">
                      {pathOr("", [locale, "Products", "currency"], t)}
                    </span>
                    <div className="po_R flex-grow-1">
                      <input
                        id="Price"
                        type="number"
                        onKeyDown={(e) => onlyNumbersInInputs(e)}
                        value={productPayload.Price === 0 ? "" : productPayload.Price}
                        onChange={(e) => setProductPayload({ ...productPayload, Price: +e.target.value })}
                        className={`form-control ${styles["form-control"]}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {productPayload.IsAuctionEnabled && (
              <div className="col-12">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        {pathOr("", [locale, "Products", "auction_start_price"], t)}
                        <RequiredSympol />
                      </label>
                      <div
                        className={`input-group ${styles["input-group"]}  flex-nowrap`}
                        style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}
                      >
                        <span
                          className={`${styles["input-group-text"]} input-group-text main-color f-b`}
                          id="basic-addon1"
                        >
                          {pathOr("", [locale, "Products", "currency"], t)}
                        </span>
                        <div className="po_R flex-grow-1">
                          <input
                            type="number"
                            onKeyDown={(e) => onlyNumbersInInputs(e)}
                            value={productPayload.AuctionStartPrice === 0 ? "" : productPayload.AuctionStartPrice}
                            onChange={(e) =>
                              setProductPayload({ ...productPayload, AuctionStartPrice: +e.target.value })
                            }
                            className={`form-control ${styles["form-control"]}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>
                        {pathOr("", [locale, "Products", "minimum_price"], t)}
                        <RequiredSympol />
                      </label>
                      <div
                        className={`input-group ${styles["input-group"]}  flex-nowrap`}
                        style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}
                      >
                        <span
                          className={`${styles["input-group-text"]} input-group-text main-color f-b`}
                          id="basic-addon1"
                        >
                          {pathOr("", [locale, "Products", "currency"], t)}
                        </span>
                        <div className="po_R flex-grow-1">
                          <input
                            type="number"
                            onKeyDown={(e) => onlyNumbersInInputs(e)}
                            value={productPayload.AuctionMinimumPrice === 0 ? " " : productPayload.AuctionMinimumPrice}
                            onChange={(e) =>
                              setProductPayload({ ...productPayload, AuctionMinimumPrice: +e.target.value })
                            }
                            className={`form-control ${styles["form-control"]}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="contint_paner">
                  <div className="row">
                    <div className="col-12 d-flex align-items-center justify-content-between flex-wrap mb-4 px-3">
                      <span className="f-b fs-5">
                        {pathOr("", [locale, "Products", "auto_send_negotiation_offers_post_auction"], t)}
                      </span>
                      <div className="form-check form-switch p-0 m-0">
                        <input
                          className="form-check-input m-0"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckChecked"
                          checked={productPayload.SendOfferForAuction}
                          onChange={() => handleSendNegotiationOffer()}
                        />
                      </div>
                    </div>
                  </div>
                  {productPayload.SendOfferForAuction && (
                    <>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              {pathOr("", [locale, "Products", "negotiation_price"], t)}
                              <RequiredSympol />
                            </label>
                            <div
                              className={`input-group ${styles["input-group"]} flex-nowrap`}
                              style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}
                            >
                              <span
                                className={`${styles["input-group-text"]} input-group-text main-color f-b`}
                                id="basic-addon1"
                              >
                                {pathOr("", [locale, "Products", "currency"], t)}
                              </span>
                              <div className="po_R flex-grow-1">
                                <input
                                  type="number"
                                  className={`form-control ${styles["form-control"]}`}
                                  onKeyDown={(e) => onlyNumbersInInputs(e)}
                                  value={
                                    productPayload.AuctionNegotiatePrice === 0
                                      ? ""
                                      : productPayload.AuctionNegotiatePrice
                                  }
                                  onChange={(e) =>
                                    setProductPayload({ ...productPayload, AuctionNegotiatePrice: +e.target.value })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label style={{ ...textAlignStyle(locale), display: "block" }}>
                            {pathOr("", [locale, "Products", "who_to_send_offer"], t)}
                            <RequiredSympol />
                          </label>
                          <div className="d-flex gap-3 flex-wrap">
                            <div
                              onClick={() => setProductPayload({ ...productPayload, AuctionNegotiateForWhom: "All" })}
                              className={`${styles.p_select} ${
                                productPayload.AuctionNegotiateForWhom == "All" ? styles.p_select_active : ""
                              }`}
                            >
                              {pathOr("", [locale, "Products", "all_bidders"], t)}
                            </div>
                            <div
                              onClick={() =>
                                setProductPayload({ ...productPayload, AuctionNegotiateForWhom: "Highest3" })
                              }
                              className={`${styles.p_select} ${
                                productPayload.AuctionNegotiateForWhom == "Highest3" ? styles.p_select_active : ""
                              }`}
                            >
                              {pathOr("", [locale, "Products", "top_three_bidders"], t)}
                            </div>
                            <div
                              onClick={() =>
                                setProductPayload({ ...productPayload, AuctionNegotiateForWhom: "Favorit" })
                              }
                              className={`${styles.p_select} ${
                                productPayload.AuctionNegotiateForWhom == "Favorit" ? styles.p_select_active : ""
                              }`}
                            >
                              {pathOr("", [locale, "Products", "product_favorites"], t)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {
                    <div className="col-12 d-flex align-items-center justify-content-between flex-wrap mb-2 px-1">
                      <span className="f-b fs-5">
                        {pathOr("", [locale, "Products", "send_account_info_to_winner"], t)}
                      </span>
                      <div className="form-check form-switch p-0 m-0">
                        <input
                          className="form-check-input m-0"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckChecked"
                          checked={productPayload.SendYourAccountInfoToAuctionWinner}
                          onChange={(e) =>
                            setProductPayload((prev) => ({
                              ...prev,
                              SendYourAccountInfoToAuctionWinner: e.target.checked,
                            }))
                          }
                        />
                      </div>
                    </div>
                  }
                </div>
              </div>
            )}
          </Row>
          <Row>
            <div className="col-12">
              <div className="form-group">
                <label style={{ textAlign: locale === "en" ? "left" : undefined, display: "block" }}>
                  {pathOr("", [locale, "Products", "paymentOptions"], t)}
                  <RequiredSympol />
                </label>
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <div className="form-control outer-check-input">
                        <div className="form-check form-switch p-0 m-0">
                          <input
                            className="form-check-input m-0"
                            type="checkbox"
                            role="switch"
                            id="cash"
                            checked={productPayload.PaymentOptions?.includes(1) ? true : false}
                            onChange={() => paymentOptionsHandler(1)}
                          />
                          <label htmlFor="cash">{pathOr("", [locale, "Products", "cash"], t)}</label>
                          <span className="bord" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <div className="form-control outer-check-input">
                        <div className="form-check form-switch p-0 m-0">
                          <input
                            className="form-check-input m-0"
                            type="checkbox"
                            role="switch"
                            id="bankTransfer"
                            checked={productPayload.PaymentOptions?.includes(2) ? true : false}
                            onChange={() => paymentOptionsHandler(2)}
                            onClick={() => setShowBanksData(true)}
                          />
                          <label htmlFor="bankTransfer">{pathOr("", [locale, "Products", "bankTransfer"], t)}</label>
                          <span className="bord" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {showBanksData && (
                  <BanksData
                    data={userBanksData}
                    setShowBanksData={setShowBanksData}
                    productPayload={productPayload}
                    setProductPayload={setProductPayload}
                  />
                )}
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <div className="form-control outer-check-input">
                        <div className="form-check form-switch p-0 m-0">
                          <input
                            className="form-check-input m-0"
                            type="checkbox"
                            role="switch"
                            checked={true}
                            disabled
                            readOnly
                          />
                          <label>{pathOr("", [locale, "Products", "creditCard"], t)}</label>
                          <span className="bord" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <div className="form-control outer-check-input">
                        <div className="form-check form-switch p-0 m-0">
                          <input
                            className="form-check-input m-0"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                            checked={true}
                            disabled
                            readOnly
                          />
                          <label>{pathOr("", [locale, "Products", "mada"], t)}</label>
                          <span className="bord" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </form>
      </div>
      <button
        className="btn-main mt-3"
        type="button"
        onClick={() => validateSaleDetails() === true && setEventKey("4")}
      >
        {pathOr("", [locale, "Products", "next"], t)}
      </button>
    </Accordion.Body>
  )
}

export default SaleDetails

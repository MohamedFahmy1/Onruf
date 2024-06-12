import { pathOr } from "ramda"
import { Accordion, Row } from "react-bootstrap"
import { Fragment } from "react"
import styles from "./stepTwo.module.css"
import { useRouter } from "next/router"
import { textAlignStyle } from "../../../../styles/stylesObjects"
import t from "../../../../translations.json"
import { useFetch } from "../../../../hooks/useFetch"
import AuctionClosingTimeComp from "./AuctionClosingTimeComp"

const ShippingAndDuration = ({
  productPayload,
  setProductPayload,
  validateAll,
  validateDurationAndShipping,
  setEventKey,
  handleGoToReviewPage,
  selectedCatProps,
}) => {
  const { locale, pathname } = useRouter()
  const { data: shippingOptions } = useFetch("/GetAllShippingOptions")

  const handleShippingOptions = (optionIndex) => {
    const primaryOptions = [1, 2, 3]
    if (primaryOptions.includes(optionIndex)) {
      setProductPayload((prev) => ({
        ...prev,
        ShippingOptions: prev.ShippingOptions.filter((value) => !primaryOptions.includes(value)),
      }))
    }

    // if the shipping option was not selected
    if (!productPayload.ShippingOptions?.includes(optionIndex)) {
      setProductPayload((prev) => ({
        ...prev,
        ShippingOptions: [...prev.ShippingOptions, +optionIndex],
      }))
      // clear all other options if 2 and 3 options not selected in the array
      if (optionIndex === 1) {
        setProductPayload((prev) => ({
          ...prev,
          ShippingOptions: prev.ShippingOptions.filter((value) => value < 4),
        }))
      }
    }
    // if the shipping option is already selected
    else if (productPayload.ShippingOptions?.includes(optionIndex)) {
      setProductPayload((prev) => ({
        ...prev,
        ShippingOptions: prev.ShippingOptions.filter((value) => value !== optionIndex),
      }))
    }
  }

  const RequiredSympol = () => <span style={{ color: "red", fontSize: "1.3rem" }}>*</span>

  return (
    <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
      <div className="form-content">
        <form>
          <Row>
            {productPayload?.IsAuctionEnabled && !pathname.includes("edit") && (
              <Fragment>
                <h5 className="f-b" style={{ ...textAlignStyle(locale), display: "block" }}>
                  {pathOr("", [locale, "Products", "offer_duration"], t)}
                  <RequiredSympol />
                </h5>
                <AuctionClosingTimeComp
                  productPayload={productPayload}
                  setProductPayload={setProductPayload}
                  selectedCatProps={selectedCatProps}
                />
              </Fragment>
            )}
            <div className="col-lg-12 col-md-12">
              <div className="form-group">
                <label style={{ ...textAlignStyle(locale), display: "block" }}>
                  {pathOr("", [locale, "Products", "shippingOptions"], t)}
                  {<RequiredSympol />}
                </label>
                <div className="row">
                  {productPayload.ShippingOptions?.includes(2) || productPayload.ShippingOptions?.includes(3)
                    ? shippingOptions.map((item) => (
                        <div className="col-lg-6 col-md-6" key={item.id}>
                          <div className="form-group">
                            <div
                              className={`${
                                ![1, 2, 3].includes(item.id) ? "orange-border" : ""
                              } form-control outer-check-input`}
                            >
                              <div className="form-check form-switch p-0 m-0">
                                <input
                                  className="form-check-input m-0"
                                  type="checkbox"
                                  role="switch"
                                  id={item.id + " ShippingOptions"}
                                  checked={productPayload.ShippingOptions?.includes(item.id)}
                                  onChange={() => handleShippingOptions(item.id)}
                                />
                                <label htmlFor={item.id + " ShippingOptions"}>{item.shippingOptionName}</label>
                                <span className="bord" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    : shippingOptions
                        ?.filter((value) => value.id == 1 || value.id == 2 || value.id == 3)
                        .map((item) => (
                          <div className="col-lg-6 col-md-6" key={item.id}>
                            <div className="form-group">
                              <div className="form-control outer-check-input">
                                <div className="form-check form-switch p-0 m-0">
                                  <input
                                    className="form-check-input m-0"
                                    type="checkbox"
                                    role="switch"
                                    id={item.id + " ShippingOptions"}
                                    checked={productPayload.ShippingOptions?.includes(item.id)}
                                    onChange={() => handleShippingOptions(item.id)}
                                  />
                                  <label htmlFor={item.id + " ShippingOptions"}>{item.shippingOptionName}</label>
                                  <span className="bord" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                </div>
              </div>
            </div>
          </Row>
        </form>
      </div>
      <button
        className="btn-main mt-3"
        type="button"
        onClick={() => {
          if (pathname.includes("edit")) {
            validateAll() === true && handleGoToReviewPage()
          } else {
            validateDurationAndShipping() === true && setEventKey("5")
          }
        }}
      >
        {pathOr("", [locale, "Products", "next"], t)}
      </button>
    </Accordion.Body>
  )
}

export default ShippingAndDuration

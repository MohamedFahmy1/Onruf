import { pathOr } from "ramda"
import { Accordion, Col, Row } from "react-bootstrap"
import styles from "./stepTwo.module.css"
import { useRouter } from "next/router"
import bigger from "../../../../../public/images/screencaptur.png"
import t from "../../../../translations.json"
import { FaCheckCircle, FaStar } from "react-icons/fa"
import Image from "next/image"

const PublishingPackages = ({
  productPayload,
  setProductPayload,
  setEditModeOn,
  validateAll,
  handleGoToReviewPage,
  selectedPack,
  setselectedPack,
  packat,
  regions,
}) => {
  const { locale, pathname } = useRouter()

  const handleChoosePackat = (pack) => {
    if (productPayload.pakatId) {
      setProductPayload({ ...productPayload, pakatId: null, "ProductPaymentDetailsDto.AdditionalPakatId": 0 })
      setselectedPack(null)
    } else {
      setProductPayload({ ...productPayload, pakatId: pack.id, "ProductPaymentDetailsDto.AdditionalPakatId": pack.id })
      setselectedPack(pack)
    }
  }
  return (
    <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
      <div className="form-content">
        <div>
          <div className="text-center mt-4 mb-5">
            <h4 className="f-b"> {pathOr("", [locale, "Products", "choosepaka"], t)}</h4>
            <h5>{pathOr("", [locale, "Products", "getBenefits"], t)}</h5>
          </div>
          <Row className="justify-content-center">
            <Col lg={9}>
              <div className="row justify-content-center">
                {Boolean(packat?.length) &&
                  packat.map((pack, index) => (
                    <Col md={6} key={pack?.id}>
                      <div
                        className={`${styles["box-Bouquet"]} ${pack.popular ? styles["box-Bouquet-gold"] : ""} ${
                          selectedPack?.id == pack.id ? styles["activePack"] : ""
                        }`}
                        onClick={() => handleChoosePackat(pack)}
                      >
                        <div className={styles["head"]}>
                          <div>{pack.name}</div>
                          <div>
                            {pack.price} {pathOr("", [locale, "Products", "currency"], t)}
                          </div>
                        </div>
                        <ul className={styles["info"]}>
                          {Boolean(pack.countImage) && (
                            <li>
                              <FaStar />
                              {pathOr("", [locale, "Products", "numPics"], t)}: {pack.countImage}
                            </li>
                          )}
                          {Boolean(pack.countVideo) && (
                            <li>
                              <FaStar />
                              {pathOr("", [locale, "Products", "numVideos"], t)}: {pack.countVideo}
                            </li>
                          )}
                          {Boolean(pack.isSms) && (
                            <li>
                              <FaStar />
                              {pathOr("", [locale, "Products", "sendSms"], t)}
                            </li>
                          )}
                          {Boolean(pack.numMonth) && (
                            <li>
                              <FaStar />
                              {pathOr("", [locale, "Products", "numMonth"], t)}: {pack.numMonth}
                            </li>
                          )}
                        </ul>
                        {pack.popular && <aside className={styles["Tinf"]}>شائع</aside>}
                        <input
                          type="radio"
                          name="Bouquet"
                          checked={productPayload.pakatId === +pack?.id}
                          value={+pack?.id}
                          readOnly
                        />
                        <span className={styles["check"]}>
                          <FaCheckCircle />
                        </span>
                        <span className={styles["pord"]} />
                      </div>
                    </Col>
                  ))}
              </div>
            </Col>
          </Row>
          {selectedPack?.productSize === 1 && (
            <div className="mt-4">
              <h5 className="mb-3 f-b text-center">{pathOr("", [locale, "Products", "findChange"], t)}</h5>
              <Row className="align-items-center">
                <Col md={5}>
                  <div className={styles["box-product"]}>
                    <div className={styles["imge"]}>
                      <Image
                        src={
                          productPayload.listMedia?.find((item) => item.isMainMadia === true)?.url ||
                          URL.createObjectURL(productPayload.listImageFile[0])
                        }
                        alt="product"
                        width={400}
                        height={200}
                      />
                      <div className={styles["two_btn_"]}>
                        <button className={styles["btn_"]}>{pathOr("", [locale, "Products", "merchant"], t)}</button>
                        <button className={styles["btn_"]}>
                          {pathOr("", [locale, "Products", "freeDelivery"], t)}
                        </button>
                      </div>
                      {productPayload.AuctionClosingTime &&
                        new Date(productPayload.AuctionClosingTime) - new Date() > 0 && (
                          <div className={styles["time"]}>
                            <div>
                              <span>
                                {Math.floor(
                                  (new Date(productPayload.AuctionClosingTime) - new Date()) / (1000 * 60 * 60 * 24),
                                )}
                              </span>{" "}
                              Day
                            </div>
                            <div>
                              <span>
                                {Math.floor(
                                  ((new Date(productPayload.AuctionClosingTime) - new Date()) % (1000 * 60 * 60 * 24)) /
                                    (1000 * 60 * 60),
                                )}
                              </span>{" "}
                              Hour
                            </div>
                            <div>
                              <span>
                                {Math.floor(
                                  ((new Date(productPayload.AuctionClosingTime) - new Date()) % (1000 * 60 * 60)) /
                                    (1000 * 60),
                                )}
                              </span>{" "}
                              min
                            </div>
                          </div>
                        )}
                      <button className={styles["btn-star"]}>
                        <FaStar />
                      </button>
                    </div>
                    <div className={styles["info"]}>
                      <div className="mb-3">
                        <h5 className="f-b mb-1">{productPayload?.nameAr}</h5>
                        <div className="font-18 gray-color">
                          {regions?.find((item) => +item.id === +productPayload?.regionId)?.name} -{" "}
                          {new Date().toLocaleDateString()}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="font-18">
                            <div>{pathOr("", [locale, "Products", "purchasingPrice"], t)}</div>
                            <div className="f-b main-color">
                              {productPayload?.Price} {pathOr("", [locale, "Products", "currency"], t)}
                            </div>
                          </div>
                        </div>
                        {productPayload?.HighestBidPrice && (
                          <div className="col-md-6">
                            <div className="font-18">
                              <div>{pathOr("", [locale, "Products", "highestPrice"], t)}</div>
                              <div className="f-b">
                                {productPayload?.HighestBidPrice} {pathOr("", [locale, "Products", "currency"], t)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={2}>
                  <div className="text-center mt-3">
                    <Image src={bigger} className="img-fluid" alt="bigger" width={130} height={180} />
                  </div>
                </Col>
                <Col md={5} lg={4}>
                  <div className={`${styles["box-product"]} ${styles["box-product2"]}`}>
                    <div className={styles["imge"]}>
                      <Image
                        src={
                          productPayload.listMedia?.find((item) => item.isMainMadia === true)?.url ||
                          URL.createObjectURL(productPayload?.listImageFile?.[0])
                        }
                        alt="product"
                        width={300}
                        height={200}
                      />
                      <div className={styles["two_btn_"]}>
                        <button className={styles["btn_"]}>{pathOr("", [locale, "Products", "merchant"], t)}</button>
                        <button className={styles["btn_"]}>
                          {pathOr("", [locale, "Products", "freeDelivery"], t)}
                        </button>
                      </div>
                      {productPayload.AuctionClosingTime &&
                        new Date(productPayload.AuctionClosingTime) - new Date() > 0 && (
                          <div className={styles["time"]}>
                            <div>
                              <span>
                                {Math.floor(
                                  (new Date(productPayload.AuctionClosingTime) - new Date()) / (1000 * 60 * 60 * 24),
                                )}
                              </span>{" "}
                              Day
                            </div>
                            <div>
                              <span>
                                {Math.floor(
                                  ((new Date(productPayload.AuctionClosingTime) - new Date()) % (1000 * 60 * 60 * 24)) /
                                    (1000 * 60 * 60),
                                )}
                              </span>{" "}
                              Hour
                            </div>
                            <div>
                              <span>
                                {Math.floor(
                                  ((new Date(productPayload.AuctionClosingTime) - new Date()) % (1000 * 60 * 60)) /
                                    (1000 * 60),
                                )}
                              </span>{" "}
                              min
                            </div>
                          </div>
                        )}
                      <button className={styles["btn-star"]}>
                        <FaStar />
                      </button>
                    </div>
                    <div className={styles["info"]}>
                      <div className="mb-3">
                        <h5 className="f-b mb-1">{productPayload?.nameAr}</h5>
                        <div className="font-18 gray-color">
                          {regions?.find((item) => +item.id === +productPayload?.regionId)?.name} -{" "}
                          {new Date().toLocaleDateString()}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="font-18">
                            <div>{pathOr("", [locale, "Products", "purchasingPrice"], t)}</div>
                            <div className="f-b main-color">
                              {productPayload?.Price} {pathOr("", [locale, "Products", "currency"], t)}
                            </div>
                          </div>
                        </div>
                        {productPayload?.HighestBidPrice && (
                          <div className="col-md-6">
                            <div className="font-18">
                              <div>{pathOr("", [locale, "Products", "highestPrice"], t)}</div>
                              <div className="f-b">
                                {productPayload?.HighestBidPrice} {pathOr("", [locale, "Products", "currency"], t)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </div>
      </div>
      <button
        className="btn-main mt-3"
        style={{ display: "block", margin: "0 auto" }}
        type="button"
        onClick={() => {
          if (validateAll() === true) {
            handleGoToReviewPage()
            pathname.includes("add") && setEditModeOn(true)
          }
        }}
      >
        {pathOr("", [locale, "Products", "next"], t)}
      </button>
    </Accordion.Body>
  )
}

export default PublishingPackages

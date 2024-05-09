import { Fragment, useCallback, useEffect, useState } from "react"
import styles from "./productReview.module.css"
import { useRouter } from "next/router"
import { Row, Col } from "react-bootstrap"
import dateImage from "../../../../../public/icons/Copyright_expiry.svg"
import { FaCheckCircle } from "react-icons/fa"
import axios from "axios"
import { toast } from "react-toastify"
import { pathOr } from "ramda"
import t from "../../../../translations.json"
import Image from "next/image"
import moment from "moment/moment"
import { multiFormData } from "../../../../common/axiosHeaders"

const ProductDetails = ({ selectedCatProps, productFullData, handleBack, setProductPayload }) => {
  const { locale, pathname, push } = useRouter()
  const [shippingOptions, setShippingOptions] = useState([])
  const [packageDetails, setPackageDetails] = useState()
  const [couponData, setCouponData] = useState()
  const [couponCode, setCouponCode] = useState("")

  const totalImageFee =
    productFullData?.listImageFile.length > selectedCatProps?.freeProductImagesCount
      ? selectedCatProps?.extraProductImageFee *
        (productFullData?.listImageFile.length - selectedCatProps?.freeProductImagesCount)
      : 0
  const totalVideoFee =
    productFullData?.videoUrl?.length > selectedCatProps?.freeProductVidoesCount
      ? selectedCatProps?.extraProductVidoeFee *
        (productFullData?.videoUrl?.length - selectedCatProps?.freeProductVidoesCount)
      : 0
  const auctionFee = productFullData?.IsAuctionEnabled ? selectedCatProps?.enableAuctionFee : 0
  const negotiationFee = productFullData?.IsNegotiationEnabled ? selectedCatProps?.enableNegotiationFee : 0
  const fixedFee = productFullData?.IsFixedPriceEnabled ? selectedCatProps?.enableFixedPriceSaleFee : 0
  const pakaFee = productFullData?.pakatId ? packageDetails?.price : 0
  const couponDiscount = couponData ? couponData.discountValue : 0
  const totalCost =
    +selectedCatProps?.productPublishPrice +
    +selectedCatProps?.subTitleFee +
    +totalImageFee +
    +totalVideoFee +
    +auctionFee +
    +negotiationFee +
    +fixedFee +
    +pakaFee -
    +couponDiscount
  const aditionalImagesFee =
    selectedCatProps?.extraProductImageFee *
    (productFullData.listImageFile.length - selectedCatProps?.freeProductImagesCount)
  const aditionalVideoFee =
    selectedCatProps?.extraProductVidoeFee *
    (productFullData.videoUrl.length - selectedCatProps?.freeProductVidoesCount)
  const taxValue = (totalCost * (12 / 100)).toFixed(2)

  const getShippingOptions = useCallback(async () => {
    const data = await axios.get(`/GetAllShippingOptions`)
    const shippingNames = (data?.data?.data).filter((item) => productFullData.ShippingOptions.includes(item.id))
    setShippingOptions(shippingNames)
  }, [productFullData.ShippingOptions])

  const getPackage = useCallback(async () => {
    if (productFullData.pakatId || productFullData["ProductPaymentDetailsDto.AdditionalPakatId"]) {
      const data = await axios.get(
        `/GetPakaById?Pakatid=${
          productFullData.pakatId || productFullData["ProductPaymentDetailsDto.AdditionalPakatId"]
        }
      `,
      )
      setPackageDetails(data?.data?.data)
    }
  }, [productFullData])

  const applyCoupon = async () => {
    try {
      const res = await axios.get(`/GetCouponByCode?couponCode=${couponCode}&couponScreen=1`)
      const couponData = res?.data?.data.coupon
      setCouponData(couponData)
      toast.success(locale === "en" ? "Coupon applied successfully!" : "تم تطبيق الكوبون بنجاح")
      setProductPayload((prev) => ({
        ...prev,
        "ProductPaymentDetailsDto.CouponId": couponData.id,
        "ProductPaymentDetailsDto.CouponDiscountValue": couponData.discountValue,
        "ProductPaymentDetailsDto.TotalAmountBeforeCoupon": totalCost,
        "ProductPaymentDetailsDto.TotalAmountAfterCoupon": totalCost - couponData.discountValue,
      }))
    } catch (err) {
      if (err.response.status === 400) {
        const message =
          locale === "en"
            ? "Coupon has expired, please enter another valid coupon."
            : "انتهت صلاحية الكوبون، الرجاء إدخال كوبون آخر صالح."
        return toast.error(message)
      } else toast.error(locale === "en" ? "Please enter correct coupon!" : "من فضلك ادخل الكوبون بشكل صحيح")
    }
  }
  useEffect(() => {
    productFullData.ShippingOptions.length > 0 && getShippingOptions()
  }, [productFullData.ShippingOptions, getShippingOptions])

  useEffect(() => {
    productFullData.pakatId && getPackage()
  }, [productFullData.pakatId, getPackage])

  useEffect(() => {
    setProductPayload((prev) => ({
      ...prev,
      "ProductPaymentDetailsDto.TotalAmountBeforeCoupon": couponData?.discountValue
        ? totalCost + couponData?.discountValue
        : totalCost,
      "ProductPaymentDetailsDto.TotalAmountAfterCoupon": totalCost,
    }))
  }, [totalCost, setProductPayload, couponData?.discountValue])

  const handleSubmit = async (e) => {
    e.preventDefault()
    let formData = new FormData()
    productFullData.listImageFile.forEach((ele, indx) => {
      ele.id === productFullData.MainImageIndex && indx !== 0 && productFullData.listImageFile.move(indx, 0)
    })
    pathname.includes("edit") && formData.append("EditOrRepost", 1)
    pathname.includes("repost") && formData.append("EditOrRepost", 2)
    for (let key in productFullData) {
      const value = productFullData[key]
      if (key === "listImageFile") {
        for (const image of value) {
          formData.append("listImageFile", image)
        }
      }
      // if any value is empty don't send it to the api // and don't send productImage & listMedia
      else if (value === "" || value === null || key === "productImage" || key === "listMedia") {
        continue
      } else if (key === "productSep") {
        formData.append(key, JSON.stringify(value))
      } else if (Array.isArray(value)) {
        if (key == "ShippingOptions") {
          value.forEach((item) => {
            formData.append(key, Number(item))
          })
        }
        // if array is empty don't send it to the api
        else if (value[0] === "") {
          continue
        } else
          value.forEach((item) => {
            formData.append(key, item)
          })
      } else {
        formData.append(key, value)
      }
    }
    if (pathname.includes("add")) {
      try {
        await axios.post("/AddProduct", formData, multiFormData)
        toast.success(locale === "en" ? "Products has been created successfully!" : "تم اضافة المنتج بنجاح")
        push(`/${locale}/products`)
      } catch (error) {
        toast.error(
          locale === "en"
            ? "Error Please recheck the data you entered!"
            : "حدث خطأ برجاء مراجعة البيانات و اعادة المحاولة",
        )
      }
    } else {
      try {
        await axios.post("/EditProduct", formData, multiFormData)
        toast.success(locale === "en" ? "Products has been created successfully!" : "تم اضافة المنتج بنجاح")
        push(`/${locale}/products`)
      } catch (error) {
        toast.error(
          locale === "en"
            ? "Error Please recheck the data you entered!"
            : "حدث خطأ برجاء مراجعة البيانات و اعادة المحاولة",
        )
      }
    }
  }
  // Determine the main image in the edit & repost section
  let imageSrc
  if (!pathname.includes("add")) {
    const numberOfOldImages = productFullData.listMedia?.filter((item) => item.type === 1)
    const indexOfNewAddedImage = productFullData.MainImageIndex - numberOfOldImages?.length
    if (productFullData.listImageFile?.length > 0) {
      productFullData.MainImageIndex > numberOfOldImages?.length - 1
        ? (imageSrc = URL.createObjectURL(productFullData.listImageFile[indexOfNewAddedImage]))
        : (imageSrc = numberOfOldImages[productFullData.MainImageIndex]?.url)
    } else {
      imageSrc = numberOfOldImages[productFullData.MainImageIndex]?.url
    }
  }

  return (
    <div className="body-content">
      <Row>
        <Col lg={9}>
          <div className="contint_paner">
            <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
              <h6 className="f-b fs-4 m-0">{pathOr("", [locale, "Products", "productDetails"], t)}</h6>
              <button>
                <p className="f-b fs-5 main-color" onClick={() => handleBack()}>
                  {pathOr("", [locale, "Products", "editFolder"], t)}
                </p>
              </button>
            </div>
            <Row className="align-items-center">
              <Col lg={6}>
                <div className="d-flex align-items-center gap-1">
                  {productFullData.productImage && !pathname.includes("add") && (
                    <div style={{ position: "relative", width: "106px", height: "100px" }}>
                      <Image
                        src={imageSrc}
                        className="img_table"
                        alt="product"
                        priority
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  )}
                  {pathname.includes("add") && (
                    <div style={{ position: "relative", width: "106px", height: "100px" }}>
                      <Image
                        src={URL.createObjectURL(productFullData.listImageFile[productFullData.MainImageIndex])}
                        className="img_table"
                        alt="product"
                        priority
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                  )}
                  <div className="mx-3">
                    <div className="gray-color">{selectedCatProps?.name}</div>
                    <div className="f-b">{locale == "en" ? productFullData?.nameEn : productFullData?.nameAr}</div>
                    <div className="gray-color">
                      {locale == "en" ? productFullData?.subTitleEn : productFullData?.subTitleAr}
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div>
                  <div className={styles["info_boxo_"]}>
                    <span>{pathOr("", [locale, "Products", "itemStatus"], t)}</span>
                    <span>
                      {productFullData && productFullData.status === 1
                        ? pathOr("", [locale, "Products", "used"], t)
                        : pathOr("", [locale, "Products", "new"], t)}
                    </span>
                  </div>
                  <div className={styles["info_boxo_"]}>
                    <span>{pathOr("", [locale, "Products", "quantity"], t)}</span>
                    <span>
                      {productFullData && productFullData.qty === 1
                        ? pathOr("", [locale, "Home", "singleProduct"], t)
                        : productFullData.qty
                        ? `${productFullData.qty} ${pathOr("", [locale, "Home", "products"], t)}`
                        : pathOr("", [locale, "Products", "unLimited"], t)}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
            <p className="mt-4">
              {productFullData && (locale == "en" ? productFullData?.descriptionEn : productFullData?.descriptionAr)}
            </p>
          </div>
          <div className="contint_paner">
            <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
              <h6 className="f-b fs-4 m-0">{pathOr("", [locale, "Products", "sellingDetails"], t)}</h6>
              <button>
                <p className="f-b fs-5 main-color" onClick={() => handleBack()}>
                  {pathOr("", [locale, "Products", "editFolder"], t)}
                </p>
              </button>
            </div>
            <Row>
              <Col md={6}>
                <div className={styles["info_boxo_"]}>
                  <span>{pathOr("", [locale, "Products", "salesType"], t)}</span>
                  <div className="d-flex gap-2">
                    {Boolean(productFullData && productFullData.IsNegotiationEnabled) && (
                      <span>
                        {pathOr("", [locale, "Products", "negotiation"], t)}
                        <span className="font-18 main-color mx-1">
                          <FaCheckCircle />
                        </span>
                      </span>
                    )}
                    {Boolean(productFullData && productFullData.IsFixedPriceEnabled) && (
                      <span>
                        {pathOr("", [locale, "Products", "fixed"], t)}
                        <span className="font-18 main-color mx-1">
                          <FaCheckCircle />
                        </span>
                      </span>
                    )}
                    {Boolean(productFullData && productFullData.IsAuctionEnabled) && (
                      <span>
                        {pathOr("", [locale, "Products", "adAuct"], t)}
                        <span className="font-18 main-color mx-1">
                          <FaCheckCircle />
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className={styles["info_boxo_"]}>
                  <span>
                    <p>{pathOr("", [locale, "Products", "purchasingPrice"], t)}</p>
                  </span>
                  <span>
                    {productFullData && productFullData?.Price} {pathOr("", [locale, "Products", "currency"], t)}
                  </span>
                </div>
              </Col>
              {Boolean(productFullData && productFullData.IsAuctionEnabled) && (
                <Fragment>
                  <Col md={6}>
                    <div className={styles["info_boxo_"]}>
                      <span>
                        <p>{pathOr("", [locale, "Products", "minimum_price"], t)}</p>
                      </span>
                      <span>
                        {productFullData && productFullData?.AuctionMinimumPrice}{" "}
                        {pathOr("", [locale, "Products", "currency"], t)}
                      </span>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className={styles["info_boxo_"]}>
                      <span>
                        <p>{pathOr("", [locale, "Products", "auction_start_price"], t)}</p>
                      </span>
                      <span>
                        {productFullData && productFullData?.AuctionStartPrice}{" "}
                        {pathOr("", [locale, "Products", "currency"], t)}
                      </span>
                    </div>
                  </Col>
                </Fragment>
              )}
              <Col md={12}>
                <div className={styles["info_boxo_"]}>
                  <span>
                    <p>{pathOr("", [locale, "Products", "paymentOptions"], t)}</p>
                  </span>
                  <span>
                    <div className="d-flex gap-2">
                      {Boolean(productFullData && productFullData.PaymentOptions.includes(1)) && (
                        <span>
                          {pathOr("", [locale, "Products", "cash"], t)}
                          <span className="font-18 main-color mx-1">
                            <FaCheckCircle />
                          </span>
                        </span>
                      )}
                      {Boolean(productFullData && productFullData.PaymentOptions.includes(2)) && (
                        <span>
                          {pathOr("", [locale, "Products", "bankTransfer"], t)}
                          <span className="font-18 main-color mx-1">
                            <FaCheckCircle />
                          </span>
                        </span>
                      )}
                      {Boolean(productFullData && productFullData.PaymentOptions.includes(3)) && (
                        <span>
                          {pathOr("", [locale, "Products", "creditCard"], t)}
                          <span className="font-18 main-color mx-1">
                            <FaCheckCircle />
                          </span>
                        </span>
                      )}
                      {Boolean(productFullData && productFullData.PaymentOptions.includes(4)) && (
                        <span>
                          {pathOr("", [locale, "Products", "mada"], t)}
                          <span className="font-18 main-color mx-1">
                            <FaCheckCircle />
                          </span>
                        </span>
                      )}
                    </div>
                  </span>
                </div>
              </Col>
            </Row>
          </div>
          {packageDetails && (
            <div className="contint_paner">
              <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
                <h6 className="f-b fs-4  m-0">{pathOr("", [locale, "Products", "selected_package"], t)}</h6>
                <button>
                  <p className="f-b fs-5 main-color" onClick={() => handleBack()}>
                    {pathOr("", [locale, "Products", "editFolder"], t)}
                  </p>
                </button>
              </div>
              <div className={styles["info_boxo_"]}>
                <span>{productFullData && (locale == "en" ? packageDetails?.nameEn : packageDetails?.nameAr)}</span>
                <span className="font-18 main-color">
                  <FaCheckCircle />
                </span>
              </div>
            </div>
          )}
          <div className="contint_paner">
            <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
              <h6 className="f-b fs-4 m-0">{pathOr("", [locale, "Products", "shippingAndDuration"], t)}</h6>
              <button>
                <p className="f-b fs-5 main-color" onClick={() => handleBack()}>
                  {pathOr("", [locale, "Products", "editFolder"], t)}
                </p>
              </button>
            </div>
            {productFullData.IsAuctionEnabled && (
              <Row>
                <h6 className="f-b m-0">{pathOr("", [locale, "Products", "offer_duration"], t)}</h6>
                <div className={styles["info_boxo_"]}>
                  <span>{productFullData && moment(productFullData.AuctionClosingTime).format("LLL")}</span>
                  <span className="font-18 main-color">
                    <Image src={dateImage} alt="calendar" width={20} height={20} />
                  </span>
                </div>
              </Row>
            )}
            <Row>
              <h6 className="f-b m-0">{pathOr("", [locale, "Products", "shippingOptions"], t)}</h6>
              {shippingOptions?.map((item) => (
                <Col md={6} key={item.id}>
                  <div className={styles["info_boxo_"]} key={item.id}>
                    <span>{productFullData && item.shippingOptionName}</span>
                    <span className="font-18 main-color">
                      <FaCheckCircle />
                    </span>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
        <Col lg={3}>
          <div className="contint_paner p-2">
            {!pathname.includes("edit") && (
              <div className={styles["Payment-details"]}>
                <div className="f-b mb-2">{pathOr("", [locale, "Products", "have_discount_coupon"], t)} </div>
                <div className={`po_R overflow-hidden mb-3 ${styles["search_P"]}`}>
                  <input
                    type="text"
                    className={`form-control ${styles["form-control"]}`}
                    placeholder={pathOr("", [locale, "Products", "enter_coupon"], t)}
                    onChange={(e) => setCouponCode(e.target.value)}
                    value={couponCode}
                  />
                  <button
                    onClick={applyCoupon}
                    className={`btn-main ${styles["btn-main"]}`}
                    style={{ right: locale === "en" ? "0" : undefined, left: locale === "en" ? undefined : 0 }}
                  >
                    {pathOr("", [locale, "Products", "activate"], t)}
                  </button>
                </div>
                <ul className={styles["list_salary"]}>
                  {selectedCatProps?.productPublishPrice > 0 && (
                    <li>
                      <span>{pathOr("", [locale, "Products", "publishing_price"], t)}</span>{" "}
                      <span>
                        {selectedCatProps?.productPublishPrice} {pathOr("", [locale, "Products", "currency"], t)}
                      </span>
                    </li>
                  )}
                  {couponData && (
                    <li>
                      <span>{pathOr("", [locale, "Products", "couponCode"], t)}</span> <span>{couponCode}</span>
                    </li>
                  )}
                  {selectedCatProps?.productPublishPrice > 0 && (
                    <li>
                      <span>{pathOr("", [locale, "Products", "subtitle_fee"], t)}</span>{" "}
                      <span>
                        {selectedCatProps?.subTitleFee} {pathOr("", [locale, "Products", "currency"], t)}
                      </span>
                    </li>
                  )}
                  {!!(productFullData.listImageFile.length > selectedCatProps?.freeProductImagesCount) &&
                    !!(aditionalImagesFee > 0) && (
                      <li>
                        <span>{pathOr("", [locale, "Products", "additional_product_images_fee"], t)}</span>{" "}
                        <span>
                          {aditionalImagesFee} {pathOr("", [locale, "Products", "currency"], t)}
                        </span>
                      </li>
                    )}
                  {!!(productFullData.videoUrl?.length > selectedCatProps?.freeProductVidoesCount) &&
                    !!(aditionalVideoFee > 0) && (
                      <li>
                        <span>{pathOr("", [locale, "Products", "additional_product_videos_fee"], t)}</span>{" "}
                        <span>
                          {aditionalVideoFee} {pathOr("", [locale, "Products", "currency"], t)}
                        </span>
                      </li>
                    )}
                  {productFullData.IsAuctionEnabled && (
                    <li>
                      <span>{pathOr("", [locale, "Products", "auction_fee"], t)}</span>{" "}
                      <span>
                        {selectedCatProps?.enableAuctionFee} {pathOr("", [locale, "Products", "currency"], t)}
                      </span>
                    </li>
                  )}
                  {productFullData.IsNegotiationEnabled && (
                    <li>
                      <span>{pathOr("", [locale, "Products", "negotiation_fee"], t)}</span>{" "}
                      <span>
                        {selectedCatProps?.enableNegotiationFee} {pathOr("", [locale, "Products", "currency"], t)}
                      </span>
                    </li>
                  )}
                  {productFullData.IsFixedPriceEnabled && selectedCatProps?.enableFixedPriceSaleFee > 0 && (
                    <li>
                      <span>{pathOr("", [locale, "Products", "fixed_price_selling_fee"], t)}</span>{" "}
                      <span>
                        {selectedCatProps?.enableFixedPriceSaleFee} {pathOr("", [locale, "Products", "currency"], t)}
                      </span>
                    </li>
                  )}
                  {productFullData.pakatId && (
                    <li>
                      <span>{pathOr("", [locale, "Products", "package_price"], t)}</span>{" "}
                      <span>
                        {packageDetails?.price} {pathOr("", [locale, "Products", "currency"], t)}
                      </span>
                    </li>
                  )}
                  {couponData && (
                    <li>
                      <span>{pathOr("", [locale, "Products", "coupon_discount"], t)}</span>{" "}
                      <span>
                        {"-"}
                        {couponData.discountValue} {pathOr("", [locale, "Products", "currency"], t)}
                      </span>
                    </li>
                  )}
                  {taxValue > 0 && (
                    <li>
                      <span>{pathOr("", [locale, "Products", "tax"], t)}</span>{" "}
                      <span>
                        {totalCost < 0 ? 0 : taxValue} {pathOr("", [locale, "Products", "currency"], t)}
                      </span>
                    </li>
                  )}
                  <li>
                    <span>{pathOr("", [locale, "Orders", "total"], t)}</span>{" "}
                    <span>
                      {couponData && (
                        <span style={{ textDecoration: couponData ? "line-through" : undefined }}>
                          {totalCost + couponDiscount} {pathOr("", [locale, "Products", "currency"], t)}
                        </span>
                      )}{" "}
                      {totalCost && <span>{totalCost <= 0 ? 0 : totalCost}</span>}{" "}
                      {pathOr("", [locale, "Products", "currency"], t)}
                    </span>
                  </li>
                </ul>
                <hr />
                {/*<div className="f-b mb-2">طرق الدفع</div>
                <div className="payment-methods">
                  <label className={`${styles["method_check"]}, ${styles["method_check1"]}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "Cash" ? true : false}
                      onClick={() => setPaymentMethod("Cash")}
                    />
                    <span className={styles["bord"]} />
                    <span>Cash </span>
                  </label>
                  <label className="method_check">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "Online" ? true : false}
                      onClick={() => setPaymentMethod("Online")}
                    />
                    <span className={styles["bord"]} />
                    <span className="mx-2">Online</span>
                  </label>
                  <label className="method_check">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "Banking Transfer" ? true : false}
                      onClick={() => setPaymentMethod("Banking Transfer")}
                    />
                    <span className={styles["bord"]} />
                    <span className="mx-2">Banking Transfer</span>
                  </label>
                </div>*/}
              </div>
            )}
            <button
              className={`${styles["btn-main"]} btn-main mt-2 w-100`}
              data-bs-toggle="modal"
              data-bs-target="#add-product_"
              onClick={(e) => handleSubmit(e)}
            >
              {pathname.includes("add") && pathOr("", [locale, "Products", "addNewProduct"], t)}
              {pathname.includes("edit") && pathOr("", [locale, "Products", "save"], t)}
              {pathname.includes("repost") && pathOr("", [locale, "Products", "repost_product"], t)}
            </button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ProductDetails

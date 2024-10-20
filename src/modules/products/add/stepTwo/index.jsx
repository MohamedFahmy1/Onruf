import { useState } from "react"
import styles from "./stepTwo.module.css"
import { Accordion } from "react-bootstrap"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../../../translations.json"
import { toast } from "react-toastify"
import ProductImages from "./ProductImages"
import ProductDetails from "./ProductDetails"
import AdDetails from "./AdDetails"
import SaleDetails from "./SaleDetails"
import ShippingAndDuration from "./ShippingAndDuration"
import PublishingPackages from "./PublishingPackages"

const AddProductStepTwo = ({
  catId,
  selectedCatProps,
  handleGoToReviewPage,
  productPayload,
  setProductPayload,
  editModeOn,
  setEditModeOn,
}) => {
  const { locale, pathname } = useRouter()
  const [eventKey, setEventKey] = useState("0")
  const [regions, setRegions] = useState([])

  const toggleAccordionPanel = (eKey) => {
    if (editModeOn) {
      return setEventKey(eKey)
    } else if (eKey > eventKey) {
      return toast.error(
        locale === "en"
          ? "Please enter all necessary data in current section to proceed!"
          : "من فضلك ادخل جميع البيانات اللازمة في القسم الحالي قبل الانتقال الي القسم التالي",
      )
    } else setEventKey(eKey)
  }

  Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0])
  }

  // All Validation Functions
  const validateProductImages = () => {
    if (
      productPayload?.listImageFile.length > 0 &&
      productPayload?.MainImageIndex !== null &&
      // check that videoUrl array doesn't have empty fileds or user didn't enter any then it's accepted
      (productPayload.videoUrl.every((url) => url.trim() !== "") || productPayload.videoUrl.length === 1)
    ) {
      return true
    } else {
      if (productPayload?.listImageFile.length === 0) {
        if (
          !pathname.includes("add") &&
          productPayload?.listMedia?.filter((item) => item.type === 1)?.length > 0 &&
          productPayload?.MainImageIndex !== null
        ) {
          return true
        } else return toast.error(locale === "en" ? "No photo uploaded for the product" : "لايوجد صور للمنتج")
      } else if (productPayload?.MainImageIndex === null) {
        return toast.error(locale === "en" ? "No main photo selected" : "لم يتم اختيار صورة رئيسية")
      } else if (!productPayload.videoUrl.every((url) => url.trim() !== "")) {
        return toast.error(
          locale === "en"
            ? "Please Enter Video Url or Remove the empty field it!"
            : "رجاء أدخل لينك الفيديو او امسح الحقل الفارغ",
        )
      }
    }
  }

  const validateProductDetails = (specifications) => {
    for (let i = 0; i < productPayload.productSep.length; i++) {
      const specId = productPayload.productSep[i].SpecificationId
      const spec = specifications?.find((s) => s?.id === specId)

      if (spec?.isRequired) {
        if (
          productPayload.productSep[i].ValueSpeAr === "" ||
          productPayload.productSep[i].ValueSpeEn === "" ||
          !productPayload.productSep[i].ValueSpeAr ||
          !productPayload.productSep[i].ValueSpeEn
        ) {
          toast.error(locale === "en" ? "Please enter all Product Details!" : "رجاء ادخال جميع بيانات المنتج")
          return false
        }
      }
    }
    return true
  }

  const validateAdDetails = () => {
    if (productPayload.qty <= 0 && productPayload.qty !== null) {
      return toast.error(
        locale === "en" ? "You can't add product with quantity less than 1" : "لا يمكنك اضافة منتج بكمية اقل من 1",
      )
    }
    if (productPayload.status === null || productPayload.status === undefined) {
      return toast.error(locale === "en" ? "Please select Item status" : "من فضلك اختر حالة المنتج")
    }
    if (productPayload.qty < productPayload.AlmostSoldOutQuantity && productPayload.qty !== null) {
      return toast.error(
        locale === "en"
          ? "Quantity of product should be more than almost sold out"
          : "الكميه للمنتج يجب ان تكون اكبر من كمية اوشكت على النفاذ",
      )
    }
    const productDetailsInputs = [
      productPayload.nameAr,
      productPayload.nameEn,
      productPayload.countryId,
      productPayload.regionId,
      productPayload.neighborhoodId,
    ]
    const checkInputIsEmpty = (value) => {
      return value !== null && value !== undefined && value !== "" && value !== 0
    }
    const isInputEmpty = productDetailsInputs.every(checkInputIsEmpty)
    return isInputEmpty === true
      ? true
      : toast.error(
          locale === "en"
            ? "Please add name of the product en & ar and your address"
            : "من فضلك ادخل اسم المنتج بالعربي و الانجليزي و العنوان",
        )
  }

  const validateSaleDetails = () => {
    if (
      // make sure that at least one sale type is selected unless it is a service and all sale types are disabled
      !!(
        !productPayload.IsFixedPriceEnabled &&
        !productPayload.IsAuctionEnabled &&
        !productPayload.IsNegotiationEnabled
      ) &&
      !!(selectedCatProps?.enableAuction || selectedCatProps?.enableFixedPrice || selectedCatProps?.enableNegotiation)
    ) {
      return toast.error(locale === "en" ? "Please choose sale type!" : "من فضلك حدد نوع البيع")
    } else if (productPayload.IsFixedPriceEnabled && !productPayload.Price) {
      return toast.error(locale === "en" ? "Please enter purchasing price!" : "من فضلك ادخل سعر شراء المنتج")
    } else if (productPayload.IsAuctionEnabled && !productPayload.AuctionMinimumPrice) {
      return toast.error(
        locale === "en"
          ? "Please enter start price and minimum price!"
          : "من فضلك ادخل سعر البداية وسعر الحد الادنى للمزاد",
      )
    } else if (
      productPayload.SendOfferForAuction &&
      (!productPayload.AuctionNegotiatePrice || !productPayload.AuctionNegotiateForWhom)
    ) {
      return toast.error(
        locale === "en" ? "Please enter negotiation price and for whom!" : "!من فضلك ادخل سعر التفاوض ولمن",
      )
    } else return true
  }

  const validateDurationAndShipping = () => {
    // if you choosed shipping options 2 or 3 you must choose highlighted options
    const hasTwoOrThree = productPayload.ShippingOptions.includes(2) || productPayload.ShippingOptions.includes(3)
    const hasHighlighted = productPayload.ShippingOptions.some((id) => id > 3)
    if (hasTwoOrThree && !hasHighlighted) {
      return toast.error(
        locale == "en" ? "Please select the highlighted options!" : "من فضلك اختر وسيلة شحن من الوسايل المحدده اعلاه",
      )
    } else if (productPayload.ShippingOptions.length === 0) {
      return toast.error(locale == "en" ? "Please select any shipping options!" : "من فضلك اختر اي وسيلة شحن")
    } else if (
      (productPayload.AuctionClosingTime === "" || !productPayload.AuctionClosingTime) &&
      productPayload.IsAuctionEnabled
    ) {
      return toast.error(
        locale === "en" ? "Error Please Choose Auction Closing Time!" : "حدث خطأ برجاء تحديد موعد انتهاء المزاد",
      )
    } else return true
  }

  const validateAll = () => {
    if (
      (validateProductImages() &&
        validateProductDetails() &&
        validateAdDetails() &&
        validateSaleDetails() &&
        validateDurationAndShipping()) === true
    ) {
      return true
    } else return false
  }

  console.log("productPayload", productPayload)

  return (
    <Accordion activeKey={eventKey} flush>
      <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="0">
        <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("0")}>
          <span>1</span>
          {pathOr("", [locale, "Products", "productImages"], t)}
        </Accordion.Button>
        <ProductImages
          productPayload={productPayload}
          setProductPayload={setProductPayload}
          validateProductImages={validateProductImages}
          setEventKey={setEventKey}
        />
      </Accordion.Item>

      <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="1">
        <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("1")}>
          <span>2</span>
          {pathOr("", [locale, "Products", "productDetails"], t)}
        </Accordion.Button>
        <ProductDetails
          productPayload={productPayload}
          setProductPayload={setProductPayload}
          editModeOn={editModeOn}
          catId={catId}
          validateProductDetails={validateProductDetails}
          setEventKey={setEventKey}
        />
      </Accordion.Item>

      <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="2">
        <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("2")}>
          <span>3</span>
          {pathOr("", [locale, "Products", "advertisementDetails"], t)}
        </Accordion.Button>
        <AdDetails
          productPayload={productPayload}
          setProductPayload={setProductPayload}
          validateAdDetails={validateAdDetails}
          setEventKey={setEventKey}
          regions={regions}
          setRegions={setRegions}
        />
      </Accordion.Item>

      <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="3">
        <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("3")}>
          <span>4</span>
          {pathOr("", [locale, "Products", "sellingDetails"], t)}
        </Accordion.Button>
        <SaleDetails
          productPayload={productPayload}
          setProductPayload={setProductPayload}
          validateSaleDetails={validateSaleDetails}
          setEventKey={setEventKey}
          selectedCatProps={selectedCatProps}
        />
      </Accordion.Item>

      <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="4">
        <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("4")}>
          <span>5</span>
          {pathOr("", [locale, "Products", "shippingAndDuration"], t)}
        </Accordion.Button>
        <ShippingAndDuration
          productPayload={productPayload}
          setProductPayload={setProductPayload}
          validateAll={validateAll}
          validateDurationAndShipping={validateDurationAndShipping}
          handleGoToReviewPage={handleGoToReviewPage}
          setEventKey={setEventKey}
          selectedCatProps={selectedCatProps}
        />
      </Accordion.Item>

      {!pathname.includes("edit") && (
        <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="5">
          <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("5")}>
            <span>6</span>
            {pathOr("", [locale, "Products", "publishingPackages"], t)}
          </Accordion.Button>
          <PublishingPackages
            productPayload={productPayload}
            setProductPayload={setProductPayload}
            setEditModeOn={setEditModeOn}
            validateAll={validateAll}
            handleGoToReviewPage={handleGoToReviewPage}
            regions={regions}
            catId={catId}
          />
        </Accordion.Item>
      )}
    </Accordion>
  )
}

export default AddProductStepTwo

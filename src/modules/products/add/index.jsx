import { useRouter } from "next/router"
import { useState } from "react"
import AddProductStepOne from "../../../modules/products/add/stepOne"
import AddProductStepTwo from "../../../modules/products/add/stepTwo"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import ProductDetails from "./review/ProductDetails"

const AddProduct = () => {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedCatId, setSelectedCatId] = useState(null)
  const [selectedCatProps, setSelectedCatProps] = useState({})
  const [editModeOn, setEditModeOn] = useState(false)
  const { locale } = useRouter()
  const [productPayload, setProductPayload] = useState({
    nameAr: "",
    nameEn: "",
    subTitleAr: "",
    subTitleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    qty: 1,
    status: null,
    categoryId: selectedCatId,
    countryId: null,
    regionId: null,
    neighborhoodId: null,
    District: "",
    Street: "",
    GovernmentCode: "",
    productSep: [],
    listImageFile: [],
    MainImageIndex: null,
    videoUrl: [""],
    ShippingOptions: [],
    Lat: "30",
    Lon: "30",
    AcceptQuestion: false,
    IsFixedPriceEnabled: false,
    IsAuctionEnabled: false,
    IsNegotiationEnabled: false,
    Price: 0,
    PaymentOptions: [3, 4],
    ProductBankAccounts: [],
    IsCashEnabled: false,
    AuctionStartPrice: 0,
    IsAuctionPaied: false,
    SendOfferForAuction: false,
    AuctionMinimumPrice: 0,
    AuctionNegotiateForWhom: null,
    AuctionNegotiatePrice: 0,
    AuctionClosingTime: "",
    IsAuctionClosingTimeFixed: null,
    "ProductPaymentDetailsDto.CategoryId": 0,
    "ProductPaymentDetailsDto.PakatId": 0,
    "ProductPaymentDetailsDto.AdditionalPakatId": 0,
    "ProductPaymentDetailsDto.ProductPublishPrice": 0,
    "ProductPaymentDetailsDto.EnableFixedPriceSaleFee": 0,
    "ProductPaymentDetailsDto.EnableAuctionFee": 0,
    "ProductPaymentDetailsDto.EnableNegotiationFee": 0,
    "ProductPaymentDetailsDto.FixedPriceSaleFee": 0,
    "ProductPaymentDetailsDto.AuctionFee": 0,
    "ProductPaymentDetailsDto.NegotiationFee": 0,
    "ProductPaymentDetailsDto.ExtraProductImageFee": 0,
    "ProductPaymentDetailsDto.ExtraProductVidoeFee": 0,
    "ProductPaymentDetailsDto.SubTitleFee": 0,
    "ProductPaymentDetailsDto.CouponId": 0,
    "ProductPaymentDetailsDto.CouponDiscountValue": 0,
    "ProductPaymentDetailsDto.TotalAmountBeforeCoupon": 0,
    "ProductPaymentDetailsDto.TotalAmountAfterCoupon": 0,
    "ProductPaymentDetailsDto.PaymentType": "Cash",
    SendYourAccountInfoToAuctionWinner: false,
    AlmostSoldOutQuantity: 1,
  })

  const handleBack = (e) => {
    e.preventDefault()
    step > 1 ? setStep((prev) => prev - 1) : router.push("./")
  }

  const handleNextStep = (selectedCatId) => {
    setStep(2)
    setSelectedCatId(selectedCatId)
  }

  const handleGoToReviewPage = () => {
    setStep(3)
  }
  const handleGoToSteptwo = () => {
    setStep(2)
  }

  return (
    <div className="body-content">
      <div>
        {(step === 1 || step === 2) && (
          <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
            <h1 className="f-b fs-6 m-0">{pathOr("", [locale, "Products", "addNewProduct"], t)}</h1>
            <button
              onClick={handleBack}
              className="btn-main btn-main-o"
              aria-label={pathOr("", [locale, "Products", "cancel"], t)}
            >
              {pathOr("", [locale, "Products", "cancel"], t)}
            </button>
          </div>
        )}
        {step === 1 && (
          <AddProductStepOne
            next={(selectedCat) => handleNextStep(selectedCat)}
            setSelectedCatProps={setSelectedCatProps}
            setProductPayload={setProductPayload}
          />
        )}
        {step === 2 && (
          <AddProductStepTwo
            catId={selectedCatId}
            selectedCatProps={selectedCatProps}
            handleGoToReviewPage={handleGoToReviewPage}
            productPayload={productPayload}
            setProductPayload={setProductPayload}
            editModeOn={editModeOn}
            setEditModeOn={setEditModeOn}
          />
        )}
        {step === 3 && (
          <ProductDetails
            selectedCatProps={selectedCatProps}
            productFullData={productPayload}
            handleBack={handleGoToSteptwo}
            setProductPayload={setProductPayload}
          />
        )}
      </div>
    </div>
  )
}

export default AddProduct

import { useRouter } from "next/router"
import { useState } from "react"
import AddProductStepOne from "../../../modules/products/add/stepOne"
import AddProductStepTwo from "../../../modules/products/add/stepTwo"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import ProductDetails from "../edit/ProductDetails"

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
    status: 1,
    categoryId: selectedCatId,
    countryId: null,
    regionId: null,
    neighborhoodId: null,
    District: "",
    Street: "",
    GovernmentCode: "",
    productSep: [],
    listImageFile: [],
    MainImageIndex: undefined,
    videoUrl: [""],
    ShippingOptions: [],
    Lat: "30",
    Lon: "30",
    AcceptQuestion: false,
    IsFixedPriceEnabled: true,
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
    AuctionNegotiateForWhom: "",
    AuctionNegotiatePrice: 0,
    AuctionClosingTime: "",
    "ProductPaymentDetailsDto.PakatId": 0,
    "ProductPaymentDetailsDto.AdditionalPakatId": 0,
    "ProductPaymentDetailsDto.ProductPublishPrice": 0,
    "ProductPaymentDetailsDto.EnableFixedPriceSaleFee": 0,
    "ProductPaymentDetailsDto.EnableAuctionFee": 0,
    "ProductPaymentDetailsDto.EnableNegotiationFee": 0,
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
            <h6 className="f-b m-0">{pathOr("", [locale, "Products", "addNewProduct"], t)}</h6>
            <a onClick={handleBack} className="btn-main btn-main-o">
              {pathOr("", [locale, "Products", "cancel"], t)}
            </a>
          </div>
        )}
        {step === 1 && (
          <AddProductStepOne
            next={(selectedCat) => handleNextStep(selectedCat)}
            setSelectedCatProps={setSelectedCatProps}
            productPayload={productPayload}
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

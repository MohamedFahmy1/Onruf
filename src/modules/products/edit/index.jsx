import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import AddProductStepTwo from "../../../modules/products/add/stepTwo"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { useFetch } from "../../../hooks/useFetch"
import ProductDetails from "./ProductDetails"

const EditProduct = () => {
  const { locale, query, push } = useRouter()
  const [step, setStep] = useState(1)
  const { data: productData } = useFetch(`/GetProductById?id=${query.id}&lang=${locale}`, true)
  const { data: shippingOptions } = useFetch(`/GetProductShippingOptions?productId=${query.id}`, true)
  const { data: paymentOptions } = useFetch(`/GetProductPaymentOptions?productId=${query.id}`, true)
  const [product, setProduct] = useState()
  const [productPayload, setProductPayload] = useState({
    nameAr: "",
    nameEn: "",
    subTitleAr: "",
    subTitleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    qty: 1,
    status: 1,
    categoryId: null,
    countryId: null,
    regionId: null,
    neighborhoodId: null,
    District: "",
    Street: "",
    GovernmentCode: "",
    pakatId: null,
    productSep: [],
    listImageFile: [],
    MainImageIndex: undefined,
    videoUrl: [""],
    ShippingOptions: [],
    Lat: "0",
    Lon: "0",
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
    SendYourAccountInfoToAuctionWinner: false,
    AlmostSoldOutQuantity: 1,
  })

  const handleBack = () => {
    step > 1 ? setStep((prev) => prev - 1) : setStep((prev) => prev + 1)
  }

  useEffect(() => {
    if (productData && shippingOptions && paymentOptions) {
      setProductPayload((prev) => ({
        ...prev,
        id: query.id,
        nameAr: productData.nameAr,
        nameEn: productData.nameEn,
        subTitleAr: productData.subTitleAr,
        subTitleEn: productData.subTitleEn,
        descriptionAr: productData.descriptionAr,
        descriptionEn: productData.descriptionEn,
        qty: productData.qty,
        status: productData.status,
        categoryId: productData.categoryId,
        countryId: productData.countryId,
        regionId: productData.regionId,
        neighborhoodId: productData.neighborhoodId,
        District: productData.district,
        Street: productData.street,
        GovernmentCode: productData.governmentCode,
        productSep: productData.listProductSep,
        listMedia: productData.listMedia,
        // videoUrl: productData.videoUrl,
        ShippingOptions: shippingOptions.map((item) => item.shippingOptionId),
        Lat: productData.lat,
        Lon: productData.lon,
        AcceptQuestion: productData.acceptQuestion,
        IsFixedPriceEnabled: productData.isFixedPriceEnabled,
        IsAuctionEnabled: productData.isAuctionEnabled,
        IsNegotiationEnabled: productData.isNegotiationEnabled,
        Price: productData.price,
        PaymentOptions: paymentOptions.map((item) => item.paymentOptionId),
        // ProductBankAccounts: productData.productBankAccounts,
        IsCashEnabled: productData.isCashEnabled,
        AuctionStartPrice: productData.auctionStartPrice,
        IsAuctionPaied: productData.isAuctionPaied,
        SendOfferForAuction: productData.sendOfferForAuction,
        AuctionMinimumPrice: productData.auctionMinimumPrice,
        AuctionNegotiateForWhom: productData.auctionNegotiateForWhom,
        AuctionNegotiatePrice: productData.auctionNegotiatePrice,
        AuctionClosingTime: productData.auctionClosingTime,
        SendYourAccountInfoToAuctionWinner: productData.sendYourAccountInfoToAuctionWinner,
        AlmostSoldOutQuantity: productData.almostSoldOutQuantity,
        productImage: productData.productImage,
        "ProductPaymentDetailsDto.ProductPublishPrice": productData?.categoryDto.productPublishPrice,
        "ProductPaymentDetailsDto.EnableFixedPriceSaleFee": productData?.categoryDto.enableFixedPriceSaleFee,
        "ProductPaymentDetailsDto.EnableAuctionFee": productData?.categoryDto.enableAuctionFee,
        "ProductPaymentDetailsDto.EnableNegotiationFee": productData?.categoryDto.enableNegotiationFee,
        "ProductPaymentDetailsDto.ExtraProductImageFee": productData?.categoryDto.extraProductImageFee,
        "ProductPaymentDetailsDto.ExtraProductVidoeFee": productData?.categoryDto.extraProductVidoeFee,
        "ProductPaymentDetailsDto.SubTitleFee": productData?.categoryDto.subTitleFee,
      }))
    }
  }, [productData, locale, shippingOptions, paymentOptions, query.id])
  return (
    <div className="body-content">
      <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
        <h6 className="f-b m-0">{pathOr("", [locale, "Products", "review_product_before_adding"], t)}</h6>
        <button>
          <p onClick={() => push("/products")} className="btn-main btn-main-o">
            {pathOr("", [locale, "Products", "cancel"], t)}
          </p>
        </button>
      </div>
      <div>
        {step === 1 && productData && paymentOptions && shippingOptions && (
          <ProductDetails
            selectedCatProps={{ ...productData?.categoryDto }}
            handleBack={handleBack}
            productFullData={productPayload}
            setProductPayload={setProductPayload}
          />
        )}
        {step === 2 && (
          <AddProductStepTwo
            product={product && product}
            catId={productData?.categoryId}
            selectedCatProps={{ ...productData?.categoryDto }}
            handleGoToReviewPage={handleBack}
            productPayload={productPayload}
            setProductPayload={setProductPayload}
            editModeOn={true}
          />
        )}
      </div>
    </div>
  )
}

export default EditProduct

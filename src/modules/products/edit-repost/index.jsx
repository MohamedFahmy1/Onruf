import { useRouter } from "next/router"
import { useEffect, useState, useRef } from "react"
import AddProductStepTwo from "../add/stepTwo"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { useFetch } from "../../../hooks/useFetch"
import ProductDetails from "../add/review/ProductDetails"
import axios from "axios"
import Alerto from "../../../common/Alerto"

const EditProduct = () => {
  const { locale, query, push } = useRouter()
  const [step, setStep] = useState(1)
  const localeRef = useRef(locale)
  const [selectedCatProps, setSelectedCatProps] = useState()
  const { data: shippingOptions } = useFetch(`/GetProductShippingOptions?productId=${query.id}`, true)
  const { data: paymentOptions } = useFetch(`/GetProductPaymentOptions?productId=${query.id}`, true)
  const { data: bankAccounts } = useFetch(`/GetProductBankAccounts?productId=${query.id}`, true)
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
    productSep: [],
    listImageFile: [],
    MainImageIndex: null,
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
    DeletedMedias: [],
  })

  const handleBack = () => {
    step > 1 ? setStep((prev) => prev - 1) : setStep((prev) => prev + 1)
  }

  useEffect(() => {
    localeRef.current = locale
  }, [locale])

  useEffect(() => {
    const getProductData = async () => {
      try {
        if (query.id) {
          const currentLocale = localeRef.current
          const { data } = await axios(
            `${process.env.NEXT_PUBLIC_API_URL}/GetProductById?id=${query.id}&lang=${currentLocale}`,
          )
          const productData = data.data
          setSelectedCatProps({ ...productData.categoryDto })
          setProductPayload((prev) => ({
            ...prev,
            id: query.id,
            nameAr: productData.nameAr,
            nameEn: productData.nameEn,
            subTitleAr: productData.subTitleAr === "" ? null : productData.subTitleAr,
            subTitleEn: productData.subTitleEn === "" ? null : productData.subTitleEn,
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
            productSep: productData.listProductSep.map((item) => {
              return {
                HeaderSpeAr: item.headerSpeAr,
                HeaderSpeEn: item.headerSpeEn,
                SpecificationId: item.specificationId,
                Type: item.type,
                ValueSpeAr: item.valueSpeAr,
                ValueSpeEn: item.valueSpeEn,
              }
            }),
            listMedia: productData.listMedia,
            MainImageIndex: productData.listMedia.findIndex((item) => item.isMainMadia === true),
            Lat: productData.lat,
            Lon: productData.lon,
            AcceptQuestion: productData.acceptQuestion,
            IsFixedPriceEnabled: productData.isFixedPriceEnabled,
            IsAuctionEnabled: productData.isAuctionEnabled,
            IsNegotiationEnabled: productData.isNegotiationEnabled,
            Price: productData.price,
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
            "ProductPaymentDetailsDto.ProductPublishPrice": productData.categoryDto.productPublishPrice,
            "ProductPaymentDetailsDto.EnableFixedPriceSaleFee": productData.categoryDto.enableFixedPriceSaleFee,
            "ProductPaymentDetailsDto.EnableAuctionFee": productData.categoryDto.enableAuctionFee,
            "ProductPaymentDetailsDto.EnableNegotiationFee": productData.categoryDto.enableNegotiationFee,
            "ProductPaymentDetailsDto.ExtraProductImageFee": productData.categoryDto.extraProductImageFee,
            "ProductPaymentDetailsDto.ExtraProductVidoeFee": productData.categoryDto.extraProductVidoeFee,
            "ProductPaymentDetailsDto.SubTitleFee": productData.categoryDto.subTitleFee,
            "ProductPaymentDetailsDto.AdditionalPakatId": productData.categoryDto.additionalPakatId || null,
            IsAuctionClosingTimeFixed: productData.isAuctionClosingTimeFixed,
          }))
        }
      } catch (error) {
        Alerto(error)
      }
    }
    query.id && getProductData()
  }, [query.id])

  useEffect(() => {
    if (shippingOptions && paymentOptions && bankAccounts) {
      setProductPayload((prev) => ({
        ...prev,
        ShippingOptions: shippingOptions.map((item) => item.shippingOptionId),
        PaymentOptions: paymentOptions.map((item) => item.paymentOptionId),
        ProductBankAccounts: bankAccounts.map((item) => item.bankAccountId),
      }))
    }
  }, [shippingOptions, paymentOptions, query.id, bankAccounts])
  return (
    <div className="body-content">
      <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
        <h6 className="f-b m-0">{pathOr("", [locale, "Products", "review_product_before_adding"], t)}</h6>
        <button>
          <p onClick={() => (step === 1 ? push("/products") : setStep(1))} className="btn-main btn-main-o">
            {pathOr("", [locale, "Products", "cancel"], t)}
          </p>
        </button>
      </div>
      <div>
        {step === 1 && productPayload.listMedia && paymentOptions && shippingOptions && bankAccounts && (
          <ProductDetails
            selectedCatProps={selectedCatProps}
            handleBack={handleBack}
            productFullData={productPayload}
            setProductPayload={setProductPayload}
          />
        )}
        {step === 2 && (
          <AddProductStepTwo
            catId={productPayload.categoryId}
            selectedCatProps={selectedCatProps}
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

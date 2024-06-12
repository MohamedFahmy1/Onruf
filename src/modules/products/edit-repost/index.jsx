import { useRouter } from "next/router"
import { useEffect, useState, useRef, useCallback } from "react"
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
  const [specificationsFromApi, setSpecificationsFromApi] = useState([])
  const { data: shippingOptions } = useFetch(`/GetProductShippingOptions?productId=${query.id}`, true)
  const { data: paymentOptions } = useFetch(`/GetProductPaymentOptions?productId=${query.id}`, true)
  const { data: bankAccounts } = useFetch(`/GetProductBankAccounts?productId=${query.id}`, true)

  const fetchSpecificationsList = useCallback(async () => {
    try {
      const {
        data: { data: spefications },
      } = await axios(
        `/ListAllSpecificationAndSubSpecificationByCatId?lang=${locale}&id=${selectedCatProps.id}&currentPage=1`,
      )
      setProductPayload((prev) => ({
        ...prev,
        productSep: transformProductSepData(specificationsFromApi, spefications),
      }))
    } catch (e) {
      Alerto(e)
    }
  }, [locale, selectedCatProps?.id, specificationsFromApi])

  useEffect(() => {
    selectedCatProps?.id && fetchSpecificationsList()
  }, [fetchSpecificationsList, selectedCatProps?.id])

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
          const { data } = await axios(`/GetProductById?id=${query.id}&lang=${currentLocale}`)
          const productData = data.data
          setSelectedCatProps({ ...productData.categoryDto })
          setSpecificationsFromApi(productData.listProductSep)
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
            "ProductPaymentDetailsDto.FixedPriceSaleFee": productData.categoryDto.enableFixedPriceSaleFee,
            "ProductPaymentDetailsDto.AuctionFee": productData.categoryDto.enableAuctionFee,
            "ProductPaymentDetailsDto.NegotiationFee": productData.categoryDto.enableNegotiationFee,
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

  // tranformation data from back-end to match front-end (They wanted it to be complicated like this :D god help you )
  const transformProductSepData = (dataFromApi, specifications) => {
    let updatedData = dataFromApi.map((item) => {
      return {
        HeaderSpeAr: item.headerSpeAr,
        HeaderSpeEn: item.headerSpeEn,
        SpecificationId: item.specificationId,
        Type: item.type,
        ValueSpeAr: item.valueSpeAr,
        ValueSpeEn: item.valueSpeEn,
      }
    })

    // Group the type 7 values by their SpecificationId
    let combined = {}
    updatedData.forEach((item) => {
      const specId = item.SpecificationId
      if (!combined[specId]) {
        // Create a new entry if it doesn't exist
        combined[specId] = { ...item, ValueSpeAr: [item.ValueSpeAr], ValueSpeEn: [item.ValueSpeEn] }
      } else {
        // Concatenate the values if the entry already exists
        combined[specId].ValueSpeAr.push(item.ValueSpeAr)
        combined[specId].ValueSpeEn.push(item.ValueSpeEn)
      }
    })
    // Convert the values arrays to comma-separated strings
    Object.keys(combined).forEach((key) => {
      combined[key].ValueSpeAr = combined[key].ValueSpeAr.join(",")
      combined[key].ValueSpeEn = combined[key].ValueSpeEn.join(",")
    })
    // Convert the result back to an array
    let combinedArray = Object.values(combined)
    const valueDict = {}
    combinedArray.forEach((item) => {
      valueDict[item.SpecificationId] = item
    })

    // Array to hold the transformed specifications
    const transformedSpecifications = []

    // Iterate over each specification
    specifications.forEach((spec) => {
      const specId = spec.id
      // Check if the current specification has values from the API
      if (valueDict[specId]) {
        // If it has values, use them
        transformedSpecifications.push(valueDict[specId])
      } else {
        // If it doesn't have values, create a new object with empty values
        transformedSpecifications.push({
          HeaderSpeAr: spec.nameAr,
          HeaderSpeEn: spec.nameEn,
          SpecificationId: specId,
          Type: spec.type,
          ValueSpeAr: "",
          ValueSpeEn: "",
        })
      }
    })

    return transformedSpecifications
  }

  return (
    <article className="body-content">
      <section className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
        <h6 className="f-b m-0">{pathOr("", [locale, "Products", "review_product_before_adding"], t)}</h6>
        <button onClick={() => (step === 1 ? push("/products") : setStep(1))} className="btn-main btn-main-o">
          {pathOr("", [locale, "Products", "cancel"], t)}
        </button>
      </section>
      <section>
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
      </section>
    </article>
  )
}

export default EditProduct

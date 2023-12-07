import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import AddProductStepOne from "../../../modules/products/add/stepOne"
import AddProductStepTwo from "../../../modules/products/add/stepTwo"
import axios from "axios"
import { toast } from "react-toastify"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { useFetch } from "../../../hooks/useFetch"
import ProductDetails from "./ProductDetails"

const EditProduct = () => {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedCatId, setSelectedCatId] = useState(null)
  const [selectedCatProps, setSelectedCatProps] = useState({})
  const [speficationsPayload, setSpeficationsPayload] = useState([])
  const [product, setProduct] = useState()
  const [editModeOn, setEditModeOn] = useState(false)
  const { locale, query } = useRouter()
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
  const { data: productData } = useFetch(`/GetProductById?id=${query.id}&lang=${locale}`, true)

  const handleBack = (e) => {
    e.preventDefault()
    step > 1 ? setStep((prev) => prev - 1) : router.push("/products")
  }

  useEffect(() => {
    if (productData) {
      setProductPayload((prev) => ({
        ...prev,
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
        listImageFile: productData.listMedia,
        // videoUrl: productData.videoUrl,
        // ShippingOptions: productData.productShippingOptions,
        Lat: productData.lat,
        Lon: productData.lon,
        AcceptQuestion: productData.acceptQuestion,
        IsFixedPriceEnabled: productData.isFixedPriceEnabled,
        IsAuctionEnabled: productData.isAuctionEnabled,
        IsNegotiationEnabled: productData.isNegotiationEnabled,
        Price: productData.price,
        // PaymentOptions: productData.paymentOptions,
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
      }))
    }
    const fetchCatProps = async () => {
      if (productData) {
        try {
          const {
            data: { data: data },
          } = await axios(
            `${process.env.NEXT_PUBLIC_API_URL}/GetCategoryById?id=${productData?.categoryId}&lang=${locale}`,
          )
          setSelectedCatProps(data)
        } catch (error) {
          Alerto(error)
        }
      }
    }
    fetchCatProps()
  }, [productData, locale])

  return (
    <div className="body-content">
      <div>
        {step === 1 && (
          <ProductDetails
            selectedCatProps={selectedCatProps}
            handleBack={handleBack}
            productFullData={productPayload}
            setProductPayload={setProductPayload}
          />
        )}
      </div>
    </div>
  )
}

export default EditProduct

// {(step === 1 || step === 2) && (
//     <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
//       <h6 className="f-b m-0">{pathOr("", [locale, "Products", "addNewProduct"], t)}</h6>
//       <a onClick={handleBack} className="btn-main btn-main-o">
//         {pathOr("", [locale, "Products", "cancel"], t)}
//       </a>
//     </div>
//   )}
//   {step === 1 && !product?.id && (
//     <AddProductStepOne
//       product={product && product}
//       next={(selectedCat) => handleNextStep(selectedCat)}
//       setSelectedCatProps={setSelectedCatProps}
//       setProductPayload={setProductPayload}
//       editProduct={false}
//     />
//   )}
//   {(step === 2 || (product && product?.id)) && (
//     <AddProductStepTwo
//       product={product && product}
//       catId={selectedCatId}
//       selectedCatProps={selectedCatProps}
//       handleGoToReviewPage={handleGoToReviewPage}
//       productPayload={productPayload}
//       setProductPayload={setProductPayload}
//       speficationsPayload={speficationsPayload}
//       setSpeficationsPayload={setSpeficationsPayload}
//       editModeOn={editModeOn}
//       setEditModeOn={setEditModeOn}
//     />
//   )}

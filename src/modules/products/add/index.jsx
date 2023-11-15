import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import AddProductStepOne from "../../../modules/products/add/stepOne"
import AddProductStepTwo from "../../../modules/products/add/stepTwo"
import axios from "axios"
import { toast } from "react-toastify"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import AddProductReview from "./review"

const AddProduct = () => {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedCatId, setSelectedCatId] = useState(null)
  const [selectedCatProps, setSelectedCatProps] = useState({})
  const [product, setProduct] = useState()
  const { locale } = useRouter()
  const [productFullData, setProductFullData] = useState({})
  const getProduct = async () => {
    try {
      const res = await axios(
        `${process.env.NEXT_PUBLIC_API_URL}/Provider_GetProductById?id=${router.query.id}&lang=${locale}`,
      )
      setProduct(res?.data?.data)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  useEffect(() => {
    router.query.id && getProduct()
  }, [router.query.id])

  const handleBack = (e) => {
    e.preventDefault()
    router.push("./")
  }

  const handleNextStep = (selectedCatId) => {
    setStep(2)
    setSelectedCatId(selectedCatId)
  }

  const handleGoToReviewPage = (productData) => {
    setStep(3)
    setProductFullData(productData)
  }
  const handleGoToSteptwo = (productData) => {
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
        {step === 1 && !product?.id && (
          <AddProductStepOne
            product={product && product}
            next={(selectedCat) => handleNextStep(selectedCat)}
            setSelectedCatProps={setSelectedCatProps}
            editProduct={false}
          />
        )}
        {(step === 2 || (product && product?.id)) && (
          <AddProductStepTwo
            product={product && product}
            catId={selectedCatId}
            selectedCatProps={selectedCatProps}
            handleGoToReviewPage={handleGoToReviewPage}
          />
        )}
        {(step === 3 || (product && product?.id)) && (
          <AddProductReview
            selectedCatProps={selectedCatProps}
            productFullData={productFullData}
            handleBack={handleGoToSteptwo}
          />
        )}
      </div>
    </div>
  )
}

export default AddProduct

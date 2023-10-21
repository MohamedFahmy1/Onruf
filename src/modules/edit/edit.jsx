import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useSelector, useDispatch } from "react-redux"
import { getProductById } from "../../appState/product/productActions"
import AddProductStepOne from "../products/add/stepOne"
import AddProductStepTwo from "../products/add/stepTwo"

const EditProduct = () => {
  const router = useRouter()
  const productId = router.query.id
  const { locale } = useRouter()
  const dispatch = useDispatch()
  const product = useSelector((state) => state.product.data)
  const [step, setStep] = useState(1)
  const [selectedCatId, setSelectedCatId] = useState(null)

  const handleBack = (e) => {
    e.preventDefault()

    router.push("/products")
  }

  useEffect(() => {
    productId && dispatch(getProductById(productId, locale))
  }, [productId])

  const handleNextStep = (selectedCat) => {
    setStep(2)
    setSelectedCatId(selectedCat)
  }

  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">تعديل المنتج </h6>

          <a onClick={handleBack} className="btn-main btn-main-o">
            الغاء
          </a>
        </div>
        {step === 1 && (
          <AddProductStepOne product={product} next={(selectedCat) => handleNextStep(selectedCat)} editProduct={true} />
        )}
        {step === 2 && <AddProductStepTwo product={product} catId={selectedCatId} />}
      </div>
    </div>
  )
}

export default EditProduct

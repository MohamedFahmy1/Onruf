import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import styles from "./stepOne.module.css"
import t from "../../../../translations.json"
import { Col, Row } from "react-bootstrap"
import { pathOr } from "ramda"

const AddProductStepOne = ({ next, setSelectedCatProps, setProductPayload }) => {
  const { locale } = useRouter()
  const [allCategories, setAllCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([null])

  const fetchCategories = useCallback(async () => {
    const {
      data: { data: cats },
    } = await axios(`/ListCategoryAndSub?lang=${locale}&currentPage=1`)
    setAllCategories(cats)
  }, [locale])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories, locale])

  const handleSelectionChange = (level, selectedId) => {
    const newSelectedCategories = selectedCategories.slice(0, level + 1)
    newSelectedCategories[level] = selectedId

    const selectedCategory = getCategoryById(allCategories, selectedId)
    if (selectedCategory && selectedCategory.list && selectedCategory.list.length > 0) {
      newSelectedCategories.push(null)
    }
    setSelectedCategories(newSelectedCategories)
  }

  const getCategoryById = (categories, id) => {
    for (const category of categories) {
      if (category.id === id) return category
      if (category.list) {
        const subcategory = getCategoryById(category.list, id)
        if (subcategory) return subcategory
      }
    }
    return null
  }

  const getSubcategories = (categories, selectedIds) => {
    let subcategories = categories
    for (const id of selectedIds) {
      const category = subcategories.find((c) => c.id === id)
      if (category && category.list) {
        subcategories = category.list
      } else {
        return []
      }
    }
    return subcategories
  }

  const handleNextStep = (e) => {
    e.preventDefault()
    const selectedCatId = selectedCategories[selectedCategories.length - 1]
    if (!selectedCatId) return
    next(selectedCatId)
    const catProps = getCategoryById(allCategories, selectedCatId)
    setProductPayload((prev) => ({
      ...prev,
      categoryId: selectedCatId,
      "ProductPaymentDetailsDto.CategoryId": selectedCatId,
      "ProductPaymentDetailsDto.ProductPublishPrice": catProps?.productPublishPrice,
      "ProductPaymentDetailsDto.EnableFixedPriceSaleFee": catProps?.enableFixedPriceSaleFee,
      "ProductPaymentDetailsDto.EnableAuctionFee": catProps?.enableAuctionFee,
      "ProductPaymentDetailsDto.EnableNegotiationFee": catProps?.enableNegotiationFee,
      "ProductPaymentDetailsDto.FixedPriceSaleFee": catProps?.enableFixedPriceSaleFee,
      "ProductPaymentDetailsDto.AuctionFee": catProps?.enableAuctionFee,
      "ProductPaymentDetailsDto.NegotiationFee": catProps?.enableNegotiationFee,
      "ProductPaymentDetailsDto.ExtraProductImageFee": catProps?.extraProductImageFee,
      "ProductPaymentDetailsDto.ExtraProductVidoeFee": catProps?.extraProductVidoeFee,
      "ProductPaymentDetailsDto.SubTitleFee": catProps?.subTitleFee,
    }))
    setSelectedCatProps(catProps)
  }

  const renderSelectFields = () => {
    return selectedCategories.map((selectedId, level) => {
      const subcategories = getSubcategories(allCategories, selectedCategories.slice(0, level))
      return (
        <div key={level} className={`form-group ${styles["select_P"]}`}>
          <label className="d-block text-center" htmlFor={`selectCategory-${level}`}>
            {level > 0
              ? pathOr("", [locale, "Products", "subcategory"], t)
              : pathOr("", [locale, "Products", "selectCategory"], t)}
          </label>
          <select
            value={selectedId || ""}
            className="form-control form-select"
            name={`selectCategory-${level}`}
            id={`selectCategory-${level}`}
            onChange={(e) => handleSelectionChange(level, parseInt(e.target.value))}
          >
            <option value="" disabled hidden>
              {pathOr("", [locale, "Products", "selectOption"], t)}
            </option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      )
    })
  }

  return (
    <div className="contint_paner">
      <Row className="justify-content-center">
        <Col lg={6}>
          <div className="mt-4">
            <div className="text-center mb-3">
              <h2 className="f-b fs-3">{pathOr("", [locale, "Products", "sellWhat"], t)}</h2>
            </div>
            <div className="form-content">
              <form>
                {renderSelectFields()}
                <button
                  onClick={handleNextStep}
                  disabled={!selectedCategories[selectedCategories.length - 1]}
                  className={`btn-main d-block w-100 ${
                    !selectedCategories[selectedCategories.length - 1] ? styles["btn-disabled"] : ""
                  }`}
                >
                  {pathOr("", [locale, "Products", "next"], t)}
                </button>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default AddProductStepOne

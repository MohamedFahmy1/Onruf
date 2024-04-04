import { useEffect, useState, useCallback, useRef } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import styles from "./stepOne.module.css"
import { FaTimes } from "react-icons/fa"
import { pathOr, propOr } from "ramda"
import t from "../../../../translations.json"
import { Col, Row } from "react-bootstrap"
import Alerto from "../../../../common/Alerto"
import { toast } from "react-toastify"

const AddProductStepOne = ({ next, setSelectedCatProps, productPayload, setProductPayload }) => {
  const {
    locale,
    query: { id },
  } = useRouter()
  const mainCatRef = useRef(null)
  const [catSearchInputVal, setCatSearchInputVal] = useState("")
  const [allCats, setAllCats] = useState([])
  const [categoriesAndSubListByName, setCategoriesAndSubListByName] = useState([])
  const [selectedCatId, setSelectedCatId] = useState(null)
  const [selectedCat, setSelectedCat] = useState(null)
  const [categoriesAndSubList, setCategoriesAndSubList] = useState([])
  const [returnedSavedData, setReturnedSavedData] = useState(false)
  const [returnedSavedDataValue, setReturnedSavedDataValue] = useState([])

  const fetchCategories = useCallback(async () => {
    const {
      data: { data: cats },
    } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/ListCategoryAndSub?lang=${locale}&currentPage=1`)
    setAllCats(cats)
  }, [locale])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories, locale])

  const findCategoryById = (categories, id) => {
    for (const category of categories) {
      // if id is for main category return it
      if (category.id === id) {
        return category
      }
      // if id is for subcategory go to list property and search for the subcategory
      if (category.list && category.list.length > 0) {
        const foundSubCategory = findCategoryById(category.list, id)
        if (foundSubCategory) {
          return foundSubCategory
        }
      }
    }
    return null
  }
  const arrayOfCatAndSubcat = useCallback((categories, id, array = []) => {
    for (const category of categories) {
      // Add the current category to the array
      const newPath = array.concat(category)
      // Check if the current category's id matches the searched id
      if (category.id === id) {
        return newPath
      }
      // If this category has subcategories, search within them recursively
      if (category.list && category.list.length > 0) {
        const foundPath = arrayOfCatAndSubcat(category.list, id, newPath)
        if (foundPath) {
          return foundPath
        }
      }
    }
    // if the id of the category is not found
    return null
  }, [])

  const handleNextStep = (e) => {
    e.preventDefault()
    next(selectedCatId)
    const catProps = findCategoryById(allCats, selectedCatId)
    setProductPayload((prev) => ({
      ...prev,
      categoryId: selectedCatId,
      "ProductPaymentDetailsDto.ProductPublishPrice": catProps?.productPublishPrice,
      "ProductPaymentDetailsDto.EnableFixedPriceSaleFee": catProps?.enableFixedPriceSaleFee,
      "ProductPaymentDetailsDto.EnableAuctionFee": catProps?.enableAuctionFee,
      "ProductPaymentDetailsDto.EnableNegotiationFee": catProps?.enableNegotiationFee,
      "ProductPaymentDetailsDto.ExtraProductImageFee": catProps?.extraProductImageFee,
      "ProductPaymentDetailsDto.ExtraProductVidoeFee": catProps?.extraProductVidoeFee,
      "ProductPaymentDetailsDto.SubTitleFee": catProps?.subTitleFee,
    }))
    setSelectedCatProps(catProps)
  }

  const handleSelectChange = (e) => {
    setSelectedCatId(+e.target.value)
    let selected =
      selectedCat && selectedCat.list.length
        ? selectedCat?.list?.find((cat) => cat?.id?.toString() === e.target.value)
        : allCats.find((cat) => cat?.id?.toString() === e.target.value)
    setSelectedCat(selected || allCats.find((cat) => cat?.id?.toString() === e.target.value))
    if (selected?.list?.length && !categoriesAndSubList?.find((category) => category?.id === selected?.id)) {
      setCategoriesAndSubList([...categoriesAndSubList, selected])
    } else if (allCats.find((cat) => cat?.id === selected?.id)) {
      setCategoriesAndSubList([])
    }
    setReturnedSavedDataValue([])
  }
  const handleSelectChangeCat = (e) => {
    setSelectedCatId(+e.target.value)
    let selected =
      selectedCat && selectedCat.list.length
        ? selectedCat?.list?.find((cat) => cat?.id?.toString() === e.target.value)
        : allCats.find((cat) => cat?.id?.toString() === e.target.value)
    setSelectedCat(selected || allCats.find((cat) => cat?.id?.toString() === e.target.value))
    if (selected?.list?.length && !categoriesAndSubList?.find((category) => category?.id === selected?.id)) {
      if (allCats.some((item) => +item.id === +e.target.value) && categoriesAndSubList.length >= 1) {
        setCategoriesAndSubList([selected])
      } else {
        setCategoriesAndSubList([...categoriesAndSubList, selected])
      }
    } else if (allCats.find((cat) => cat?.id === selected?.id)) {
      setCategoriesAndSubList([])
    }
  }
  const hanldeReset = () => {
    if (!catSearchInputVal) {
      mainCatRef.current.value = ""
    }
    setSelectedCat(null)
    setSelectedCatId(null)
    setCatSearchInputVal("")
    setCategoriesAndSubList([])
    setCategoriesAndSubListByName([])
    setReturnedSavedDataValue([])
    fetchCategories()
  }

  const abortControllerRef = useRef(new AbortController())
  const handleSearchProduct = useCallback(async () => {
    const { signal } = abortControllerRef.current
    try {
      const {
        data: { data: filteredCategories },
      } = await axios(
        `${process.env.NEXT_PUBLIC_API_URL}/GetListCategoriesByProductName?productName=${catSearchInputVal}&lang=${locale}`,
        { signal },
      )
      !filteredCategories?.[0] && toast.error(locale === "en" ? "No Categories Found" : "لم يتم العثور على تصنيفات")
      setCategoriesAndSubListByName(filteredCategories)
      setSelectedCatId(filteredCategories[0]?.productCategoryId)
      setCategoriesAndSubList([])
      setAllCats([])
    } catch (error) {
      if (!axios.isCancel(error)) {
        Alerto(error)
      }
    }
  }, [locale, catSearchInputVal])

  useEffect(() => {
    if (catSearchInputVal) {
      abortControllerRef.current.abort()
      abortControllerRef.current = new AbortController()
      handleSearchProduct()
    }
    return () => {
      abortControllerRef.current.abort()
    }
  }, [handleSearchProduct, catSearchInputVal])

  useEffect(() => {
    const selectedCatAndSub = arrayOfCatAndSubcat(allCats, productPayload.categoryId)
    if (!returnedSavedData && selectedCatAndSub?.length > 0) {
      setReturnedSavedDataValue(selectedCatAndSub)
      if (selectedCatAndSub.length === 1) {
        setSelectedCatId(selectedCatAndSub[0].id)
        setSelectedCat(selectedCatAndSub[0])
        setCategoriesAndSubList(selectedCatAndSub)
      } else {
        setSelectedCatId(selectedCatAndSub[selectedCatAndSub.length - 1].id)
        setSelectedCat(selectedCatAndSub[selectedCatAndSub.length - 1])
        setCategoriesAndSubList(selectedCatAndSub.slice(0, selectedCatAndSub.length - 1))
      }
      setReturnedSavedData(true)
    }
  }, [productPayload.categoryId, allCats, returnedSavedData, arrayOfCatAndSubcat])

  return (
    <div className="contint_paner">
      <Row className="justify-content-center">
        <Col lg={6}>
          <div className="mt-4">
            {!Boolean(selectedCat) && (
              <div className="text-center mb-3">
                <h2 className="f-b fs-3">{pathOr("", [locale, "Products", "sellWhat"], t)}</h2>
                <p className="fs-4">{pathOr("", [locale, "Products", "enterAddress"], t)}</p>
              </div>
            )}
            <div className="form-content">
              <form>
                {!Boolean(selectedCat) && (
                  <div className="form-group">
                    <div className={`po_R overflow-hidden ${styles["search_P"]}`}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={pathOr("", [locale, "Products", "enterProductName"], t)}
                        value={catSearchInputVal}
                        onChange={(e) => setCatSearchInputVal(e?.target?.value)}
                        disabled={selectedCatId && selectedCat}
                      />
                      {Boolean(catSearchInputVal) && (
                        <button className={styles["reset"]} onClick={hanldeReset}>
                          <FaTimes />
                        </button>
                      )}
                      <button
                        className={`btn-main ${styles["btn-main"]} ${
                          Boolean(selectedCatId && selectedCat) && styles["btn-disabled"]
                        }`}
                        disabled={selectedCatId && selectedCat}
                        type="button"
                        onClick={handleSearchProduct}
                        style={locale === "en" ? { right: 0 } : { left: 0 }}
                      >
                        {pathOr("", [locale, "Products", "search"], t)}
                      </button>
                    </div>
                    {Boolean(categoriesAndSubListByName?.length) && (
                      <ul
                        style={{
                          fontSize: "1.2rem",
                          direction: locale === "en" ? "ltr" : "rtl",
                          marginTop: "2rem",
                        }}
                      >
                        {categoriesAndSubListByName.map((catWithSub, index) => (
                          <li className="mb-3 d-flex justify-content-between " key={index}>
                            <div className="flex gap-1">
                              {propOr([], ["categories"], catWithSub).map((cat, indx) => (
                                <label key={indx} htmlFor={index}>
                                  {cat || ""}
                                  <span className="mx-1 text-lg	">
                                    {indx < catWithSub.categories.length - 1 ? "-" : ""}
                                  </span>
                                </label>
                              ))}
                            </div>
                            <input
                              type="radio"
                              name="fill"
                              defaultChecked={index == 0}
                              value={catWithSub?.productCategoryId}
                              onChange={() => setSelectedCatId(catWithSub?.productCategoryId)}
                              id={index}
                              className="mx-2 mt-1 "
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {!!allCats?.length && !Boolean(categoriesAndSubListByName?.length) && (
                  <div className={`form-group ${styles["select_P"]}`}>
                    <label className="d-block text-center" htmlFor="selectCategory">
                      {pathOr("", [locale, "Products", "selectCategory"], t)}
                    </label>
                    <select
                      ref={mainCatRef}
                      onChange={handleSelectChangeCat}
                      value={categoriesAndSubList[0]?.id}
                      className="form-control form-select"
                      name="selectCategory"
                      id="selectCategory"
                    >
                      <option disabled hidden value={""}>
                        {pathOr("", [locale, "Products", "selectOption"], t)}
                      </option>
                      {allCats.map((cat, index) => (
                        <option key={cat?.id} value={cat?.id}>
                          {cat?.name}
                        </option>
                      ))}
                    </select>
                    {Boolean(selectedCat) && (
                      <button className={styles["reset"]} onClick={hanldeReset}>
                        <FaTimes />
                      </button>
                    )}
                  </div>
                )}
                {Boolean(categoriesAndSubList.length) &&
                  Boolean(categoriesAndSubList[0].list.length) &&
                  categoriesAndSubList.map((category, index) => (
                    <div className="form-group" key={category?.id}>
                      <label className="d-block text-center" htmlFor={category?.id}>
                        {pathOr("", [locale, "Products", "subcategory"], t)}
                      </label>
                      <select
                        id={category?.id}
                        className="form-control form-select"
                        onChange={handleSelectChange}
                        defaultValue={
                          returnedSavedDataValue?.length > 0 && returnedSavedData
                            ? categoriesAndSubList[index + 1]?.id
                            : 0
                        }
                      >
                        <option disabled hidden value={0}>
                          {pathOr("", [locale, "Products", "choose_department"], t)}
                        </option>
                        {category?.list?.map((subCategory) => (
                          <option key={subCategory?.id} value={subCategory?.id}>
                            {subCategory?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                <button
                  onClick={handleNextStep}
                  disabled={!selectedCatId}
                  className={`btn-main d-block w-100 ${!selectedCatId ? styles["btn-disabled"] : ""}`}
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

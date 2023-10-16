import { Fragment, useEffect, useState, useCallback } from "react"
import axios from "axios"
import Router, { useRouter } from "next/router"
import styles from "./stepOne.module.css"
import { FaTimes } from "react-icons/fa"
import { pathOr, propOr } from "ramda"
import t from "../../../../translations.json"
import { Col, Row } from "react-bootstrap"
import Alerto from "../../../../common/Alerto"
import { toast } from "react-toastify"
const AddProductStepOne = ({ next, product, editProduct }) => {
  const {
    locale,
    query: { id },
  } = useRouter()

  const router = useRouter()

  const [catSearchInputVal, setCatSearchInputVal] = useState("")
  const [allCats, setAllCats] = useState([])
  const [categoriesAndSubListByName, setCategoriesAndSubListByName] = useState([])
  const [selectedCatId, setSelectedCatId] = useState(null)
  const [selectedCat, setSelectedCat] = useState(null)
  const [categoriesAndSubList, setCategoriesAndSubList] = useState([])
  useEffect(() => {
    if (router.pathname.includes("edit")) {
      setCatSearchInputVal(product.name)
      setSelectedCatId(product.categoryId)
    }
  }, [product?.id, product?.category, locale])

  const fetchCategories = useCallback(async () => {
    const {
      data: { data: cats },
    } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/ListCategoryAndSub?lang=${locale}&currentPage=1`)
    setAllCats(cats)
    if (id) {
      setSelectedCatId(product?.categoryId)
    }
  }, [id, locale])

  useEffect(() => {
    fetchCategories()
    editProduct && catSearchInputVal && hanldeSearchProduct()
  }, [fetchCategories, id, locale])

  const handleNextStep = (e) => {
    e.preventDefault()
    next(selectedCatId)
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
  }

  const hanldeReset = () => {
    setSelectedCat(null)
    setSelectedCatId(null)
    setCatSearchInputVal("")
    setCategoriesAndSubList([])
    setCategoriesAndSubListByName([])
    fetchCategories()
  }

  const hanldeSearchProduct = async () => {
    try {
      const {
        data: { data: filteredCategories },
      } = await axios(
        `${process.env.NEXT_PUBLIC_API_URL}/GetListCategoriesByProductName?productName=${catSearchInputVal}&lang=${locale}`,
      )
      !filteredCategories?.[0] && toast.error("no data found")
      setCategoriesAndSubListByName(filteredCategories)
      setSelectedCatId(filteredCategories[0]?.productCategoryId)
      setCategoriesAndSubList([])
      setAllCats([])
    } catch (e) {
      Alerto(e)
    }
  }

  return (
    <div className="contint_paner">
      <Row className="justify-content-center">
        <Col lg={6}>
          <div className="mt-4">
            {!Boolean(selectedCat) && (
              <div className="text-center mb-3">
                <h3 className="f-b">{pathOr("", [locale, "Products", "sellWhat"], t)}</h3>
                <h5>{pathOr("", [locale, "Products", "enterAddress"], t)}</h5>
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
                        onClick={hanldeSearchProduct}
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
                                <label
                                  key={indx}
                                  //  className="mx-3"
                                  htmlFor={index}
                                >
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
                              // style={{ position: "absolute", left: 0 }}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {!!allCats?.length && !Boolean(categoriesAndSubListByName?.length) && (
                  <div className={`form-group ${styles["select_P"]}`}>
                    <label className="d-block text-center">
                      {pathOr("", [locale, "Products", "selectCategory"], t)}
                    </label>
                    <select value={selectedCatId} className="form-control form-select" onChange={handleSelectChange}>
                      <option disabled selected value>
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
                  categoriesAndSubList.map((category) => (
                    <div className="form-group" key={category?.id}>
                      <label className="d-block text-center">القسم الفرعي</label>
                      <select className="form-control form-select" onChange={handleSelectChange} defaultValue={0}>
                        <option disabled value={0}>
                          اختر قسم
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

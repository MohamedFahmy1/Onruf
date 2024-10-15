import { useRouter } from "next/router"
import { Accordion } from "react-bootstrap"
import { FaTrashAlt } from "react-icons/fa"
import styles from "./joinCampaign.module.css"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { useFetch } from "../../../hooks/useFetch"
import ResponsiveImage from "../../../common/ResponsiveImage"
import Link from "next/link"
import ReactSelect from "react-select"

const JoinCampaign = () => {
  const {
    locale,
    query: { id },
    push,
  } = useRouter()
  const { data: offer } = useFetch(`/GetCouponById?id=${id}`, true)

  const [offerPayload, setOfferPayload] = useState({
    id: id,
    productIds: [],
    categoryIds: [],
    fileIds: [],
  })

  const [categoryName, setCategoryName] = useState([])
  const [folderName, setFolderName] = useState([])
  const [categories, setCategories] = useState([])
  const [folders, setFolders] = useState([])
  const [productsOptions, setProductsOptions] = useState([])
  const [eventKey, setEventKey] = useState("0")
  const [selectedProducts, setSelectedProducts] = useState([])

  const handleLoadProducts = async () => {
    const {
      data: { data: productsList },
    } = await axios.get(`/ListProductByBusinessAccountId?currentPage=1&maxRows=100&lang=${locale}`)
    const productsOptionsList = productsList.map((product) => ({
      label: product.name,
      value: product.id,
      product,
    }))
    setProductsOptions([...productsOptionsList])
  }

  const handleProductSelect = (selectedOptions) => {
    setSelectedProducts(selectedOptions)
    const selectedProductIds = selectedOptions.map((option) => option.product.id)
    setOfferPayload({ ...offerPayload, productIds: selectedProductIds })
  }

  const handleRemoveSelectedProduct = (optionToRemove) => {
    const newSelectedProducts = selectedProducts.filter((option) => option.value !== optionToRemove.value)
    setSelectedProducts(newSelectedProducts)
    setOfferPayload({
      ...offerPayload,
      productIds: newSelectedProducts.map((option) => option.product.id),
    })
  }

  const handleRemoveAllSelectedProducts = () => {
    setSelectedProducts([])
    setOfferPayload({ ...offerPayload, productIds: [] })
  }

  console.log(offerPayload)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const joinOffer = await axios.post(`/BusinessAccountSubscribeInCoupon`, offerPayload)
    const { data: joinOfferRes } = joinOffer
    if (joinOfferRes.status_code === 200) {
      toast.success(locale === "en" ? "You Subscribed To Coupon Successfully!" : "تم الاشتراك بالكوبون بنجاح")
      push("..")
    }
  }

  useEffect(() => {
    ;(async () => {
      const {
        data: { data: categories },
      } = await axios.get(`/ListAllCategory?currentPage=1`)
      setCategories(categories)
      const {
        data: {
          data: { fileList: folders },
        },
      } = await axios.get(`/ListFolder?type=1&pageIndex=1&PageRowsCount=10&lang=${locale}`)
      setFolders(folders)
    })()
  }, [locale])

  useEffect(() => {
    handleLoadProducts()
  }, [locale])

  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">{pathOr("", [locale, "marketing", "join_the_coupon"], t)}</h6>
          <Link href={"/marketing"}>
            <a aria-label={pathOr("", [locale, "marketing", "cancel"], t)} className="btn-main btn-main-o">
              {pathOr("", [locale, "marketing", "cancel"], t)}
            </a>
          </Link>
        </div>
        <Accordion activeKey={eventKey} flush>
          <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="0">
            <Accordion.Button bsPrefix={styles["header_Accord"]} disabled>
              <span>1</span>
              {pathOr("", [locale, "marketing", "coupon_details"], t)}
              <aside>{pathOr("", [locale, "marketing", "for_survey_only"], t)}</aside>
            </Accordion.Button>
            <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
              <div className="row">
                <div className="col-lg-5">
                  <div className={styles["info_boxo_"]}>
                    <span>{pathOr("", [locale, "marketing", "coupon_code"], t)}</span>
                    <span>{offer && offer.couponCode}</span>
                  </div>
                  {offer && offer.discountTypeID === "FixedAmount" ? (
                    <div className={styles["info_boxo_"]}>
                      <span>{pathOr("", [locale, "marketing", "discount_amount"], t)}</span>
                      <span>{offer && offer.discountValue}</span>
                    </div>
                  ) : (
                    <div className={styles["info_boxo_"]}>
                      <span>{pathOr("", [locale, "marketing", "discount_prec"], t)}</span>
                      <span>{offer && offer.discountPercentage}%</span>
                    </div>
                  )}
                  <div className={styles["info_boxo_"]}>
                    <span>{pathOr("", [locale, "marketing", "with_free_shipping"], t)}</span>
                    <span>
                      {offer && offer.isFreeDelivery
                        ? pathOr("", [locale, "Branch", "yes"], t)
                        : pathOr("", [locale, "Branch", "no"], t)}
                      <span className="font-18 main-color">
                        <i className="fas fa-check-circle" />
                      </span>
                    </span>
                  </div>
                  <div className={styles["info_boxo_"]}>
                    <span>{pathOr("", [locale, "marketing", "discount_expiration_date"], t)}</span>
                    <span>{offer && offer.expiryDate}</span>
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className={styles["info_boxo_"]}>
                    <span>{pathOr("", [locale, "marketing", "coupon_type"], t)}</span>
                    <span>
                      {offer && offer.couponType === 1
                        ? pathOr("", [locale, "marketing", "fixed_amount_of_customer_order_total"], t)
                        : pathOr("", [locale, "marketing", "percentage_of_customer_order_total"], t)}
                      <span className="font-18 main-color">
                        <i className="fas fa-check-circle" />
                      </span>
                    </span>
                  </div>
                  <div className={styles["info_boxo_"]}>
                    <span>{pathOr("", [locale, "marketing", "maximum_discount_limit"], t)}</span>
                    <span>
                      {offer && offer.maximumDiscount} {pathOr("", [locale, "Products", "currency"], t)}
                    </span>
                  </div>
                  <div className={styles["info_boxo_"]}>
                    <span>{pathOr("", [locale, "marketing", "exclude_discounted_products"], t)}</span>
                    <span>
                      {offer && offer.excludeDiscountedProducts
                        ? pathOr("", [locale, "Branch", "yes"], t)
                        : pathOr("", [locale, "Branch", "no"], t)}
                      <span className="font-18 main-color">
                        <i className="fas fa-check-circle" />
                      </span>
                    </span>
                  </div>
                  <div className={styles["info_boxo_"]}>
                    <span>{pathOr("", [locale, "marketing", "usage_per_customer"], t)}</span>
                    <span>
                      {offer && offer.maxUseLimit === 0
                        ? pathOr("", [locale, "marketing", "none"], t)
                        : `${offer && offer.maxUseLimit} ${pathOr("", [locale, "marketing", "once"], t)}`}{" "}
                    </span>
                  </div>
                </div>
              </div>
              <button className="btn-main mt-3" type="button" onClick={() => setEventKey("1")}>
                {pathOr("", [locale, "marketing", "next"], t)}
              </button>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="1">
            <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => setEventKey("1")}>
              <span>2</span>
              {pathOr("", [locale, "Coupons", "includedIn"], t)}
            </Accordion.Button>
            <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
              <section className="form-content">
                <form>
                  {/* Categories Selection */}
                  <div className="form-group">
                    <label>{pathOr("", [locale, "Coupons", "catIn"], t)}</label>
                    <ReactSelect
                      isMulti
                      options={categories.map((category) => ({
                        label: category.name,
                        value: category.id,
                      }))}
                      value={categoryName.map((name) => ({ label: name, value: name }))}
                      onChange={(selectedOptions) => {
                        const selectedNames = selectedOptions.map((option) => option.label)
                        setCategoryName(selectedNames)
                        const selectedCat = categories.filter((category) => selectedNames.includes(category.name))
                        const CategoryIds = selectedCat.map((category) => category.id)
                        setOfferPayload({ ...offerPayload, CategoryIds })
                      }}
                      placeholder={pathOr("", [locale, "Coupons", "catIn"], t)}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          margin: "1rem",
                          width: "100%",
                          fontSize: "1rem",
                          fontWeight: "400",
                          lineHeight: 1.5,
                          color: "#495057",
                          backgroundColor: "#fff",
                          border: "1px solid #ced4da",
                          borderRadius: "50px",
                          textIndent: 10,
                          padding: "5px 10px",
                        }),
                      }}
                    />
                  </div>

                  {/* Folders Selection */}
                  <div className="form-group">
                    <label>{pathOr("", [locale, "Coupons", "foldersIn"], t)}</label>
                    <ReactSelect
                      isMulti
                      options={folders.map((folder) => ({
                        label: folder.name,
                        value: folder.id,
                      }))}
                      value={folderName.map((name) => ({ label: name, value: name }))}
                      onChange={(selectedOptions) => {
                        const selectedNames = selectedOptions.map((option) => option.label)
                        setFolderName(selectedNames)
                        const selectedFolder = folders.filter((folder) => selectedNames.includes(folder.name))
                        const folderIds = selectedFolder.map((folder) => folder.id)
                        setOfferPayload({ ...offerPayload, FileIds: folderIds })
                      }}
                      placeholder={pathOr("", [locale, "Coupons", "foldersIn"], t)}
                      menuPlacement="top"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          margin: "1rem",
                          width: "100%",
                          fontSize: "1rem",
                          fontWeight: "400",
                          lineHeight: 1.5,
                          color: "#495057",
                          backgroundColor: "#fff",
                          border: "1px solid #ced4da",
                          borderRadius: "50px",
                          textIndent: 10,
                          padding: "5px 10px",
                        }),
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 100,
                        }),
                      }}
                    />
                  </div>

                  {/* Products Selection */}
                  <div className="form-group">
                    <label>{pathOr("", [locale, "Coupons", "productsIn"], t)}</label>
                    <div className="po_R">
                      <ReactSelect
                        isMulti
                        options={productsOptions}
                        value={selectedProducts}
                        onChange={handleProductSelect}
                        placeholder={pathOr("", [locale, "Coupons", "productsIn"], t)}
                        menuPlacement="top"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            margin: "1rem",
                            width: "100%",
                            fontSize: "1rem",
                            fontWeight: "400",
                            lineHeight: 1.5,
                            color: "#495057",
                            backgroundColor: "#fff",
                            border: "1px solid #ced4da",
                            borderRadius: "50px",
                            textIndent: 10,
                            padding: "5px 10px",
                          }),
                        }}
                      />
                    </div>
                  </div>

                  {/* Display Selected Products */}
                  {Boolean(selectedProducts.length) && (
                    <div className="contint_paner">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h5 className="f-b m-0">{pathOr("", [locale, "Coupons", "chosenProd"], t)}</h5>
                        <a
                          onClick={handleRemoveAllSelectedProducts}
                          className="main-color f-b font-18"
                          style={{ cursor: "pointer" }}
                        >
                          {pathOr("", [locale, "Coupons", "deleteAll"], t)}
                        </a>
                      </div>
                      <ul>
                        {selectedProducts.map((option) => {
                          const product = option.product
                          return (
                            <li key={product.id} className="d-flex align-items-center justify-content-between mb-3">
                              <div className="d-flex align-items-center">
                                {Boolean(product.listMedia.length) && (
                                  <ResponsiveImage
                                    imageSrc={product.listMedia[0].url}
                                    alt="product"
                                    width={"130px"}
                                    height={"100px"}
                                  />
                                )}
                                <div>
                                  <h6 className="m-0 f-b">{product.name}</h6>
                                  <div className="gray-color">{new Date(product.updatedAt).toLocaleDateString()}</div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveSelectedProduct(option)}
                                className="btn_Measures"
                              >
                                <FaTrashAlt />
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}

                  <button className="btn-main mt-3" onClick={handleSubmit}>
                    {pathOr("", [locale, "Coupons", "add"], t)}
                  </button>
                </form>
              </section>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  )
}

export default JoinCampaign

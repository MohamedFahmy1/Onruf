import styles from "./addCoupon.module.css"
import axios from "axios"
import { FaPlus, FaMinus, FaTrashAlt, FaCamera } from "react-icons/fa"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { TextField } from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { Accordion } from "react-bootstrap"
import { IoIosRemoveCircle } from "react-icons/io"
import { toast } from "react-toastify"
import { pathOr } from "ramda"
import { onlyNumbersInInputs } from "../../../common/functions"
import t from "../../../translations.json"
import Image from "next/image"
import ResponsiveImage from "../../../common/ResponsiveImage"
import Link from "next/link"
import ReactSelect from "react-select"

const AddCoupon = () => {
  const { locale, push } = useRouter()

  const [couponPayload, setCouponPayload] = useState({
    Image: [],
    TitleAr: "",
    TitleEn: "",
    CouponCode: "",
    maximumDiscount: 0,
    IsAdminCoupon: false,
    IsFreeDelivery: false,
    maxUsePerClient: 1,
    maxUseLimit: 1,
    fixedAmount: 0,
    excludeDiscountedProducts: false,
    ExpiryDate: new Date().toISOString().split("T")[0],
    CategoryIds: [],
    FileIds: [],
    discountTypeID: 1,
    discountValue: 0,
    products: [],
  })

  const [categoryName, setCategoryName] = useState([])
  const [folderName, setFolderName] = useState([])
  const [categories, setCategories] = useState([])
  const [folders, setFolders] = useState([])
  const [productsOptions, setProductsOptions] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [eventKey, setEventKey] = useState("0")

  const handleDate = (date) => {
    return new Date(date).toISOString().split("T")[0]
  }

  const handleChangeDate = (date) => {
    setCouponPayload({ ...couponPayload, ExpiryDate: handleDate(date) })
  }

  const handleIncrease = (e, key) => {
    e.preventDefault()
    setCouponPayload({ ...couponPayload, [key]: couponPayload[key] + 1 })
  }

  const handleDecrease = (e, key) => {
    e.preventDefault()
    const value = couponPayload[key]
    setCouponPayload({ ...couponPayload, [key]: value > 1 ? value - 1 : value })
  }

  const handleProductSelect = (selectedOptions) => {
    setSelectedProducts(selectedOptions || [])
    setCouponPayload({
      ...couponPayload,
      products: (selectedOptions || []).map((option) => option.product),
    })
  }

  const handleRemoveSelectedProduct = (optionToRemove) => {
    const newSelectedProducts = selectedProducts.filter((option) => option.value !== optionToRemove.value)
    setSelectedProducts(newSelectedProducts)
    setCouponPayload({
      ...couponPayload,
      products: newSelectedProducts.map((option) => option.product),
    })
  }

  const handleRemoveAllSelectedProducts = () => {
    setSelectedProducts([])
    setCouponPayload({ ...couponPayload, products: [] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Validation for Image
    if (couponPayload.Image.length === 0) {
      return toast.error(locale === "en" ? "Please enter an image for the coupon" : "من فضلك ادخل صورة للكوبون")
    }

    // Validation for Coupon Title (Arabic and English)
    if (!couponPayload.TitleAr || !couponPayload.TitleEn) {
      return toast.error(locale === "en" ? "Please enter a title for the coupon" : "من فضلك ادخل عنواناً للكوبون")
    }

    if (!couponPayload.CouponCode) {
      return toast.error(locale === "en" ? "Please enter a coupon code" : "من فضلك ادخل كود الكوبون")
    }

    if (couponPayload.discountValue <= 0) {
      return toast.error(locale === "en" ? "Please enter a valid discount amount" : "من فضلك ادخل قيمة خصم صحيحة")
    }

    if (couponPayload.maximumDiscount <= 0) {
      return toast.error(
        locale === "en" ? "Please enter a valid minimum purchase amount" : "من فضلك ادخل مبلغ الشراء الأدنى الصحيح",
      )
    }

    console.log(couponPayload)

    const form_data = new FormData()
    for (let key in couponPayload) {
      if (key === "Image") {
        couponPayload["Image"].forEach((img) => form_data.append("Image", img))
      } else if (key === "products") {
        couponPayload["products"].forEach((product) => form_data.append("ProductIds", product.id))
      } else if (key === "FileIds") {
        couponPayload["FileIds"].forEach((fileId) => form_data.append("FileIds", fileId))
      } else if (key === "CategoryIds") {
        couponPayload["CategoryIds"].forEach((categoryId) => form_data.append("CategoryIds", categoryId))
      } else {
        form_data.append(key, couponPayload[key])
      }
    }

    try {
      const submitCoupon = await axios.post("/AddEditCoupon", form_data)
      const { data: submitCouponRes } = submitCoupon

      if (submitCouponRes.status_code === 200) {
        push("./")
        toast.success(locale === "en" ? "Coupon Added Successfully!" : "!تم اضافة الكوبون بنجاح")
      }
    } catch (error) {
      const errorMessage = error.response.data.message
      if (errorMessage === "Coupon Code Exists") {
        toast.error(
          locale === "en"
            ? "Coupon Code Exists For Another Coupon Please Use another One"
            : "كود الكوبون موجود لكوبون اخر بالفعل برجاء استخدام كود اخر",
        )
      } else {
        toast.error(errorMessage)
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      // Load categories
      const {
        data: { data: categories },
      } = await axios.get(`/ListAllCategory?currentPage=1`)
      setCategories(categories)

      // Load folders
      const {
        data: {
          data: { fileList: folders },
        },
      } = await axios.get(`/ListFolder?type=1&pageIndex=1&PageRowsCount=10&lang=${locale}`)
      setFolders(folders)

      // Load products
      const {
        data: { data: productsList },
      } = await axios.get(`/ListProductByBusinessAccountId?lang=${locale}`)
      const productsOptionsList = productsList.map((product) => ({
        label: product.name,
        value: product.id,
        product,
      }))
      setProductsOptions([...productsOptionsList])
    }

    fetchData()
  }, [locale])

  const handleUploadImages = (e) => {
    let file = e.target.files[0]
    file.id = Date.now()
    setCouponPayload({ ...couponPayload, Image: [file] })
  }

  const handleRemoveImage = (index) => {
    setCouponPayload({
      ...couponPayload,
      Image: couponPayload.Image.filter((_, i) => i !== index),
    })
  }

  const toggleAccordionPanel = (eKey) => {
    eventKey === eKey ? setEventKey("") : setEventKey(eKey)
  }

  return (
    <article className="body-content">
      <section className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
        <h6 className="f-b m-0">{pathOr("", [locale, "Coupons", "addCoupon"], t)}</h6>
        <Link href={"/coupons"}>
          <a aria-label="cancel" className="btn-main btn-main-o">
            {pathOr("", [locale, "Coupons", "cancel"], t)}
          </a>
        </Link>
      </section>
      <Accordion activeKey={eventKey} flush>
        {/* First Accordion Item */}
        <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="0">
          <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("0")}>
            <span>1</span>
            {pathOr("", [locale, "Coupons", "couponDetails"], t)}
          </Accordion.Button>
          <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
            <section className="form-content">
              <form>
                {/* Coupon Image Upload */}
                <div className="form-group">
                  <div className={styles["all_upload_Image"]}>
                    {couponPayload?.Image?.map((img, index) => (
                      <div key={index} className={styles["the_img_upo"]}>
                        <IoIosRemoveCircle
                          onClick={() => handleRemoveImage(index)}
                          style={{
                            cursor: "pointer",
                            position: "absolute",
                            top: 5,
                            right: 5,
                            background: "white",
                            zIndex: 1,
                          }}
                        />
                        <Image src={URL.createObjectURL(img)} alt="coupon" width={160} height={160} />
                      </div>
                    ))}
                    <div className={"btn_apload_img"}>
                      <FaCamera />
                      <label htmlFor="handleUploadImages" className="visually-hidden">
                        {"handleUploadImages"}
                      </label>
                      <input id="handleUploadImages" type="file" onChange={handleUploadImages} />
                    </div>
                  </div>

                  {/* Coupon Title */}
                  <div className="mt-4">
                    <label htmlFor="couponTitle" className="f-b fs-5 p-2">
                      {pathOr("", [locale, "Coupons", "couponTitle"], t)}
                    </label>
                    <input
                      id="couponTitle"
                      type="text"
                      className="form-control"
                      placeholder={pathOr("", [locale, "Coupons", "couponTitle"], t)}
                      value={couponPayload.TitleAr}
                      onChange={(e) =>
                        setCouponPayload({
                          ...couponPayload,
                          TitleAr: e.target.value,
                          TitleEn: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Coupon Code */}
                  <div className="mt-4">
                    <label className="f-b fs-5">{pathOr("", [locale, "Coupons", "couponCode"], t)}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={pathOr("", [locale, "Coupons", "couponCode"], t)}
                      value={couponPayload.CouponCode}
                      onChange={(e) =>
                        setCouponPayload({
                          ...couponPayload,
                          CouponCode: e.target.value.replaceAll(" ", ""),
                        })
                      }
                    />
                  </div>
                </div>

                {/* Discount Type */}
                <div className="form-group">
                  <label htmlFor={pathOr("", [locale, "Coupons", "couponType"], t)}>
                    {pathOr("", [locale, "Coupons", "couponType"], t)}
                  </label>
                  <select
                    id={pathOr("", [locale, "Coupons", "couponType"], t)}
                    className="form-control form-select"
                    onChange={(e) =>
                      setCouponPayload({
                        ...couponPayload,
                        discountTypeID: +e.target.value,
                      })
                    }
                  >
                    <option disabled hidden value={0}>
                      {pathOr("", [locale, "Coupons", "couponType"], t)}
                    </option>
                    <option value={1}>{pathOr("", [locale, "Coupons", "fixedPrice"], t)}</option>
                    <option value={2}>{pathOr("", [locale, "Coupons", "percentagePrice"], t)}</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div className="form-group">
                  <label htmlFor="discount">
                    {couponPayload.discountTypeID == 1
                      ? pathOr("", [locale, "Coupons", "discountAmount"], t)
                      : pathOr("", [locale, "Coupons", "discountPercentage"], t)}
                  </label>
                  <div
                    className={`${styles["input-group"]} input-group`}
                    style={{
                      flexDirection: locale === "en" ? "row-reverse" : "row",
                    }}
                  >
                    <span className={`${styles["input-group-text"]} input-group-text main-color f-b`} id="basic-addon1">
                      {couponPayload.discountTypeID == 1 ? pathOr("", [locale, "Products", "currency"], t) : "%"}
                    </span>
                    <div className="po_R flex-grow-1">
                      <input
                        id="discount"
                        type="number"
                        className={`${styles["form-control"]} form-control`}
                        min={1}
                        max={couponPayload.discountTypeID == 2 ? 100 : undefined}
                        value={couponPayload.discountValue}
                        onKeyDown={(e) => onlyNumbersInInputs(e)}
                        onChange={(e) => {
                          let value = e.target.value
                          if (couponPayload.discountTypeID == 2 && value > 100) {
                            value = 100
                          }
                          setCouponPayload({ ...couponPayload, discountValue: value })
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Is Free Delivery */}
                <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
                  <label htmlFor={pathOr("", [locale, "Coupons", "isFreeDelivery"], t)} className="f-b">
                    {pathOr("", [locale, "Coupons", "isFreeDelivery"], t)}
                  </label>
                  <div className="form-check form-switch p-0 m-0">
                    <input
                      id={pathOr("", [locale, "Coupons", "isFreeDelivery"], t)}
                      className="form-check-input m-0"
                      type="checkbox"
                      role="switch"
                      checked={couponPayload.IsFreeDelivery}
                      onChange={() =>
                        setCouponPayload({
                          ...couponPayload,
                          IsFreeDelivery: !couponPayload.IsFreeDelivery,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Exclude Discounted Products */}
                <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
                  <label htmlFor={pathOr("", [locale, "Coupons", "discountedExcluded"], t)} className="f-b">
                    {pathOr("", [locale, "Coupons", "discountedExcluded"], t)}
                  </label>
                  <div className="form-check form-switch p-0 m-0">
                    <input
                      id={pathOr("", [locale, "Coupons", "discountedExcluded"], t)}
                      className="form-check-input m-0"
                      type="checkbox"
                      role="switch"
                      checked={couponPayload.excludeDiscountedProducts}
                      onChange={() =>
                        setCouponPayload({
                          ...couponPayload,
                          excludeDiscountedProducts: !couponPayload.excludeDiscountedProducts,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Minimum Products Amount */}
                <div className="form-group">
                  <label htmlFor={pathOr("", [locale, "Coupons", "minimumProductsAmount"], t)}>
                    {pathOr("", [locale, "Coupons", "minimumProductsAmount"], t)}
                  </label>
                  <div
                    className={`${styles["input-group"]} input-group`}
                    style={{
                      flexDirection: locale === "en" ? "row-reverse" : "row",
                    }}
                  >
                    <span className={`${styles["input-group-text"]} input-group-text main-color f-b`} id="basic-addon1">
                      {pathOr("", [locale, "Products", "currency"], t)}
                    </span>
                    <div className="po_R flex-grow-1">
                      <input
                        id={pathOr("", [locale, "Coupons", "minimumProductsAmount"], t)}
                        type="number"
                        className={`${styles["form-control"]} form-control`}
                        min={1}
                        value={couponPayload.maximumDiscount}
                        onKeyDown={(e) => onlyNumbersInInputs(e)}
                        onChange={(e) => {
                          let value = e.target.value
                          setCouponPayload({ ...couponPayload, maximumDiscount: value })
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Discount Expiry Date */}
                <div className="form-group">
                  <label>{pathOr("", [locale, "Coupons", "discountExpiryDate"], t)}</label>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label=""
                      value={couponPayload.ExpiryDate}
                      onChange={handleChangeDate}
                      minDate={new Date()}
                      renderInput={(params) => (
                        <TextField
                          sx={{
                            width: "100%",
                            fontSize: "1rem",
                            fontWeight: "400",
                            lineHeight: 1.5,
                            color: "#495057",
                            backgroundColor: "#fff",
                            border: "1px solid #ced4da",
                            borderRadius: "50px !important",
                            textIndent: 10,
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                              outline: "none",
                            },
                          }}
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </div>

                {/* Max Use Limit and Max Use Per Client */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor={pathOr("", [locale, "Coupons", "numberOfTimesEveryone"], t)}>
                        {pathOr("", [locale, "Coupons", "numberOfTimesEveryone"], t)}
                      </label>
                      <div className="inpt_numb">
                        <button
                          onClick={(e) => handleIncrease(e, "maxUseLimit")}
                          className="btn_ plus"
                          aria-label="increase max use limit by 1"
                        >
                          <FaPlus />
                        </button>
                        <input
                          id={pathOr("", [locale, "Coupons", "numberOfTimesEveryone"], t)}
                          type="number"
                          className="form-control"
                          value={couponPayload.maxUseLimit}
                          onChange={(e) =>
                            setCouponPayload({
                              ...couponPayload,
                              maxUseLimit: e.target.value,
                            })
                          }
                          min={1}
                          onKeyDown={(e) => onlyNumbersInInputs(e)}
                        />
                        <button
                          onClick={(e) => handleDecrease(e, "maxUseLimit")}
                          className="btn_ minus"
                          aria-label="decrease max use limit by 1"
                        >
                          <FaMinus />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor={pathOr("", [locale, "Coupons", "numberOfTimesCustomer"], t)}>
                        {pathOr("", [locale, "Coupons", "numberOfTimesCustomer"], t)}
                      </label>
                      <div className="inpt_numb">
                        <button
                          onClick={(e) => handleIncrease(e, "maxUsePerClient")}
                          className="btn_ plus"
                          aria-label="increase max use per client by 1"
                        >
                          <FaPlus />
                        </button>
                        <input
                          id={pathOr("", [locale, "Coupons", "numberOfTimesCustomer"], t)}
                          type="number"
                          className="form-control"
                          value={couponPayload.maxUsePerClient}
                          onChange={(e) =>
                            setCouponPayload({
                              ...couponPayload,
                              maxUsePerClient: e.target.value,
                            })
                          }
                          min={1}
                          onKeyDown={(e) => onlyNumbersInInputs(e)}
                        />
                        <button
                          onClick={(e) => handleDecrease(e, "maxUsePerClient")}
                          className="btn_ minus"
                          aria-label="decrease max use per client by 1"
                        >
                          <FaMinus />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </section>
            <button className="btn-main mt-3" type="button" onClick={() => setEventKey("1")}>
              {pathOr("", [locale, "Coupons", "next"], t)}
            </button>
          </Accordion.Body>
        </Accordion.Item>

        {/* Second Accordion Item */}
        <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="1">
          <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("1")}>
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
                      setCouponPayload({ ...couponPayload, CategoryIds })
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
                      setCouponPayload({ ...couponPayload, FileIds: folderIds })
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
    </article>
  )
}

export default AddCoupon

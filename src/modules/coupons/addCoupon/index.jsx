import styles from "./addCoupon.module.css"
import axios from "axios"
import { FaPlus, FaMinus, FaTrashAlt, FaCamera } from "react-icons/fa"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Autocomplete, Chip, FormControl, MenuItem, OutlinedInput, Select, TextField } from "@mui/material"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { Box } from "@mui/system"
import { useTheme } from "@mui/material/styles"
import { Accordion } from "react-bootstrap"
import { IoIosRemoveCircle } from "react-icons/io"
import { toast } from "react-toastify"
import { pathOr } from "ramda"
import { onlyNumbersInInputs } from "../../../common/functions"
import t from "../../../translations.json"
import Image from "next/image"
import ResponsiveImage from "../../../common/ResponsiveImage"
import Link from "next/link"

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

function getStyles(name, categoryName, theme) {
  return {
    fontWeight:
      categoryName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  }
}

const AddCoupon = () => {
  const { locale, push } = useRouter()
  const theme = useTheme()

  const [couponPayload, setCouponPayload] = useState({
    Id: 0,
    Image: [],
    TitleAr: "",
    TitleEn: "",
    CouponCode: "",
    maximumDiscount: 0,
    IsAdminCoupon: false,
    IsFreeDelivery: false,
    maxUsePerClient: 1,
    ProductIds: [],
    maxUseLimit: 1,
    fixedAmount: 0,
    excludeDiscountedProducts: false,
    ExpiryDate: new Date().toISOString().replace(/T.*/, "").split("-").join("-"),
    CategoryIds: [],
    FileIds: [],
    discountTypeID: 1,
    discountValue: 0,
  })
  const [categoryName, setCategoryName] = useState([])
  const [folderName, setFolderName] = useState([])
  const [categories, setCategories] = useState([])
  const [folders, setFolders] = useState([])
  const [products, setProducts] = useState([])
  const [productsOptions, setProductsOptions] = useState([])
  const [eventKey, setEventKey] = useState("0")
  const [selectedProducts, setSelectedProducts] = useState([])

  const handleDate = (date) => {
    return new Date(Boolean(date) && date).toISOString().replace(/T.*/, "").split("-").join("-")
  }

  const handleChangeDate = (date) => {
    setCouponPayload({ ...couponPayload, ExpiryDate: handleDate(date) })
  }

  const handleIncrease = (e, key) => {
    e.preventDefault()
    setCouponPayload({ ...couponPayload, [key]: e.target.nextSibling.valueAsNumber + 1 })
  }

  const handleDecrease = (e, key) => {
    e.preventDefault()
    const value = e.target.previousSibling.valueAsNumber
    setCouponPayload({ ...couponPayload, [key]: value > 1 ? value - 1 : value })
  }

  const handleChangeSelectedCat = ({ target: { value } }) => {
    setCategoryName(typeof value === "string" ? value.split(",") : value)
    categoryName = typeof value === "string" ? value.split(",") : value
    const selectedCat = categories.filter((category) => categoryName.includes(category.name))
    const CategoryIds = selectedCat.map((category) => category.id)
    setCouponPayload({ ...couponPayload, CategoryIds })
  }

  const handleChangeSelectedFolders = ({ target: { value } }) => {
    setFolderName(typeof value === "string" ? value.split(",") : value)
    folderName = typeof value === "string" ? value.split(",") : value
    const selectedFolder = folders.filter((folder) => folderName.includes(folder.nameAr))
    const folderIds = selectedFolder.map((folder) => folder.id)
    setCouponPayload({ ...couponPayload, FileIds: folderIds })
  }

  const handleLoadProducts = async (e) => {
    const {
      data: { data: productsList },
    } = await axios.get(`${process.env.REACT_APP_API_URL}/ListProductByBusinessAccountId?lang=${locale}`)
    setProducts([...productsList])
    const productsOptionsList = productsList.map((product) => {
      return {
        label: product.name,
        id: +product.id,
      }
    })
    setProductsOptions([...productsOptionsList])
  }

  const handleProductSearch = ({ target: { value } }) => {
    if (!!value) {
      setProductsOptions(productsOptions.filter((product) => product.label.includes(value)))
    }
  }

  const handleProductSelect = (e) => {
    const productIndex = e.target.id.substring(e.target.id.lastIndexOf("-") + 1)
    if (productIndex) {
      const selectedProduct = products[+productIndex]
      if (!selectedProducts.find((product) => product === selectedProduct)) {
        setSelectedProducts([...selectedProducts, selectedProduct])
        setCouponPayload({ ...couponPayload, products: [...selectedProducts, selectedProduct] })
      }
    }
  }

  const handleRemoveSelectedProduct = (productToRemove) => {
    const productIndex = selectedProducts.findIndex((product) => product === productToRemove)
    selectedProducts.splice(productIndex, 1)
    setSelectedProducts([...selectedProducts])
    setCouponPayload({ ...couponPayload, products: [...selectedProducts] })
  }

  const handleRemoveAllSelectedProducts = () => {
    setSelectedProducts([])
    setCouponPayload({ ...couponPayload, products: [] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form_data = new FormData()
    for (let key in couponPayload) {
      if (key === "Image") {
        couponPayload["Image"].map((img) => form_data.append("Image", img))
      } else if (key === "ProductIds") {
        couponPayload["products"]?.map((product) => form_data.append("ProductIds", product.id))
      } else if (key === "FileIds") {
        couponPayload["FileIds"].map((fileId) => form_data.append("FileIds", fileId))
      } else if (key === "CategoryIds") {
        couponPayload["CategoryIds"].map((categoryId) => form_data.append("CategoryIds", categoryId))
      } else {
        form_data.append(key, couponPayload[key])
      }
    }

    const submitCoupon = await axios.post(process.env.REACT_APP_API_URL + "/AddEditCoupon", form_data)
    const { data: submitCouponRes } = submitCoupon

    if (submitCouponRes.status_code === 200) {
      push("./")
      toast.success(locale === "en" ? "Coupon Added Successfully!" : "!تم اضافة الكوبون بنجاح")
    }
  }

  useEffect(() => {
    ;(async () => {
      const {
        data: { data: categories },
      } = await axios.get(`${process.env.REACT_APP_API_URL}/ListAllCategory?currentPage=1`)
      setCategories(categories)
      const {
        data: {
          data: { fileList: folders },
        },
      } = await axios.get(
        `${process.env.REACT_APP_API_URL}/ListFolder?type=1&pageIndex=1&PageRowsCount=10&lang=${locale}`,
      )
      setFolders(folders)
    })()
  }, [locale])

  const handleUploadImages = (e) => {
    let file = e.target.files[0]
    file.id = Date.now()
    setCouponPayload({ ...couponPayload, Image: [file] })
  }
  const handleRemoveImage = (index) => {
    setCouponPayload({ ...couponPayload, Image: couponPayload.Image?.filter((_, i) => i !== index) })
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
        <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="0">
          <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("0")}>
            <span>1</span>
            {pathOr("", [locale, "Coupons", "couponDetails"], t)}
          </Accordion.Button>
          <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
            <section className="form-content">
              <form>
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
                    <div className={styles["btn_apload_img"]}>
                      <FaCamera />
                      <label htmlFor="handleUploadImages" className="visually-hidden">
                        {"handleUploadImages"}
                      </label>
                      <input id="handleUploadImages" type="file" onChange={handleUploadImages} />
                    </div>
                  </div>
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
                        setCouponPayload({ ...couponPayload, TitleAr: e.target.value, TitleEn: e.target.value })
                      }
                    />
                  </div>
                  <div className="mt-4">
                    <label className="f-b fs-5">{pathOr("", [locale, "Coupons", "couponCode"], t)}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={pathOr("", [locale, "Coupons", "couponCode"], t)}
                      value={couponPayload.CouponCode}
                      onChange={(e) =>
                        setCouponPayload({ ...couponPayload, CouponCode: e.target.value.replaceAll(" ", "") })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor={pathOr("", [locale, "Coupons", "couponType"], t)}>
                    {pathOr("", [locale, "Coupons", "couponType"], t)}
                  </label>
                  <select
                    id={pathOr("", [locale, "Coupons", "couponType"], t)}
                    className="form-control form-select"
                    onChange={(e) => setCouponPayload({ ...couponPayload, discountTypeID: +e.target.value })}
                  >
                    <option disabled hidden value={0}>
                      {pathOr("", [locale, "Coupons", "couponType"], t)}
                    </option>
                    <option value={1}>{pathOr("", [locale, "Coupons", "fixedPrice"], t)}</option>
                    <option value={2}>{pathOr("", [locale, "Coupons", "percentagePrice"], t)}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="discount">
                    {couponPayload.discountTypeID == 1
                      ? pathOr("", [locale, "Coupons", "discountAmount"], t)
                      : pathOr("", [locale, "Coupons", "discountPercentage"], t)}
                  </label>
                  <div
                    className={`${styles["input-group"]} input-group`}
                    style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}
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
                      checked={couponPayload.IsFreeDelivery === 0 ? "" : couponPayload.IsFreeDelivery}
                      onChange={() =>
                        setCouponPayload({ ...couponPayload, IsFreeDelivery: !couponPayload.IsFreeDelivery })
                      }
                    />
                  </div>
                </div>
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
                      checked={
                        couponPayload.excludeDiscountedProducts === 0 ? "" : couponPayload.excludeDiscountedProducts
                      }
                      onChange={() =>
                        setCouponPayload({
                          ...couponPayload,
                          excludeDiscountedProducts: !couponPayload.excludeDiscountedProducts,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor={pathOr("", [locale, "Coupons", "minimumProductsAmount"], t)}>
                    {pathOr("", [locale, "Coupons", "minimumProductsAmount"], t)}
                  </label>
                  <div
                    className={`${styles["input-group"]} input-group`}
                    style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}
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
                        max={couponPayload.discountTypeID == 2 ? 100 : undefined}
                        value={couponPayload.maximumDiscount}
                        onKeyDown={(e) => onlyNumbersInInputs(e)}
                        onChange={(e) => {
                          let value = e.target.value
                          if (couponPayload.discountTypeID == 2 && value > 100) {
                            value = 100
                          }
                          setCouponPayload({ ...couponPayload, maximumDiscount: value })
                        }}
                      />
                    </div>
                  </div>
                </div>
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
                          onChange={(e) => setCouponPayload({ ...couponPayload, maxUseLimit: e.target.value })}
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
                          onChange={(e) => setCouponPayload({ ...couponPayload, maxUsePerClient: e.target.value })}
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
        <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="1">
          <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("1")}>
            <span>2</span>
            {pathOr("", [locale, "Coupons", "includedIn"], t)}
          </Accordion.Button>
          <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
            <section className="form-content">
              <form>
                <div className="form-group">
                  <label>{pathOr("", [locale, "Coupons", "catIn"], t)}</label>
                  <FormControl
                    sx={{
                      m: 1,
                      width: "100%",
                      fontSize: "1rem",
                      fontWeight: "400",
                      lineHeight: 1.5,
                      color: "#495057",
                      backgroundColor: "#fff",
                      border: "1px solid #ced4da",
                      borderRadius: "50px !important",
                      textIndent: 10,
                    }}
                    className="no-outline"
                  >
                    <Select
                      multiple
                      value={categoryName}
                      onChange={handleChangeSelectedCat}
                      input={<OutlinedInput />}
                      renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {selected.map((value, index) => (
                            <Chip key={index} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {categories.map((category) => (
                        <MenuItem
                          key={category.id}
                          value={category.name}
                          style={getStyles(category.name, categoryName, theme)}
                        >
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="form-group">
                  <label>{pathOr("", [locale, "Coupons", "foldersIn"], t)}</label>
                  <FormControl
                    sx={{
                      m: 1,
                      width: "100%",
                      fontSize: "1rem",
                      fontWeight: "400",
                      lineHeight: 1.5,
                      color: "#495057",
                      backgroundColor: "#fff",
                      border: "1px solid #ced4da",
                      borderRadius: "50px !important",
                      textIndent: 10,
                    }}
                    className="no-outline"
                  >
                    <Select
                      multiple
                      value={folderName}
                      onChange={handleChangeSelectedFolders}
                      input={<OutlinedInput label=" " />}
                      renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {selected.map((value, index) => (
                            <Chip key={index} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {folders.map((folder) => (
                        <MenuItem key={folder.id} value={folder.name} style={getStyles(folder.name, folderName, theme)}>
                          {folder.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="form-group">
                  <label>{pathOr("", [locale, "Coupons", "productsIn"], t)}</label>
                  <div className="po_R">
                    <Autocomplete
                      disablePortal
                      options={productsOptions}
                      getOptionLabel={(option) => String(option.label)}
                      sx={{
                        m: 1,
                        width: "100%",
                        fontSize: "1rem",
                        fontWeight: "400",
                        lineHeight: 1.5,
                        color: "#495057",
                        backgroundColor: "#fff",
                        border: "1px solid #ced4da",
                        borderRadius: "50px !important",
                        textIndent: 10,
                      }}
                      className="no-outline"
                      onChange={handleProductSelect}
                      renderInput={(params) => (
                        <TextField
                          onFocus={(e) => handleLoadProducts(e)}
                          onChange={handleProductSearch}
                          {...params}
                          label=" "
                        />
                      )}
                    />
                  </div>
                </div>
                {Boolean(selectedProducts?.length) && (
                  <div className="contint_paner">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h5 className="f-b m-0">{pathOr("", [locale, "Coupons", "chosenProd"], t)}</h5>
                      <a onClick={handleRemoveAllSelectedProducts} className="main-color f-b font-18">
                        {pathOr("", [locale, "Coupons", "deleteAll"], t)}
                      </a>
                    </div>
                    <ul>
                      {selectedProducts?.map((product) => (
                        <li key={product?.id} className="d-flex align-items-center justify-content-between mb-3">
                          <div className="d-flex align-items-center">
                            {Boolean(product?.listMedia.length) && (
                              <ResponsiveImage
                                imageSrc={product.listMedia[0].url}
                                alt="product"
                                width={"130px"}
                                height={"100px"}
                              />
                            )}
                            <div>
                              <h6 className="m-0 f-b">{product?.name}</h6>
                              <div className="gray-color">{new Date(product?.updatedAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSelectedProduct(product)}
                            className="btn_Measures"
                          >
                            <FaTrashAlt />
                          </button>
                        </li>
                      ))}
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

import styles from "./addCoupon.module.css"
import axios from "axios"
import { FaPlus, FaMinus, FaTrashAlt,FaCamera } from "react-icons/fa"
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
  const router = useRouter()
  const { locale } = useRouter()
  const theme = useTheme()

  const [couponPayload, setCouponPayload] = useState({
    Id:0,
    Image:[],
    TitleAr:"",
    TitleEn:"",
    CouponCode: "",
    maximumDiscount: 0,
    IsAdminCoupon:false,
    IsFreeDelivery: false,
    maxUsePerClient: 1,
    ProductIds: [],
    maxUseLimit: 1,
    fixedAmount: 0,
    excludeDiscountedProducts: false,
    ExpiryDate: new Date().toISOString().replace(/T.*/, "").split("-").join("-"),
    CategoryIds: [],
    FileIds:[],
    discountTypeID: 1,
    discountValue: 0,

    
  })

  const [discountTypeID, setCouponType] = useState(0)
  const [minimumLimit, setMinimumLimit] = useState(0)
  const [categoryName, setCategoryName] = useState([])
  const [folderName, setFolderName] = useState([])
  const [categories, setCategories] = useState([])
  const [folders, setFolders] = useState([])
  const [products, setProducts] = useState([])
  const [productsOptions, setProductsOptions] = useState([])
  const [eventKey, setEventKey] = useState("0")
  const [selectedProducts, setSelectedProducts] = useState([])

  const handleBack = (e) => {
    e.preventDefault()

    router.push("./")
  }

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
    setCouponPayload({ ...couponPayload, [key]: value >= 1 ? value - 1 : value })
  }

  const handleChangeSelectedCat = ({ target:{value} }) => {
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

  const handleLoadProducts = async () => {
    const {
      data: { data: productsList },
    } = await axios.get(
      `${process.env.REACT_APP_API_URL}/ListProductByBusinessAccountId?currentPage=1&maxRows=10&lang=${locale}`,
    )

    setProducts([...productsList])
    const productsOptionsList = productsList.map((product) => {
      return {
        label: product.name,
        id: product.id,
      }
    })
    setProductsOptions([...productsOptionsList])
  }

  const handleProductSearch = ({ target: { value } }) => {
    if (value) {
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
    for ( let key in couponPayload ) {
      if (key === "Image") {
        couponPayload["Image"].map((img) => form_data.append("Image", img))
      } else if (key === "ProductIds") {
         couponPayload["products"]?.map((product) => form_data.append("ProductIds",product.id))
      }
      else if (key === "FileIds") {
        couponPayload["FileIds"].map((fileId) => form_data.append("FileIds",fileId))
      }
      else if (key === "CategoryIds") {
        couponPayload["CategoryIds"].map((categoryId) => form_data.append("CategoryIds",categoryId))
      }
      else{
      form_data.append(key, couponPayload[key]);
      }
  }


    const submitCoupon = await axios.post(
      process.env.REACT_APP_API_URL + "/AddEditCoupon",
      form_data,
    )
    const { data: submitCouponRes } = submitCoupon

    if (submitCouponRes.status_code === 200) {
      router.push("./")
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
  }
  , [locale])

  const handleUploadImages = (e) => {
    let file = e.target.files[0]
    file.id = Date.now()
    setCouponPayload({ ...couponPayload, Image: [...couponPayload?.Image, file] })
  
  }
  const handleRemoveImage = (index) => {
    setCouponPayload({ ...couponPayload, Image: couponPayload.Image?.filter((_, i) => i !== index) })
  }
  const toggleAccordionPanel = (eKey) => {
    eventKey === eKey ? setEventKey("") : setEventKey(eKey)
  }

  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">اضافة كوبون</h6>
          <a onClick={handleBack} className="btn-main btn-main-o">
            الغاء
          </a>
        </div>
        <Accordion activeKey={eventKey} flush>
          <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="0">
            <Accordion.Button bsPrefix={styles["header_Accord"]}  onClick={() => toggleAccordionPanel("0")}>
              <span>1</span>
              بيانات الكوبون
            </Accordion.Button>
            <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
              <div className="form-content">
            
                <form>
                  <div className="form-group">
                  <div className={styles["all_upload_Image"]}>
              {couponPayload?.Image?.map((img, index) => (
                <div key={index}  className={styles["the_img_upo"]}>
                  <IoIosRemoveCircle
                    onClick={() => handleRemoveImage(index)}
                    style={{ cursor: "pointer", position: "absolute", top: 5, right: 5, background: "white" }}
                  
                  />
                  <img src={ URL.createObjectURL(img)} />
                  {/* <label>
                    <input
                      type="radio"
                      name="isMain"
                      checked={img.id === mainImgId}
                      onClick={() => handleMainImage(img.id)}
                    />
                  </label> */}
                </div>
             ))} 
              <div className={styles["btn_apload_img"]}>
                <FaCamera />
                <input type="file"  onChange={handleUploadImages} />
                {/* multiple={selectedPack.countImage >= 1} */}
               
              </div>
            </div>
            {locale ==="ar" ? (
            <div>
              <label>
                      عنوان الكوبون
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="عنوان الكوبون"
                      value={couponPayload.TitleAr}
                      onChange={(e) => setCouponPayload({ ...couponPayload, TitleAr: e.target.value , TitleEn: e.target.value })}
                    />
                    </div>):(<div><label>
                      Coupon Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Coupon Title"
                      value={couponPayload.TitleAr}
                      onChange={(e) => setCouponPayload({ ...couponPayload, TitleAr: e.target.value , TitleEn:  e.target.value })}
                    />
                    </div>)}
                     <label>
                      كود الكوبون{" "}
                      <span className="font-18 main-color main-color">حروف عربية وانجليزية بدون مسافات</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="كود الكوبون"
                      value={couponPayload.CouponCode}
                      onChange={(e) => setCouponPayload({ ...couponPayload, CouponCode: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>نوع الكوبون</label>
                    <select
                      className="form-control form-select"
                      // value={couponPayload.discountTypeID}
                      onChange={(e) => setCouponType({ ...couponPayload, discountTypeID: e.target.value })}
                    >
                      <option disabled hidden value={0}>
                        نوع الكوبون
                      </option>
                      <option value={1}>مبلغ ثابت من مجموع طلب العميل</option>
                      <option value={2}>نسبة مئوية من مجموع طلب العميل</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>مبلغ الخصم</label>
                    <div className={`${styles["input-group"]} input-group`}>
                      <span
                        className={`${styles["input-group-text"]} input-group-text main-color f-b`}
                        id="basic-addon1"
                      >
                        S.R
                      </span>
                      <div className="po_R flex-grow-1">
                        <input
                          type="number"
                          className={`${styles["form-control"]} form-control`}
                          value={couponPayload.discountValue}
                          onChange={(e) => setCouponPayload({ ...couponPayload, discountValue: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap mb-3">
                    <span className="f-b">مع شحن مجاني</span>
                    <div className="form-check form-switch p-0 m-0">
                      <input
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
                    <span className="f-b">استثناء المنتجات المخفضة</span>
                    <div className="form-check form-switch p-0 m-0">
                      <input
                        className="form-check-input m-0"
                        type="checkbox"
                        role="switch"
                        checked={couponPayload.excludeDiscountedProducts === 0 ? "" : couponPayload.excludeDiscountedProducts}
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
                    <label>الحد الادني للمشتريات</label>
                    <div className={`${styles["input-group"]} input-group`}>
                      <span
                        className={`${styles["input-group-text"]} input-group-text main-color f-b`}
                        id="basic-addon1"
                      >
                        S.R
                      </span>
                      <div className="po_R flex-grow-1">
                        <input
                          type="number"
                          className={`${styles["form-control"]} form-control`}
                          value={couponPayload.maximumDiscount}
                          onChange={(e) => setCouponPayload({ ...couponPayload, maximumDiscount: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>تاريخ انتهاء التخفيض</label>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label=""
                        value={couponPayload.ExpiryDate}
                        onChange={handleChangeDate}
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
                            }}
                            className="no-outline"
                            {...params}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>عدد مرات الاستخدام للجميع</label>
                        <div className="inpt_numb">
                          <button onClick={(e) => handleIncrease(e, "maxUseLimit")} className="btn_ plus">
                            <FaPlus />
                          </button>
                          <input
                            type="number"
                            className="form-control"
                            value={couponPayload.maxUseLimit}
                            onChange={(e) =>
                              setCouponPayload({ ...couponPayload, maxUseLimit: e.target.value })
                            }
                            min={0}
                          />
                          <button onClick={(e) => handleDecrease(e, "maxUseLimit")} className="btn_ minus">
                            <FaMinus />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>عدد مرات الاستخدام للعميل الواحد</label>
                        <div className="inpt_numb">
                          <button onClick={(e) => handleIncrease(e, "maxUsePerClient")} className="btn_ plus">
                            <FaPlus />
                          </button>
                          <input
                            type="number"
                            className="form-control"
                            value={couponPayload.maxUsePerClient}
                            onChange={(e) =>
                              setCouponPayload({ ...couponPayload, maxUsePerClient: e.target.value })
                            }
                            min={0}
                          />
                          <button onClick={(e) => handleDecrease(e, "maxUsePerClient")} className="btn_ minus">
                            <FaMinus />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <button className="btn-main mt-3" type="button" onClick={() => setEventKey("1")}>
                التالي
              </button>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="1">
            <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("1")}>
              <span>2</span>
              مشمول في الكوبون
            </Accordion.Button>
            <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
              <div className="form-content">
                <form>
                  <div className="form-group">
                    <label>تصنيفات مشمولة</label>
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
                    <label>مجلدات مشمولة</label>
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
                          <MenuItem
                            key={folder.id}
                            value={folder.name}
                            style={getStyles(folder.name, folderName, theme)}
                          >
                            {folder.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="form-group">
                    <label>منتجات مشمولة</label>
                    <div className="po_R">
                      <Autocomplete
                        disablePortal
                        options={productsOptions}
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
                            onFocus={handleLoadProducts}
                            onChange={handleProductSearch}
                            {...params}
                            label=" "
                          />
                        )}
                      />
                      {/* <input type="search" className="form-control" onFocus={handleLoadProducts} onChange={e => handleProductSearch(e, products)} />
                                            <span className="icon_fa">
                                                <img src="../core/imgs/search.svg" />
                                            </span> */}
                    </div>
                  </div>
                  {Boolean(selectedProducts.length) && (
                    <div className="contint_paner">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h5 className="f-b m-0">المنتجات المختارة</h5>
                        <a onClick={handleRemoveAllSelectedProducts} className="main-color f-b font-18">
                          حذف الكل
                        </a>
                      </div>
                      <ul>
                        {selectedProducts.map((product) => (
                          <li key={product.id} className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center">
                              {Boolean(product.listMedia.length) && (
                                <img src={product.listMedia[0].url} className="img_table" />
                              )}
                              <div>
                                <h6 className="m-0 f-b">{product.name}</h6>
                                <div className="gray-color">{new Date(product.updateDate).toLocaleDateString()}</div>
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
                    اضافة
                  </button>
                </form>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  )
}

export default AddCoupon

import { useRouter } from "next/router"
import { Accordion } from "react-bootstrap"
import { FaTrashAlt } from "react-icons/fa"
import styles from "./joinCampaign.module.css"
import { useTheme } from "@mui/material/styles"
import { useEffect, useState } from "react"
import { Autocomplete, Chip, FormControl, MenuItem, OutlinedInput, Select, TextField } from "@mui/material"
import { Box } from "@mui/system"
import axios from "axios"

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
const JoinCampaign = () => {
  const  {locale}= useRouter()
  const router= useRouter()
  const theme = useTheme()
  const [offer , setOffer] = useState();

  const getOffer =async () => {
        const { data: { data: offers } } = await axios(`${process.env.REACT_APP_API_URL}/GetCouponById?id=${router?.query?.id}`
    )
    setOffer(offers)
  }

  useEffect(() => {
    router.query.id && getOffer()
  },[router.query.id])


  const [offerPayload, setOfferPayload] = useState({
    id:router.query.id,
    productIds: [],
    categoryIds: [],
    fileIds: [],
  })

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

    router.push("/marketing")
  }


  const handleChangeSelectedCat = (e) => {
    const {
      target: { value },
    } = e

    setCategoryName(typeof value === "string" ? value.split(",") : value)
    categoryName = typeof value === "string" ? value.split(",") : value
    const selectedCat = categories.filter((category) => categoryName.includes(category.name))
    const categoryIds = selectedCat.map((category) => category.id)
    setOfferPayload({ ...offerPayload, categoryIds })
  }

  const handleChangeSelectedFolders = (e) => {
    const {
      target: { value },
    } = e
    setFolderName(typeof value === "string" ? value.split(",") : value)
    folderName = typeof value === "string" ? value.split(",") : value
    const selectedFolder = folders.filter((folder) => folderName.includes(folder.name))
    const folderIds = selectedFolder.map((folder) => folder.id)
    setOfferPayload({ ...offerPayload, fileIds: folderIds })
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
           const selectedProductIds= selectedProducts.map((selectedProduct) => selectedProduct.id)
        setOfferPayload({ ...offerPayload, productIds: [...selectedProductIds , selectedProduct.id] })
      }
    }
  }

  const handleRemoveSelectedProduct = (productToRemove) => {
    const productIndex = selectedProducts.findIndex((product) => product === productToRemove)
    selectedProducts.splice(productIndex, 1)
    setSelectedProducts([...selectedProducts])
    setOfferPayload({ ...offerPayload, productIds: [...selectedProducts] })
  }

  const handleRemoveAllSelectedProducts = () => {
    setSelectedProducts([])
    setOfferPayload({ ...offerPayload, productIds: [] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const joinOffer = await axios.post(`${process.env.REACT_APP_API_URL}/BusinessAccountSubscribeInCoupon`,offerPayload)
   
    const { data: joinOfferRes } = joinOffer

    if (joinOfferRes.status_code === 200) {
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
  }, [])

  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">الانضمام للقسيمة</h6>
          <a onClick={handleBack} className="btn-main btn-main-o">
            الغاء
          </a>
        </div>
        <Accordion activeKey={eventKey} flush>
          <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="0">
            <Accordion.Button bsPrefix={styles["header_Accord"]} disabled>
              <span>1</span>
              بيانات الكوبون
              <aside>(للأستطلاع فقط)</aside>
            </Accordion.Button>
            <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
              <div className="row">
                <div className="col-lg-5">
                  <div className={styles["info_boxo_"]}>
                    <span>كود الكوبون</span>
                    <span>{offer && offer.couponCode}</span>
                  </div>
                  {offer && offer.discountTypeID === "FixedAmount"? (
                    <div className={styles["info_boxo_"]}>
                      <span>قيمة الخصم</span>
                      <span>{offer && offer.discountValue}</span>
                    </div>
                  ):(
                    <div className={styles["info_boxo_"]}>
                      <span>نسبة الخصم</span>
                      <span>{offer && offer.discountPercentage}%</span>
                    </div>
                  )}
                  <div className={styles["info_boxo_"]}>
                                                <span>مع شحن مجاني</span>
                                                <span>
                                                    {offer && offer.isFreeDelivery ? "نعم":"لا"}
                                                    <span className="font-18 main-color">
                                                        <i className="fas fa-check-circle" />
                                                    </span>
                                                </span>
                                            </div>
                  <div className={styles["info_boxo_"]}>
                    <span>تاريخ انتهاء التخفيض</span>
                    <span>{offer && offer.expiryDate}</span>
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className={styles["info_boxo_"]}>
                    <span>نوع الكوبون</span>
                    <span>
                      {offer && offer.couponType === 1 ? "مبلغ ثابت من مجموع طلب العميل" : "نسبة من مجموع طلب العميل"}
                      <span className="font-18 main-color">
                        <i className="fas fa-check-circle" />
                      </span>
                    </span>
                  </div>
                  <div className={styles["info_boxo_"]}>
                                                <span>الحد الأقصى للخصم</span>
                                                <span>{offer && offer.maximumDiscount} ريال</span>
                                            </div>
                  <div className={styles["info_boxo_"]}>
                                                <span>استثناء المنتجات المخفضة</span>
                                                <span>
                                                    {offer && offer.excludeDiscountedProducts ? "نعم":"لا"}
                                                    <span className="font-18 main-color">
                                                        <i className="fas fa-check-circle" />
                                                    </span>
                                                </span>
                                            </div>
                  <div className={styles["info_boxo_"]}>
                    <span>عدد مرات الاستخدام للعميل الواحد</span>
                    <span>{offer && offer.maxUseLimit === 0 ? 'لايوجد':`${offer && offer.maxUseLimit} مرة`} </span>
                  </div>
                </div>
              </div>
              <button className="btn-main mt-3" type="button" onClick={() => setEventKey("1")}>
                التالي
              </button>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="1">
            <Accordion.Button bsPrefix={styles["header_Accord"]} disabled>
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

export default JoinCampaign

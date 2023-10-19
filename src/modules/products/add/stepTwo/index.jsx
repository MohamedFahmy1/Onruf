/* eslint-disable react/jsx-key */
import { useState, useEffect, useId, Fragment } from "react"
import axios from "axios"
import styles from "./stepTwo.module.css"
import { FaCamera, FaCheckCircle, FaFlag, FaMinus, FaPlus, FaStar } from "react-icons/fa"
import { IoIosRemoveCircle } from "react-icons/io"
import { Accordion, Row, Col } from "react-bootstrap"
import bigger from "../../../../public/images/screencaptur.png"
import Router, { useRouter } from "next/router"
import { omit, pathOr } from "ramda"
import t from "../../../../translations.json"
import { toast } from "react-toastify"
import Alerto from "../../../../common/Alerto"
import BanksData from "./BanksData"

const AddProductStepTwo = ({ catId, product }) => {
  const { locale } = useRouter()
  const router = useRouter()
  const id = useId()
  const [eventKey, setEventKey] = useState("0")
  const [productName, setProductName] = useState("")
  const [stateName, setStateName] = useState("")
  const [countries, setCountries] = useState([])
  const [regions, setRegions] = useState([])
  const [neighborhoods, setNeighborhoods] = useState([])
  const [packat, setPackat] = useState([])
  const [selectedPack, setselectedPack] = useState(packat?.length ? packat[0]?.id : 0)
  const [spesfications, setSpesfications] = useState([])
  const [unlimtedQuantity, setUnlimtedQuantity] = useState(false)
  const [mainImgId, setMainImgId] = useState(null)
  const [mainImageIndex, setMainImageIndex] = useState(undefined)
  const [speficationsPayload, setSpeficationsPayload] = useState([])
  const [userBanksData, setuserBanksData] = useState([])
  const [showBanksData, setShowBanksData] = useState(false)
  const [productPayload, setProductPayload] = useState({
    nameAr: "",
    nameEn: "",
    subTitleAr: "",
    subTitleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    qty: 1,
    status: 1,
    categoryId: catId,
    countryId: null,
    regionId: null,
    neighborhoodId: null,
    District: "",
    Street: "",
    GovernmentCode: "",
    pakatId: null,
    productSep: speficationsPayload,
    listImageFile: [],
    MainImageIndex: undefined,
    // videoUrl: [],
    PickUpDeliveryOption: "",
    // ShippingOptions: null,
    Lat: "30",
    Lon: "30",
    AcceptQuestion: false,
    IsFixedPriceEnabled: true,
    IsAuctionEnabled: false,
    IsNegotiationEnabled: false,
    Price: 0,
    PriceDisc: 0,
    PaymentOptions: [],
    ProductBankAccounts: [],
    IsCashEnabled: true,
    // AuctionStartPrice: 0,
    IsAuctionPaied: false,
    SendOfferForAuction: false,
    // AuctionMinimumPrice: 0,
    // AuctionNegotiateForWhom: "",
    // AuctionNegotiatePrice: 0,
    "ProductPaymentDetailsDto.PakatId": 0,
    "ProductPaymentDetailsDto.AdditionalPakatId": 0,
    "ProductPaymentDetailsDto.ProductPublishPrice": 0,
    "ProductPaymentDetailsDto.EnableFixedPriceSaleFee": 0,
    "ProductPaymentDetailsDto.EnableAuctionFee": 0,
    "ProductPaymentDetailsDto.EnableNegotiationFee": 0,
    "ProductPaymentDetailsDto.ExtraProductImageFee": 0,
    "ProductPaymentDetailsDto.ExtraProductVidoeFee": 0,
    "ProductPaymentDetailsDto.SubTitleFee": 0,
    "ProductPaymentDetailsDto.CouponId": 0,
    "ProductPaymentDetailsDto.CouponDiscountValue": 0,
    "ProductPaymentDetailsDto.TotalAmountBeforeCoupon": 0,
    "ProductPaymentDetailsDto.TotalAmountAfterCoupon": 0,
    "ProductPaymentDetailsDto.PaymentType": "Cash",
    "ProductPaymentDetailsDto.PakatId": 0,
    "ProductPaymentDetailsDto.PakatId": 0,
    "ProductPaymentDetailsDto.PakatId": 0,
    "ProductPaymentDetailsDto.PakatId": 0,
    "ProductPaymentDetailsDto.PakatId": 0,
    "ProductPaymentDetailsDto.PakatId": 0,
    "ProductPaymentDetailsDto.PakatId": 0,
    SendYourAccountInfoToAuctionWinner: false,
  })

  const handleFetchNeighbourhoodsOrRegions = async (url, params = "", id, setState) => {
    try {
      const {
        data: { data },
      } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/${url}?${params}=${id}&currentPage=1&lang=${locale}`)
      setState(data)
    } catch (e) {
      if (!router.pathname.includes("edit")) {
        Alerto(e)
      }
    }
  }
  const fetchCountries = async () => {
    try {
      const { data: countriesData } = await axios(
        process.env.NEXT_PUBLIC_API_URL + `/ListCountries?lang=${locale}&currentPage=1`,
      )
      const { data: countriesList } = countriesData
      setCountries(countriesList)
    } catch (e) {
      Alerto(e)
    }
  }
  const fetchPakatList = async () => {
    try {
      // const { data: packatData } = await axios(
      //   process.env.NEXT_PUBLIC_API_URL + `/getAllPakatsList?lang=${locale}&currentPage=1`,
      // )
      const { data: packatData } = await axios(
        process.env.NEXT_PUBLIC_API_URL +
          `/getAllPakatsList?lang=${locale}&categoryId=${catId}&isAdmin=${true}&PakatType=Additional`,
      )
      const { data: packatList } = packatData
      console.log(packatList)
      setPackat(packatList)
    } catch (e) {
      Alerto(e)
    }
  }
  const fetchBanksData = async () => {
    try {
      const { data: data } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/BankTransfersList`)
      const { data: banksData } = data
      setuserBanksData(banksData)
    } catch (e) {
      Alerto(e)
    }
  }
  const fetchSpecificationsList = async () => {
    try {
      const {
        data: { data: spefications },
      } = await axios(
        `${process.env.NEXT_PUBLIC_API_URL}/ListAllSpecificationAndSubSpecificationByCatId?lang=${locale}&id=${catId}&currentPage=1`,
      )
      const speficationsPayloadList = spefications.map((spefication) => ({
        HeaderSpeAr: spefication.nameAr,
        HeaderSpeEn: spefication.nameEn,
        ValueSpeAr: "",
        ValueSpeEn: "",
        Type: spefication.type,
        SpecificationId: spefication.id,
      }))
      console.log(spefications)
      setSpesfications(spefications)
      setSpeficationsPayload([...speficationsPayloadList])
      // setProductPayload({ ...productPayload, productSep: [...speficationsPayloadList] })
    } catch (e) {
      Alerto("hello")
    }
  }
  useEffect(() => {
    ;(async () => {
      try {
        fetchBanksData()
        fetchSpecificationsList()
        fetchCountries()
        fetchPakatList()
        router.pathname.includes("edit") && setProductPayload(product)
        if (product?.id) {
          handleFetchNeighbourhoodsOrRegions(
            "ListNeighborhoodByRegionId",
            "regionsIds",
            product.countryId,
            setNeighborhoods,
          )
          handleFetchNeighbourhoodsOrRegions("ListRegionsByCountryId", "countriesIds", product.countryId, setRegions)

          const {
            name,
            subTitle,
            description,
            regionName,
            listImageFile,
            regionId,
            listMedia,
            acceptQuestion,
            productMazadNegotiate,
          } = product
          setProductPayload({
            ...omit(
              [
                "isActive",
                "isDelete",
                "isPaied",
                "updatedAt",
                "createdAt",
                "neighborhood",
                "regionName",
                "subTitle",
                "description",
                "name",
                "acceptQuestion",
                "category",
                "country",
                "productMazadNegotiate",
                "regionId",
              ],
              product,
            ),
            listImageFile: listMedia,
            nameEn: name,
            nameAr: name,
            subTitleEn: subTitle,
            subTitleAr: subTitle,
            descriptionAr: description,
            descriptionEn: description,
            regionId: regionId || 1,
            AcceptQuestion: acceptQuestion,
            AuctionNegotiateForWhom: productMazadNegotiate?.forWhom || 0,
            AuctionNegotiatePrice: productMazadNegotiate?.price || 0,
          })
          setStateName(regionName)
        }
      } catch (e) {
        Alerto(e)
      }
    })()
  }, [locale, product])

  const handleUploadImages = (e) => {
    let file = e.target.files[mainImageIndex ? mainImageIndex : 0]
    file.id = Date.now()
    setProductPayload((prev) => ({
      ...prev,
      listImageFile: [...productPayload?.listImageFile, file],
      MainImageIndex: mainImageIndex,
    }))
  }
  const handleChoosePackat = (pack) => {
    if (productPayload.pakatId) {
      setProductPayload({ ...productPayload, pakatId: null })
      setselectedPack(null)
    } else {
      setProductPayload({ ...productPayload, pakatId: pack.id })
      setselectedPack(pack)
    }
  }

  const toggleAccordionPanel = (eKey) => {
    eventKey === eKey ? setEventKey("") : setEventKey(eKey)
  }

  Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0])
  }

  const handleRemoveImage = (index) => {
    if (index === mainImageIndex) {
      setProductPayload({
        ...productPayload,
        MainImageIndex: undefined,
        listImageFile: productPayload.listImageFile?.filter((_, i) => i !== index),
      })
    } else
      setProductPayload({
        ...productPayload,
        listImageFile: productPayload.listImageFile?.filter((_, i) => i !== index),
      })
  }

  const handleMainImage = (id, index) => {
    if (id !== mainImgId) {
      const targetId = productPayload.listImageFile.find((ele) => ele.id === id)?.id
      setMainImgId(targetId)
    } else {
      setMainImgId(null)
    }
    setMainImageIndex(index)
    setProductPayload((prev) => ({
      ...prev,
      MainImageIndex: index,
    }))
  }

  const handleUnlimtedQuantity = ({ target: { checked } }) => {
    if (checked) {
      setUnlimtedQuantity(true)
      setProductPayload({ ...productPayload, qty: null })
    } else {
      setUnlimtedQuantity(false)
      setProductPayload({ ...productPayload, qty: 1 })
    }
  }
  const onChangeSpesfication = ({ target: { value } }, index, type) => {
    const changedSpesfication = { ...speficationsPayload[index], ValueSpeAr: value, ValueSpeEn: value }
    const updatedSpecififcations = Object.assign([], speficationsPayload, { [index]: changedSpesfication })
    setSpeficationsPayload(updatedSpecififcations)
    setProductPayload((prev) => ({ ...prev, productSep: updatedSpecififcations }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    let formData = new FormData()
    if (productPayload.PaymentOptions.includes(1)) {
      setProductPayload({ ...productPayload, IsCashEnabled: true })
    } else setProductPayload({ ...productPayload, IsCashEnabled: false })
    productPayload.listImageFile.forEach((ele, indx) => {
      console.log("sudany", productPayload.listImageFile)
      ele.id === mainImgId && indx !== 0 && productPayload.listImageFile.move(indx, 0)
    })
    for (let key in productPayload) {
      const value = productPayload[key]
      if (key === "listImageFile") {
        for (const image of value) {
          formData.append("listImageFile", image)
        }
      } else if (key === "productSep") {
        formData.append(key, JSON.stringify(value))
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(key, item)
        })
      } else {
        formData.append(key, value)
      }
    }
    console.log("formData", formData)
    try {
      if (product?.id) {
        formData.delete("listMedia")
        const { data } = await axios.put(process.env.NEXT_PUBLIC_API_URL + "/EditProduct", formData)
        toast.success(locale === "en" ? "Products has been updated successfully!" : "تم تعديل المنتج بنجاح")
        Router.push(`/${locale}/products`)
      } else {
        const {
          data: { data: id },
        } = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/AddProduct", formData, {
          headers: {
            accept: "*/*",
            "Content-Type": "multipart/form-data",
          },
        })
        toast.success(locale === "en" ? "Products has been created successfully!" : "تم اضافة المنتج بنجاح")
        // Router.push(`/${locale}/products/add/review/${id}`)
        Router.push(`/${locale}/products`)
      }
    } catch (err) {
      console.error(err)
      Alerto(err)
    }
  }

  const productDetailsInputs = [
    productPayload.nameAr,
    productPayload.nameEn,
    productPayload.descriptionAr,
    productPayload.descriptionEn,
    productPayload.countryId,
    productPayload.regionId,
    productPayload.neighborhoodId,
    productPayload.District,
    productPayload.Street,
    productPayload.GovernmentCode,
  ]

  const inputsChecker = (inputs) => {
    const checkInputIsEmpty = (value) => value?.length > 0 || value != 0
    const isInputEmpty = inputs.every(checkInputIsEmpty)
    return isInputEmpty
  }
  const productDetailsValidation = () => {
    for (let i = 0; i < speficationsPayload.length; i++) {
      if (speficationsPayload[i].ValueSpeAr === "") {
        return toast.error(locale === "en" ? "Please enter all necessary data" : "رجاء ادخال جميع البيانات")
      }
    }
    return setEventKey("2")
  }
  const paymentOptionsHandler = (optionIndex) => {
    if (!productPayload.PaymentOptions.includes(optionIndex)) {
      setProductPayload((prev) => ({
        ...prev,
        PaymentOptions: [...prev.PaymentOptions, optionIndex],
      }))
    } else if (productPayload.PaymentOptions.includes(optionIndex)) {
      setProductPayload((prev) => ({
        ...prev,
        PaymentOptions: prev.PaymentOptions.filter((value) => value !== optionIndex),
      }))
    }
  }
  const { PaymentOptions } = productPayload
  useEffect(() => {
    if (PaymentOptions.includes(1)) {
      setProductPayload((prev) => ({ ...prev, IsCashEnabled: true }))
    } else setProductPayload((prev) => ({ ...prev, IsCashEnabled: false }))
  }, [PaymentOptions])

  console.log("productPayload", productPayload)
  return (
    <Fragment>
      <Accordion activeKey={eventKey} flush>
        <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="0">
          <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("0")}>
            <span>1</span>
            {pathOr("", [locale, "Products", "productImages"], t)}
          </Accordion.Button>
          <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
            <div className={styles["all_upload_Image"]}>
              {productPayload?.listImageFile?.map((img, index) => (
                <div key={id + index} className={styles["the_img_upo"]}>
                  <IoIosRemoveCircle
                    style={{ cursor: "pointer", position: "absolute", top: 5, right: 5, background: "white" }}
                    onClick={() => handleRemoveImage(index)}
                  />
                  <img src={product?.id ? img?.url : URL.createObjectURL(img)} />
                  <label>
                    <span> {pathOr("", [locale, "Products", "mainImage"], t)}</span>
                    <input
                      type="radio"
                      name="isMain"
                      checked={img?.id === mainImgId}
                      onChange={() => handleMainImage(img.id, index)}
                    />
                  </label>
                </div>
              ))}
              <div className={styles["btn_apload_img"]}>
                <FaCamera />
                <input type="file" onChange={handleUploadImages} multiple={selectedPack?.countImage >= 1} />
              </div>
            </div>
            <button
              className="btn-main mt-3 btn-disabled"
              type="button"
              onClick={() => {
                if (productPayload?.listImageFile.length > 0 && productPayload?.MainImageIndex !== undefined) {
                  setEventKey("1")
                } else {
                  if (productPayload?.listImageFile.length <= 0) {
                    toast.error(locale === "en" ? "No photo uploaded for the product" : "لايوجد صور للمنتج")
                  } else if (productPayload?.MainImageIndex === undefined) {
                    toast.error(locale === "en" ? "No main photo selected" : "لم يتم اختيار صورة رئيسية")
                  }
                }
              }}
            >
              {pathOr("", [locale, "Products", "next"], t)}
            </button>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="1">
          <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("1")}>
            <span>2</span>
            {pathOr("", [locale, "Products", "productDetails"], t)}
          </Accordion.Button>
          <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
            <div className="form-content">
              <form>
                {Boolean(spesfications?.length) &&
                  spesfications.map((spesfication, index) => (
                    <div className="form-group" key={spesfication?.id}>
                      <label
                        htmlFor={index}
                        style={{ textAlign: locale === "en" ? "left" : "right", display: "block" }}
                      >
                        {spesfication.name}
                      </label>
                      {spesfication.type === 1 && (
                        <select
                          required={spesfication.isRequired}
                          id={index}
                          // value={productPayload?.listProductSep[1]?.valueSpa}
                          className={`${styles["form-control"]} form-control form-select`}
                          onChange={(e) => onChangeSpesfication(e, index, spesfication.type)}
                        >
                          <option value="" disabled selected hidden>
                            {spesfication?.placeHolder}
                          </option>
                          {Boolean(spesfication?.subSpecifications?.length) &&
                            spesfication.subSpecifications.map((subSpecification) => (
                              <option
                                defaultValue={
                                  productPayload?.listProductSep?.find(
                                    ({ headerSpe }) => headerSpe === spesfication?.name,
                                  )?.valueSpe
                                }
                                key={subSpecification?.id}
                                value={subSpecification.nameAr}
                              >
                                {subSpecification.nameAr}
                              </option>
                            ))}
                        </select>
                      )}
                      {spesfication.type === 2 && (
                        <input
                          type={"text"}
                          id={index}
                          defaultValue={
                            productPayload?.listProductSep?.find(({ headerSpe }) => headerSpe === spesfication?.name)
                              ?.valueSpe
                          }
                          required={spesfication.isRequired}
                          placeholder={spesfication.placeHolder}
                          onChange={(e) => onChangeSpesfication(e, index, spesfication.type)}
                          className={`${styles["form-control"]} form-control`}
                        />
                      )}
                    </div>
                  ))}
              </form>
            </div>
            <button className="btn-main mt-3" type="button" onClick={productDetailsValidation}>
              {pathOr("", [locale, "Products", "next"], t)}
            </button>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="2">
          <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("2")}>
            <span>3</span>
            {pathOr("", [locale, "Products", "advertisementDetails"], t)}
          </Accordion.Button>
          <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
            <div className="form-content">
              <form>
                <Row>
                  <Col md={6}>
                    <div className="form-group">
                      <label style={{ textAlign: locale === "en" ? "left" : "right", display: "block" }}>
                        {pathOr("", [locale, "Products", "productAddress"], t)}
                        <RequiredSympol />
                      </label>
                      <input
                        type="text"
                        className={`form-control ${styles["form-control"]}`}
                        placeholder={pathOr("", [locale, "Products", "enterProductAddress"], t)}
                        value={productPayload.nameAr}
                        onChange={(e) =>
                          setProductPayload({ ...productPayload, nameAr: e.target.value, nameEn: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ textAlign: locale === "en" ? "left" : "right", display: "block" }}>
                        {pathOr("", [locale, "Products", "productSecondaryAddress"], t)}
                      </label>
                      <input
                        type="text"
                        className={`form-control ${styles["form-control"]}`}
                        placeholder={pathOr("", [locale, "Products", "enterProductSecondaryAddress"], t)}
                        value={productPayload.subTitleAr}
                        onChange={(e) =>
                          setProductPayload({
                            ...productPayload,
                            subTitleAr: e.target.value,
                            subTitleEn: e.target.value,
                          })
                        }
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="form-group">
                      <label style={{ textAlign: locale === "en" ? "left" : "right", display: "block" }}>
                        {pathOr("", [locale, "Products", "productDetails"], t)}
                      </label>
                      <textarea
                        className={`form-control ${styles["form-control"]}`}
                        placeholder={pathOr("", [locale, "Products", "enterDetails"], t)}
                        value={productPayload.descriptionAr}
                        onChange={(e) =>
                          setProductPayload({
                            ...productPayload,
                            descriptionAr: e.target.value,
                            descriptionEn: e.target.value,
                          })
                        }
                      />
                    </div>
                  </Col>

                  <Col>
                    <div className="form-group">
                      <label style={{ textAlign: locale === "en" ? "left" : "right", display: "block" }}>
                        {pathOr("", [locale, "Products", "productCondition"], t)}
                      </label>
                      <div className="d-flex gap-3">
                        <div
                          onClick={() =>
                            productPayload.status == 1 ? setProductPayload({ ...productPayload, status: 2 }) : null
                          }
                          className={`${styles.p_select} ${productPayload.status == 2 ? styles.p_select_active : ""}`}
                        >
                          {pathOr("", [locale, "Products", "new"], t)}
                        </div>
                        <div
                          onClick={() =>
                            productPayload.status == 2 ? setProductPayload({ ...productPayload, status: 1 }) : null
                          }
                          className={`${styles.p_select} ${productPayload.status == 1 ? styles.p_select_active : ""}`}
                        >
                          {pathOr("", [locale, "Products", "used"], t)}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="form-group">
                      <label style={{ textAlign: locale === "en" ? "left" : "right", display: "block" }}>
                        {pathOr("", [locale, "Products", "quantity"], t)}
                      </label>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="f-b">{pathOr("", [locale, "Products", "unlimitedQuantity"], t)}</span>
                        <div className="form-check form-switch p-0 m-0">
                          <input
                            className="form-check-input m-0"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                            onChange={(e) => handleUnlimtedQuantity(e)}
                            checked={productPayload.qty === null}
                          />
                        </div>
                      </div>
                      <div className="inpt_numb">
                        <button
                          className="btn_ plus"
                          disabled={unlimtedQuantity}
                          onClick={(e) => {
                            e.preventDefault()
                            setProductPayload({ ...productPayload, qty: productPayload.qty + 1 })
                          }}
                        >
                          <FaPlus />
                        </button>
                        <input
                          type="unlimtedQuantity ? 'text' : 'number'"
                          disabled={unlimtedQuantity}
                          className={`form-control ${styles["form-control"]} ${unlimtedQuantity ? "disabled" : ""}`}
                          value={productPayload.qty == null ? "" : productPayload.qty}
                          onChange={(e) => setProductPayload({ ...productPayload, qty: +e.target.value })}
                        />
                        <button
                          className="btn_ minus"
                          disabled={!productPayload.qty || unlimtedQuantity}
                          onClick={(e) => {
                            e.preventDefault()
                            setProductPayload({ ...productPayload, qty: productPayload.qty - 1 })
                          }}
                        >
                          <FaMinus />
                        </button>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="form-group">
                  <label style={{ textAlign: locale === "en" ? "left" : "right", display: "block" }}>
                    {" "}
                    {pathOr("", [locale, "Products", "address"], t)}
                  </label>
                  <Row>
                    <Col md={6}>
                      <div className="form-group">
                        <div
                          className={`input-group ${styles["input-group"]}`}
                          style={{
                            flexDirection: locale === "en" ? "row-reverse" : "row",
                          }}
                        >
                          <span className={`${styles["input-group-text"]} input-group-text`} id="basic-addon1">
                            <FaFlag fontSize="18px" />
                          </span>
                          <div className="po_R flex-grow-1">
                            <label>{pathOr("", [locale, "Products", "Country"], t)}</label>
                            <select
                              className={`${styles["form-control"]} form-control form-select`}
                              value={productPayload.countryId}
                              onChange={(e) => {
                                setProductPayload({ ...productPayload, countryId: +e.target.value })
                                handleFetchNeighbourhoodsOrRegions(
                                  "ListRegionsByCountryId",
                                  "countriesIds",
                                  +e.target.value,
                                  setRegions,
                                )
                              }}
                            >
                              <option value="" disabled hidden>
                                {pathOr("", [locale, "Products", "select"], t)}
                              </option>
                              {countries?.length &&
                                countries.map((country) => (
                                  <option value={country?.id} key={country?.id}>
                                    {country?.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div
                          className={`input-group ${styles["input-group"]}`}
                          style={{
                            flexDirection: locale === "en" ? "row-reverse" : "row",
                          }}
                        >
                          <span className={`${styles["input-group-text"]} input-group-text`} id="basic-addon1">
                            <FaFlag fontSize="18px" />
                          </span>
                          <div className="po_R flex-grow-1">
                            <label>{pathOr("", [locale, "Products", "govern"], t)}</label>
                            <select
                              className={`${styles["form-control"]} form-control form-select`}
                              value={productPayload.regionId}
                              onChange={(e) => {
                                setProductPayload({ ...productPayload, regionId: +e.target.value })
                                handleFetchNeighbourhoodsOrRegions(
                                  "ListNeighborhoodByRegionId",
                                  "regionsIds",
                                  +e.target.value,
                                  setNeighborhoods,
                                )
                              }}
                            >
                              <option value="">{pathOr("", [locale, "Products", "select"], t)}</option>
                              {regions?.length &&
                                regions.map((region) => (
                                  <option value={region?.id} key={region?.id}>
                                    {region?.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div
                          className={`input-group ${styles["input-group"]}`}
                          style={{
                            flexDirection: locale === "en" ? "row-reverse" : "row",
                          }}
                        >
                          <span className={`${styles["input-group-text"]} input-group-text`} id="basic-addon1">
                            <FaFlag fontSize="18px" />
                          </span>
                          <div className="po_R flex-grow-1">
                            <label>{pathOr("", [locale, "Products", "area"], t)}</label>
                            <select
                              className={`${styles["form-control"]} form-control form-select`}
                              value={productPayload?.neighborhoodId}
                              onChange={(e) => {
                                setProductPayload({ ...productPayload, neighborhoodId: +e.target.value })
                              }}
                            >
                              <option value="">{pathOr("", [locale, "Products", "select"], t)}</option>
                              {neighborhoods?.length &&
                                neighborhoods.map((neighborhood) => (
                                  <option value={neighborhood?.id} key={neighborhood?.id}>
                                    {neighborhood?.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="form-group">
                        <div className="po_R">
                          <label>{pathOr("", [locale, "Products", "neighbourhood"], t)}</label>
                          <input
                            type="text"
                            className={`form-control ${styles["form-control"]}`}
                            placeholder={pathOr("", [locale, "Products", "enterNeighbourhood"], t)}
                            value={stateName}
                            onChange={(e) => {
                              setStateName(e.target.value)
                              setProductPayload({ ...productPayload, District: e.target.value })
                            }}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="po_R">
                          <label>{pathOr("", [locale, "Products", "street"], t)}</label>
                          <input
                            type="text"
                            className={`form-control ${styles["form-control"]}`}
                            placeholder={pathOr("", [locale, "Products", "enterStreet"], t)}
                            value={productPayload.Street}
                            onChange={(e) => setProductPayload({ ...productPayload, Street: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="po_R">
                          <label>{pathOr("", [locale, "Products", "governCode"], t)}</label>
                          <input
                            type="text"
                            className={`form-control ${styles["form-control"]}`}
                            placeholder={pathOr("", [locale, "Products", "enterGovernCode"], t)}
                            value={productPayload.GovernmentCode}
                            onChange={(e) => setProductPayload({ ...productPayload, GovernmentCode: e.target.value })}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap mb-2">
                  <span className="f-b">{pathOr("", [locale, "Products", "gettingQuestions"], t)}</span>
                  <div className="form-check form-switch p-0 m-0">
                    <input
                      className="form-check-input m-0"
                      type="checkbox"
                      id="flexSwitchCheckChecked"
                      value={productPayload.AcceptQuestion}
                      checked={productPayload.AcceptQuestion}
                      onChange={() =>
                        setProductPayload({ ...productPayload, AcceptQuestion: !productPayload.AcceptQuestion })
                      }
                    />
                  </div>
                </div>
              </form>
            </div>
            <button
              className="btn-main mt-3"
              type="button"
              onClick={() => {
                inputsChecker(productDetailsInputs)
                  ? setEventKey("3")
                  : toast.error(locale === "en" ? " Missing data" : "املأ بعض البيانات  ")
              }}
            >
              {pathOr("", [locale, "Products", "next"], t)}
            </button>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="3">
          <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("3")}>
            <span>4</span>
            {pathOr("", [locale, "Products", "sellingDetails"], t)}
          </Accordion.Button>
          <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
            <div className="form-content">
              <form>
                <Row>
                  <div className="col-12">
                    <div className="form-group">
                      <label style={{ textAlign: locale === "en" ? "left" : undefined, display: "block" }}>
                        {pathOr("", [locale, "Products", "advertisementType"], t)}
                      </label>
                      <div className="row">
                        <div className="col-lg-4 col-md-6">
                          <div className="form-group">
                            <div className="form-control outer-check-input">
                              <div className="form-check form-switch p-0 m-0">
                                <input
                                  className="form-check-input m-0"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckChecked"
                                  checked={
                                    productPayload.IsFixedPriceEnabled === 0 ? "" : productPayload.IsFixedPriceEnabled
                                  }
                                  onChange={() =>
                                    setProductPayload({
                                      ...productPayload,
                                      IsFixedPriceEnabled: !productPayload.IsFixedPriceEnabled,
                                    })
                                  }
                                />
                                <span>{pathOr("", [locale, "Products", "adFixed"], t)}</span>
                                <span className="bord" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="form-group">
                            <div className="form-control outer-check-input">
                              <div className="form-check form-switch p-0 m-0">
                                <input
                                  className="form-check-input m-0"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckChecked"
                                  checked={productPayload.IsAuctionEnabled === 0 ? "" : productPayload.IsAuctionEnabled}
                                  onChange={() =>
                                    setProductPayload({
                                      ...productPayload,
                                      IsAuctionEnabled: !productPayload.IsAuctionEnabled,
                                    })
                                  }
                                />
                                <span>{pathOr("", [locale, "Products", "adAuct"], t)}</span>
                                <span className="bord" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                          <div className="form-group">
                            <div className="form-control outer-check-input">
                              <div className="form-check form-switch p-0 m-0">
                                <input
                                  className="form-check-input m-0"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckChecked"
                                  checked={
                                    productPayload.IsNegotiationEnabled === 0 ? "" : productPayload.IsNegotiationEnabled
                                  }
                                  onChange={() =>
                                    setProductPayload({
                                      ...productPayload,
                                      IsNegotiationEnabled: !productPayload.IsNegotiationEnabled,
                                    })
                                  }
                                />
                                <span>{pathOr("", [locale, "Products", "negotiation"], t)}</span>
                                <span className="bord" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {productPayload.IsFixedPriceEnabled && (
                    <div className="col-md-6">
                      <div className="form-group">
                        <label style={{ textAlign: locale === "en" ? "left" : undefined, display: "block" }}>
                          {pathOr("", [locale, "Products", "productPrice"], t)}
                        </label>
                        <div
                          className={`input-group ${styles["input-group"]}`}
                          style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}
                        >
                          <span
                            className={`${styles["input-group-text"]} input-group-text main-color f-b`}
                            id="basic-addon1"
                          >
                            {pathOr("", [locale, "Products", "currency"], t)}
                          </span>
                          <div className="po_R flex-grow-1">
                            <input
                              type="number"
                              value={productPayload.Price === 0 ? "" : productPayload.Price}
                              onChange={(e) => setProductPayload({ ...productPayload, Price: +e.target.value })}
                              className={`form-control ${styles["form-control"]}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {productPayload.IsAuctionEnabled && (
                    <div className="col-12">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>سعر بدأ المزاد</label>
                            <div className={`input-group ${styles["input-group"]}`}>
                              <span
                                className={`${styles["input-group-text"]} input-group-text main-color f-b`}
                                id="basic-addon1"
                              >
                                {pathOr("", [locale, "Products", "currency"], t)}
                              </span>
                              <div className="po_R flex-grow-1">
                                <input
                                  type="number"
                                  value={productPayload.AuctionStartPrice === 0 ? "" : productPayload.AuctionStartPrice}
                                  onChange={(e) =>
                                    setProductPayload({ ...productPayload, AuctionStartPrice: +e.target.value })
                                  }
                                  className={`form-control ${styles["form-control"]}`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>أقل سعر</label>
                            <div className={`input-group ${styles["input-group"]}`}>
                              <span
                                className={`${styles["input-group-text"]} input-group-text main-color f-b`}
                                id="basic-addon1"
                              >
                                {pathOr("", [locale, "Products", "currency"], t)}
                              </span>
                              <div className="po_R flex-grow-1">
                                <input
                                  type="number"
                                  value={
                                    productPayload.AuctionMinimumPrice === 0 ? " " : productPayload.AuctionMinimumPrice
                                  }
                                  onChange={(e) =>
                                    setProductPayload({ ...productPayload, AuctionMinimumPrice: +e.target.value })
                                  }
                                  className={`form-control ${styles["form-control"]}`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {productPayload.IsNegotiationEnabled && (
                    <div className="contint_paner col-12 px-0">
                      <div className="d-flex align-items-center justify-content-between flex-wrap mb-2 px-3">
                        <span className="f-b">ارسال عروض تفاوض تلقائيا بعد انتهاء المزاد</span>
                        <div className="form-check form-switch p-0 m-0">
                          <input
                            className="form-check-input m-0"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                            checked={
                              productPayload.SendOfferForAuction === 0 ? " " : productPayload.SendOfferForAuction
                            }
                            onChange={() =>
                              setProductPayload({
                                ...productPayload,
                                SendOfferForAuction: !productPayload.SendOfferForAuction,
                              })
                            }
                          />
                        </div>
                      </div>
                      <hr />
                      <div className="px-3">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>أقل سعر</label>
                              <div className={`input-group ${styles["input-group"]}`}>
                                <span
                                  className={`${styles["input-group-text"]} input-group-text main-color f-b`}
                                  id="basic-addon1"
                                >
                                  {pathOr("", [locale, "Products", "currency"], t)}
                                </span>
                                <div className="po_R flex-grow-1">
                                  <input
                                    type="number"
                                    className={`form-control ${styles["form-control"]}`}
                                    value={
                                      productPayload.AuctionNegotiatePrice === 0
                                        ? ""
                                        : productPayload.AuctionNegotiatePrice
                                    }
                                    onChange={(e) =>
                                      setProductPayload({ ...productPayload, AuctionNegotiatePrice: +e.target.value })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>مدة العرض</label>
                              <div className="d-flex gap-3">
                                <div className="status-P">
                                  <input
                                    type="radio"
                                    name="days"
                                    value={"1"}
                                    checked={productPayload.appointment === "1"}
                                    onChange={() => setProductPayload({ ...productPayload, appointment: 1 })}
                                  />
                                  <span>اسبوع</span>
                                  <span className="pord rounded-pill" />
                                  <span className="back rounded-pill" />
                                </div>
                                <div className="status-P">
                                  <input
                                    type="radio"
                                    name="days"
                                    value={"2"}
                                    checked={productPayload.appointment === "2"}
                                    onChange={() => setProductPayload({ ...productPayload, appointment: "2" })}
                                  />
                                  <span>اسبوعين</span>
                                  <span className="pord rounded-pill" />
                                  <span className="back rounded-pill" />
                                </div>
                                <div className="status-P">
                                  <input
                                    type="radio"
                                    name="days"
                                    value={"3"}
                                    checked={productPayload.appointment === "3"}
                                    onChange={() => setProductPayload({ ...productPayload, appointment: "3" })}
                                  />
                                  <span>3 اسابيع</span>
                                  <span className="pord rounded-pill" />
                                  <span className="back rounded-pill" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="form-group">
                              <label>لمن تريد ارسال العرض</label>
                              <div className="d-flex flex-wrap gap-3">
                                <div className="status-P flex-grow-1">
                                  <input
                                    type="radio"
                                    name="offer"
                                    value={1}
                                    defaultChecked={true}
                                    checked={productPayload.AuctionNegotiateForWhom === 1}
                                    onChange={(e) =>
                                      setProductPayload({ ...productPayload, AuctionNegotiateForWhom: 1 })
                                    }
                                  />
                                  <span>جميع المزايدين</span>
                                  <span className="pord rounded-pill" />
                                  <span className="back rounded-pill" />
                                </div>
                                <div className="status-P flex-grow-1">
                                  <input
                                    type="radio"
                                    name="offer"
                                    value={2}
                                    checked={productPayload.AuctionNegotiateForWhom === 2}
                                    onChange={(e) =>
                                      setProductPayload({ ...productPayload, AuctionNegotiateForWhom: 2 })
                                    }
                                  />
                                  <span>لاعلي 3 اسعار في المزايده</span>
                                  <span className="pord rounded-pill" />
                                  <span className="back rounded-pill" />
                                </div>
                                <div className="status-P flex-grow-1">
                                  <input
                                    type="radio"
                                    name="offer"
                                    value={3}
                                    checked={productPayload.AuctionNegotiateForWhom === 3}
                                    onChange={(e) =>
                                      setProductPayload({ ...productPayload, AuctionNegotiateForWhom: 3 })
                                    }
                                  />
                                  <span>للذين اضافو المنتج للمفضلة</span>
                                  <span className="pord rounded-pill" />
                                  <span className="back rounded-pill" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* <div className="col-12 d-flex align-items-center justify-content-between flex-wrap mb-2">
                                        <span className="f-b">ارسال بيانات حسابك للفائز بالمزاد</span>
                                        <div className="form-check form-switch p-0 m-0">
                                            <input
                                                className="form-check-input m-0"
                                                type="checkbox"
                                                role="switch"
                                                id="flexSwitchCheckChecked"
                                            />
                                        </div>
                                    </div> */}
                </Row>
                <Row>
                  <div className="col-12">
                    <div className="form-group">
                      <label style={{ textAlign: locale === "en" ? "left" : undefined, display: "block" }}>
                        {pathOr("", [locale, "Products", "paymentOptions"], t)}
                      </label>
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <div className="form-control outer-check-input">
                              <div className="form-check form-switch p-0 m-0">
                                <input
                                  className="form-check-input m-0"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckChecked"
                                  checked={productPayload.PaymentOptions.includes(1) ? true : false}
                                  onChange={() => paymentOptionsHandler(1)}
                                />
                                <span>{pathOr("", [locale, "Products", "cash"], t)}</span>
                                <span className="bord" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <div className="form-control outer-check-input">
                              <div className="form-check form-switch p-0 m-0">
                                <input
                                  className="form-check-input m-0"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckChecked"
                                  checked={productPayload.PaymentOptions.includes(2) ? true : false}
                                  onChange={() => paymentOptionsHandler(2)}
                                  onClick={() => setShowBanksData(true)}
                                />
                                <span>{pathOr("", [locale, "Products", "bankTransfer"], t)}</span>
                                <span className="bord" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {showBanksData && (
                        <BanksData
                          data={userBanksData}
                          setShowBanksData={setShowBanksData}
                          setProductPayload={setProductPayload}
                        />
                      )}
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <div className="form-control outer-check-input">
                              <div className="form-check form-switch p-0 m-0">
                                <input
                                  className="form-check-input m-0"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckChecked"
                                  checked={productPayload.PaymentOptions.includes(3) ? true : false}
                                  onChange={() => paymentOptionsHandler(3)}
                                />
                                <span>{pathOr("", [locale, "Products", "creditCard"], t)}</span>
                                <span className="bord" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="form-group">
                            <div className="form-control outer-check-input">
                              <div className="form-check form-switch p-0 m-0">
                                <input
                                  className="form-check-input m-0"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckChecked"
                                  checked={productPayload.PaymentOptions.includes(4) ? true : false}
                                  onChange={() => paymentOptionsHandler(4)}
                                />
                                <span>{pathOr("", [locale, "Products", "mada"], t)}</span>
                                <span className="bord" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Row>
              </form>
            </div>
            <button
              className="btn-main mt-3"
              type="button"
              onClick={() =>
                productPayload.Price != " " ||
                (productPayload.AuctionStartPrice && productPayload.AuctionMinimumPrice != " ") ||
                productPayload.AuctionNegotiatePrice != " "
                  ? productPayload.PaymentOptions.length > 0
                    ? setEventKey("4")
                    : toast.error(locale === "en" ? " Missing data" : "املأ بعض البيانات")
                  : toast.error(locale === "en" ? " Missing data" : "املأ بعض البيانات")
              }
            >
              {pathOr("", [locale, "Products", "next"], t)}
            </button>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="4">
          <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("4")}>
            <span>5</span>
            {pathOr("", [locale, "Products", "shippingOptions"], t)}
          </Accordion.Button>
          <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
            <div className="form-content">
              <form>
                <Row>
                  <div className="col-12">
                    <div className="form-group">
                      <label style={{ textAlign: locale === "en" ? "left" : undefined, display: "block" }}>
                        {pathOr("", [locale, "Products", "pickupOptions"], t)}
                      </label>
                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <div className="form-control outer-check-input">
                              <div className="form-check form-switch p-0 m-0">
                                <input
                                  className="form-check-input m-0"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckChecked"
                                  checked={productPayload.PickUpDeliveryOption === "MustPickUp" ? true : false}
                                  onChange={() =>
                                    setProductPayload({
                                      ...productPayload,
                                      PickUpDeliveryOption: "MustPickUp",
                                    })
                                  }
                                />
                                <span> {pathOr("", [locale, "Products", "MustPickUp"], t)}</span>
                                <span className="bord" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <div className="form-control outer-check-input">
                              <div className="form-check form-switch p-0 m-0">
                                <input
                                  className="form-check-input m-0"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckChecked"
                                  checked={productPayload.PickUpDeliveryOption === "NoPickUp" ? true : false}
                                  onChange={() =>
                                    setProductPayload({
                                      ...productPayload,
                                      PickUpDeliveryOption: "NoPickUp",
                                    })
                                  }
                                />
                                <span>{pathOr("", [locale, "Products", "NoPickup"], t)}</span>
                                <span className="bord" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <div className="form-control outer-check-input">
                              <div className="form-check form-switch p-0 m-0">
                                <input
                                  className="form-check-input m-0"
                                  type="checkbox"
                                  role="switch"
                                  id="flexSwitchCheckChecked"
                                  checked={productPayload.PickUpDeliveryOption === "PickUpAvailable" ? true : false}
                                  onChange={() =>
                                    setProductPayload({
                                      ...productPayload,
                                      PickUpDeliveryOption: "PickUpAvailable",
                                    })
                                  }
                                />
                                <span>{pathOr("", [locale, "Products", "pickupAvailable"], t)}</span>
                                <span className="bord" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Row>
              </form>
            </div>
            <button
              className="btn-main mt-3"
              type="button"
              onClick={() =>
                productPayload.PickUpDeliveryOption != ""
                  ? setEventKey("5")
                  : toast.error(locale === "en" ? " Missing data" : "املأ بعض البيانات")
              }
            >
              {pathOr("", [locale, "Products", "next"], t)}
            </button>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="5">
          <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("5")}>
            <span>6</span>
            {pathOr("", [locale, "Products", "publishingPackages"], t)}
          </Accordion.Button>
          <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
            <div className="form-content">
              <div>
                <div className="text-center mt-4 mb-5">
                  <h4 className="f-b"> {pathOr("", [locale, "Products", "choosepaka"], t)}</h4>
                  <h5>{pathOr("", [locale, "Products", "getBenefits"], t)}</h5>
                </div>
                <Row className="justify-content-center">
                  <Col lg={9}>
                    <div className="row justify-content-center">
                      {Boolean(packat?.length) &&
                        packat.map((pack, index) => (
                          <Col md={6} key={pack?.id}>
                            <div
                              className={`${styles["box-Bouquet"]} ${pack.popular ? styles["box-Bouquet-gold"] : ""} ${
                                selectedPack?.id == pack.id ? styles["activePack"] : ""
                              }`}
                              onClick={() => handleChoosePackat(pack)}
                            >
                              <div className={styles["head"]}>
                                <div>{pack.name}</div>
                                <div>
                                  {pack.price} {pathOr("", [locale, "Products", "currency"], t)}
                                </div>
                              </div>
                              <ul className={styles["info"]}>
                                {Boolean(pack.countImage) && (
                                  <li>
                                    <FaStar />
                                    {pathOr("", [locale, "Products", "numPics"], t)}: {pack.countImage}
                                  </li>
                                )}
                                {Boolean(pack.countVideo) && (
                                  <li>
                                    <FaStar />
                                    {pathOr("", [locale, "Products", "numVideos"], t)}: {pack.countVideo}
                                  </li>
                                )}
                                {Boolean(pack.isSms) && (
                                  <li>
                                    <FaStar />
                                    {pathOr("", [locale, "Products", "sendSms"], t)}
                                  </li>
                                )}
                                {Boolean(pack.numMonth) && (
                                  <li>
                                    <FaStar />
                                    {pathOr("", [locale, "Products", "numMonth"], t)}: {pack.numMonth}
                                  </li>
                                )}
                              </ul>
                              {pack.popular && <aside className={styles["Tinf"]}>شائع</aside>}
                              <input
                                type="radio"
                                name="Bouquet"
                                checked={productPayload.pakatId === pack?.id}
                                value={pack?.id}
                              />
                              <span className={styles["check"]}>
                                <FaCheckCircle />
                              </span>
                              <span className={styles["pord"]} />
                            </div>
                          </Col>
                        ))}
                    </div>
                  </Col>
                </Row>
                {selectedPack?.productSize === 1 && (
                  <div className="mt-4">
                    <h5 className="mb-3 f-b text-center">{pathOr("", [locale, "Products", "findChange"], t)}</h5>
                    <Row className="align-items-center">
                      <Col md={5}>
                        <div className={styles["box-product"]}>
                          <div className={styles["imge"]}>
                            {Boolean(productPayload?.listImageFile?.length) && (
                              <img src={URL.createObjectURL(productPayload.listImageFile[0])} />
                            )}
                            <div className={styles["two_btn_"]}>
                              <button className={styles["btn_"]}>
                                {pathOr("", [locale, "Products", "merchant"], t)}
                              </button>
                              <button className={styles["btn_"]}>
                                {pathOr("", [locale, "Products", "freeDelivery"], t)}
                              </button>
                            </div>
                            <div className={styles["time"]}>
                              <div>
                                <span>01</span> Day
                              </div>
                              <div>
                                <span>12</span> Hour
                              </div>
                              <div>
                                <span>20</span> man
                              </div>
                            </div>
                            <button className={styles["btn-star"]}>
                              <FaStar />
                            </button>
                          </div>
                          <div className={styles["info"]}>
                            <div className="mb-3">
                              <h5 className="f-b mb-1">{productName}</h5>
                              <div className="font-18 gray-color">
                                {productPayload?.productPayload?.regionId} - {new Date().toLocaleDateString()}
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="font-18">
                                  <div>{pathOr("", [locale, "Products", "purchasingPrice"], t)}</div>
                                  <div className="f-b main-color">
                                    {productPayload?.Price} {pathOr("", [locale, "Products", "currency"], t)}
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="font-18">
                                  <div>{pathOr("", [locale, "Products", "highestPrice"], t)}</div>
                                  <div className="f-b">290 {pathOr("", [locale, "Products", "currency"], t)}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col lg={2}>
                        <div className="text-center mt-3">
                          <img src={bigger.src} className="img-fluid" />
                        </div>
                      </Col>
                      <Col md={5} lg={4}>
                        <div className={`${styles["box-product"]} ${styles["box-product2"]}`}>
                          <div className={styles["imge"]}>
                            {Boolean(productPayload?.listImageFile?.length) && (
                              <img src={URL.createObjectURL(productPayload?.listImageFile?.[0])} />
                            )}
                            <div className={styles["two_btn_"]}>
                              <button className={styles["btn_"]}>
                                {pathOr("", [locale, "Products", "merchant"], t)}
                              </button>
                              <button className={styles["btn_"]}>
                                {pathOr("", [locale, "Products", "freeDelivery"], t)}
                              </button>
                            </div>
                            <div className={styles["time"]}>
                              <div>
                                <span>01</span> Day
                              </div>
                              <div>
                                <span>12</span> Hour
                              </div>
                              <div>
                                <span>20</span> man
                              </div>
                            </div>
                            <button className={styles["btn-star"]}>
                              <FaStar />
                            </button>
                          </div>
                          <div className={styles["info"]}>
                            <div className="mb-3">
                              <h5 className="f-b mb-1">{productName}</h5>
                              <div className="font-18 gray-color">
                                {productPayload?.regionId} - {new Date().toLocaleDateString()}
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="font-18">
                                  <div>{pathOr("", [locale, "Products", "purchasingPrice"], t)}</div>
                                  <div className="f-b main-color">
                                    {productPayload?.Price} {pathOr("", [locale, "Products", "currency"], t)}
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="font-18">
                                  <div>{pathOr("", [locale, "Products", "highestPrice"], t)}</div>
                                  <div className="f-b">290 {pathOr("", [locale, "Products", "currency"], t)}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            </div>
            <button
              className="btn-main mt-3"
              style={{ display: "block", margin: "0 auto" }}
              type="button"
              onClick={handleSubmit}
            >
              {router.pathname.includes("edit")
                ? pathOr("", [locale, "Products", "edit"], t)
                : pathOr("", [locale, "Products", "addNewProduct"], t)}
            </button>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Fragment>
  )
}

export default AddProductStepTwo
const RequiredSympol = () => <span style={{ color: "red", fontSize: "1.3rem" }}>*</span>

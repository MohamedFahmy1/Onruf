import { useState, useEffect, useId, Fragment } from "react"
import axios from "axios"
import styles from "./stepTwo.module.css"
import { FaCamera, FaCheckCircle, FaFlag, FaMinus, FaPlus, FaStar } from "react-icons/fa"
import { IoIosClose } from "react-icons/io"
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai"
import { Accordion, Row, Col } from "react-bootstrap"
import bigger from "../../../../../public/images/screencaptur.png"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../../../translations.json"
import { toast } from "react-toastify"
import Alerto from "../../../../common/Alerto"
import BanksData from "./BanksData"
import regionImage from "../../../../../public/icons/008-maps.svg"
import cityImage from "../../../../../public/icons/neighboor.svg"
import Image from "next/image"
import AuctionClosingTimeComp from "./AuctionClosingTimeComp"
import { onlyNumbersInInputs } from "../../../../common/functions"
import { textAlignStyle } from "../../../../styles/stylesObjects"

const AddProductStepTwo = ({
  catId,
  selectedCatProps,
  handleGoToReviewPage,
  productPayload,
  setProductPayload,
  editModeOn,
  setEditModeOn,
}) => {
  const { locale, pathname } = useRouter()
  const id = useId()
  const [eventKey, setEventKey] = useState("0")
  const [countries, setCountries] = useState([])
  const [regions, setRegions] = useState([])
  const [neighborhoods, setNeighborhoods] = useState([])
  const [packat, setPackat] = useState([])
  const [selectedPack, setselectedPack] = useState(packat?.length ? packat[0]?.id : 0)
  const [spesfications, setSpesfications] = useState([])
  const [unlimtedQuantity, setUnlimtedQuantity] = useState(productPayload.qty ? false : true)
  const [mainImgId, setMainImgId] = useState(null)
  const [userBanksData, setuserBanksData] = useState([])
  const [showBanksData, setShowBanksData] = useState(false)
  const [shippingOptions, setShippingOptions] = useState([])

  const handleFetchNeighbourhoodsOrRegions = async (url, params = "", id, setState) => {
    try {
      const {
        data: { data },
      } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/${url}?${params}=${id}&currentPage=1&lang=${locale}`)
      setState(data)
    } catch (e) {
      Alerto(e)
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
      const { data: packatData } = await axios(
        process.env.NEXT_PUBLIC_API_URL +
          `/getAllPakatsList?lang=${locale}&categoryId=${catId}&isAdmin=${true}&PakatType=Additional`,
      )
      const { data: packatList } = packatData
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
  const fetchShippingOptions = async () => {
    try {
      const { data: data } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/GetAllShippingOptions`)
      const { data: shippingData } = data
      setShippingOptions(shippingData)
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
      if (pathname.includes("add")) {
        const speficationsPayloadList = spefications.map((spefication) => ({
          HeaderSpeAr: spefication.nameAr,
          HeaderSpeEn: spefication.nameEn,
          ValueSpeAr: "",
          ValueSpeEn: "",
          Type: spefication.type,
          SpecificationId: spefication.id,
        }))
        setProductPayload((prev) => ({ ...prev, productSep: speficationsPayloadList }))
      }
      setSpesfications(spefications)
    } catch (e) {
      Alerto(e)
    }
  }
  useEffect(() => {
    fetchBanksData()
    fetchSpecificationsList()
    fetchShippingOptions()
    fetchCountries()
    fetchPakatList()
  }, [locale])
  useEffect(() => {
    if (productPayload.neighborhoodId) {
      handleFetchNeighbourhoodsOrRegions("ListRegionsByCountryId", "countriesIds", productPayload.countryId, setRegions)
      handleFetchNeighbourhoodsOrRegions(
        "ListNeighborhoodByRegionId",
        "regionsIds",
        productPayload.regionId,
        setNeighborhoods,
      )
    }
  }, [productPayload.neighborhoodId])

  const handleUploadImages = (e) => {
    let file = e.target.files[0]
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      return toast.error(locale === "en" ? "Only image files are allowed!" : "مسموح برفع الصور")
    }
    if (file) {
      file.id = Date.now()
      setProductPayload((prev) => ({
        ...prev,
        listImageFile: [...prev?.listImageFile, file],
      }))
    }
    e.target.value = null
  }
  const handleUrlChange = (index, event) => {
    const newVideoUrls = [...productPayload.videoUrl]
    newVideoUrls[index] = event.target.value
    setProductPayload({ ...productPayload, videoUrl: newVideoUrls })
  }

  const addUrlField = () => {
    const newVideoUrls = [...productPayload.videoUrl, ""]
    if (productPayload.videoUrl.every((url) => url.trim() !== "")) {
      setProductPayload((prev) => ({ ...prev, videoUrl: newVideoUrls }))
    }
  }
  const removeUrlField = (index) => {
    const newVideoUrls = [...productPayload.videoUrl]
    if (newVideoUrls.length > 1) {
      newVideoUrls.splice(index, 1)
      setProductPayload((prev) => ({ ...prev, videoUrl: newVideoUrls }))
    }
  }
  const removeUrlFieldFromListmedia = (id) => {
    setProductPayload((prev) => ({
      ...prev,
      listMedia: productPayload.listMedia?.filter((item) => item.id !== id),
      DeletedMedias: [...productPayload.DeletedMedias, id],
    }))
  }
  const handleChoosePackat = (pack) => {
    if (productPayload.pakatId) {
      setProductPayload({ ...productPayload, pakatId: null, "ProductPaymentDetailsDto.AdditionalPakatId": 0 })
      setselectedPack(null)
    } else {
      setProductPayload({ ...productPayload, pakatId: pack.id, "ProductPaymentDetailsDto.AdditionalPakatId": pack.id })
      setselectedPack(pack)
    }
  }

  const toggleAccordionPanel = (eKey) => {
    if (editModeOn) {
      return setEventKey(eKey)
    } else if (eKey > eventKey) {
      return toast.error(
        locale === "en"
          ? "Please enter all necessary data in current section to proceed!"
          : "من فضلك ادخل جميع البيانات اللازمة في القسم الحالي قبل الانتقال الي القسم التالي",
      )
    } else setEventKey(eKey)
  }

  Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0])
  }

  const handleRemoveImage = (index) => {
    let updatedIndex
    pathname.includes("add")
      ? (updatedIndex = index)
      : (updatedIndex = index + productPayload?.listMedia?.filter((item) => item.type === 1).length)
    if (updatedIndex === productPayload.MainImageIndex) {
      setProductPayload({
        ...productPayload,
        MainImageIndex: null,
        listImageFile: productPayload.listImageFile?.filter((_, i) => i !== index),
      })
    } else
      setProductPayload({
        ...productPayload,
        listImageFile: productPayload.listImageFile?.filter((_, i) => i !== index),
      })
  }
  const handleRemoveImageFromListmedia = (id, index) => {
    let updatedImages = productPayload.listMedia?.filter((item) => item.type === 1)
    if (index === productPayload.MainImageIndex) {
      setProductPayload({
        ...productPayload,
        MainImageIndex: null,
        listMedia: updatedImages.filter((_, i) => i !== index),
        DeletedMedias: [...productPayload.DeletedMedias, id],
      })
    } else {
      setProductPayload({
        ...productPayload,
        listMedia: updatedImages.filter((_, i) => i !== index),
        DeletedMedias: [...productPayload.DeletedMedias, id],
      })
    }
  }

  const handleMainImage = (id, index) => {
    if (id !== mainImgId) {
      const targetId = productPayload.listImageFile.find((ele) => ele.id === id)?.id
      setMainImgId(targetId)
    } else {
      setMainImgId(null)
    }
    setProductPayload((prev) => ({
      ...prev,
      MainImageIndex: index,
    }))
  }

  const handleUnlimtedQuantity = ({ target: { checked } }) => {
    if (checked) {
      setUnlimtedQuantity(true)
      // Update state without 'qty' and "AlmostSoldOutQuantity" props cause there is not qty
      const { qty, AlmostSoldOutQuantity, ...rest } = productPayload
      setProductPayload(rest)
    } else {
      setUnlimtedQuantity(false)
      setProductPayload({ ...productPayload, qty: 1, AlmostSoldOutQuantity: 1 })
    }
  }
  const onChangeSpesfication = ({ target: { value } }, index, type) => {
    const changedSpesfication = { ...productPayload.productSep[index], ValueSpeAr: value, ValueSpeEn: value }
    const updatedSpecififcations = Object.assign([], productPayload.productSep, { [index]: changedSpesfication })
    setProductPayload((prev) => ({ ...prev, productSep: updatedSpecififcations }))
  }

  const productDetailsInputs = [
    productPayload.nameAr,
    productPayload.nameEn,
    productPayload.countryId,
    productPayload.regionId,
    productPayload.neighborhoodId,
    productPayload.qty,
  ]

  const inputsChecker = (inputs) => {
    const checkInputIsEmpty = (value) => value?.length > 0 || value != 0
    const isInputEmpty = inputs.every(checkInputIsEmpty)
    return isInputEmpty
  }
  const productDetailsValidation = () => {
    for (let i = 0; i < productPayload.productSep.length; i++) {
      if (productPayload.productSep[i].ValueSpeAr === "" || productPayload.productSep[i].valueSpeAr === "") {
        return toast.error(locale === "en" ? "Please enter all necessary data" : "رجاء ادخال جميع البيانات")
      }
    }
    return setEventKey("2")
  }
  const paymentOptionsHandler = (optionIndex) => {
    if (optionIndex === 2) {
      setProductPayload((prev) => ({
        ...prev,
        PaymentOptions: [...prev.PaymentOptions, 2],
      }))
    } else if (!productPayload.PaymentOptions?.includes(optionIndex)) {
      setProductPayload((prev) => ({
        ...prev,
        PaymentOptions: [...prev.PaymentOptions, optionIndex],
      }))
    } else if (productPayload.PaymentOptions?.includes(optionIndex)) {
      setProductPayload((prev) => ({
        ...prev,
        PaymentOptions: prev.PaymentOptions.filter((value) => value !== optionIndex),
      }))
    }
  }
  const handleShippingOptions = (optionIndex) => {
    // if the shipping option was not selected
    if (!productPayload.ShippingOptions?.includes(optionIndex)) {
      setProductPayload((prev) => ({
        ...prev,
        ShippingOptions: [...prev.ShippingOptions, +optionIndex],
      }))
    }
    // if the shipping option is already selected
    else if (productPayload.ShippingOptions?.includes(optionIndex)) {
      setProductPayload((prev) => ({
        ...prev,
        ShippingOptions: prev.ShippingOptions.filter((value) => value !== optionIndex),
      }))
      // clear 4 ,5 and 6 options if 2 and 3 options not selected in the array
      if (productPayload.ShippingOptions?.includes(2) || productPayload.ShippingOptions?.includes(3)) {
        setProductPayload((prev) => ({
          ...prev,
          ShippingOptions: prev.ShippingOptions.filter((value) => value !== 4 && value !== 5 && value !== 6),
        }))
      }
    }
  }
  const { PaymentOptions } = productPayload
  useEffect(() => {
    if (PaymentOptions?.includes(1)) {
      setProductPayload((prev) => ({ ...prev, IsCashEnabled: true }))
    } else setProductPayload((prev) => ({ ...prev, IsCashEnabled: false }))
  }, [PaymentOptions])

  const shippingOptionsErrorHandling = () => {
    const hasTwoOrThree = productPayload.ShippingOptions.includes(2) || productPayload.ShippingOptions.includes(3)
    const hasFourFiveOrSix = productPayload.ShippingOptions.some((id) => [4, 5, 6].includes(id))
    if (hasTwoOrThree && !hasFourFiveOrSix) {
      toast.error(
        locale == "en" ? "Please select the highlighted options!" : "من فضلك اختر وسيلة شحن من الوسايل المحدده اعلاه",
      )
    } else if (productPayload.ShippingOptions.length === 0) {
      toast.error(locale == "en" ? "Please select any shipping options!" : "من فضلك اختر اي وسيلة شحن")
    } else if (productPayload.AuctionClosingTime == "" && productPayload.IsAuctionEnabled) {
      toast.error(locale == "en" ? "Please select Autction Duration!" : "رجاء اختر مدة المزاد")
    } else !pathname.includes("edit") ? setEventKey("5") : handleGoToReviewPage()
  }

  const validateProductImages = () => {
    if (
      productPayload?.listImageFile.length > 0 &&
      productPayload?.MainImageIndex !== null &&
      // check that videoUrl array doesn't have empty fileds or user didn't enter any then it's accepted
      (productPayload.videoUrl.every((url) => url.trim() !== "") || productPayload.videoUrl.length === 1)
    ) {
      setEventKey("1")
    } else {
      if (productPayload?.listImageFile.length === 0) {
        if (
          !pathname.includes("add") &&
          productPayload?.listMedia?.filter((item) => item.type === 1)?.length > 0 &&
          productPayload?.MainImageIndex !== null
        ) {
          return setEventKey("1")
        } else return toast.error(locale === "en" ? "No photo uploaded for the product" : "لايوجد صور للمنتج")
      } else if (productPayload?.MainImageIndex === null) {
        return toast.error(locale === "en" ? "No main photo selected" : "لم يتم اختيار صورة رئيسية")
      } else if (!productPayload.videoUrl.every((url) => url.trim() !== "")) {
        return toast.error(
          locale === "en"
            ? "Please Enter Video Url or Remove the empty field it!"
            : "رجاء أدخل لينك الفيديو او امسح الحقل الفارغ",
        )
      }
    }
  }
  const countryFlag = countries?.find((item) => item.id === productPayload.countryId)?.countryFlag
  console.log("productPayload", productPayload)
  return (
    <Accordion activeKey={eventKey} flush>
      <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="0">
        <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("0")}>
          <span>1</span>
          {pathOr("", [locale, "Products", "productImages"], t)}
        </Accordion.Button>
        <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
          {pathname.includes("add") ? (
            <div className={styles["all_upload_Image"]}>
              {productPayload?.listImageFile?.map((img, index) => (
                <div key={id + index} className={styles["the_img_upo"]}>
                  <IoIosClose
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      top: 5,
                      right: 5,
                      background: "white",
                      borderRadius: "50%",
                    }}
                    size={20}
                    onClick={() => handleRemoveImage(index)}
                  />
                  <img src={pathname.includes("add") ? URL.createObjectURL(img) : img?.url} alt="product" />
                  <label htmlFor={img.id}>
                    <span className="mx-1"> {pathOr("", [locale, "Products", "mainImage"], t)}</span>
                    <input
                      id={img.id}
                      type="radio"
                      name="isMain"
                      checked={mainImgId ? img?.id === mainImgId : index === +productPayload.MainImageIndex}
                      onChange={() => handleMainImage(img.id, index)}
                    />
                  </label>
                </div>
              ))}
              <div className={styles["btn_apload_img"]}>
                <FaCamera />
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/gif"
                  onChange={(e) => handleUploadImages(e)}
                  multiple={selectedPack?.countImage >= 1}
                />
              </div>
            </div>
          ) : (
            <div className={styles["all_upload_Image"]}>
              {productPayload?.listMedia
                ?.filter((item) => item.type === 1)
                .map((img, index) => (
                  <div key={id + index} className={styles["the_img_upo"]}>
                    <IoIosClose
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        top: 5,
                        right: 5,
                        background: "white",
                        borderRadius: "50%",
                      }}
                      size={20}
                      onClick={() => handleRemoveImageFromListmedia(img.id, index)}
                    />
                    <img src={img?.url} alt="product" width={200} height={120} />
                    <label htmlFor={img.id}>
                      <span className="mx-1"> {pathOr("", [locale, "Products", "mainImage"], t)}</span>
                      <input
                        id={img.id}
                        name="isMain"
                        type="radio"
                        checked={index === productPayload.MainImageIndex}
                        onChange={() => setProductPayload((prev) => ({ ...prev, MainImageIndex: index }))}
                      />
                    </label>
                  </div>
                ))}
              {productPayload?.listImageFile?.map((img, index) => {
                let updatedIndex = productPayload?.listMedia?.filter((item) => item.type === 1).length + index
                return (
                  <div key={id + updatedIndex} className={styles["the_img_upo"]}>
                    <IoIosClose
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        top: 5,
                        right: 5,
                        background: "white",
                        borderRadius: "50%",
                      }}
                      size={20}
                      onClick={() => handleRemoveImage(index)}
                    />
                    <img src={URL.createObjectURL(img)} alt="product" width={200} height={180} />
                    <label htmlFor={img.id}>
                      <span className="mx-1"> {pathOr("", [locale, "Products", "mainImage"], t)}</span>
                      <input
                        id={img.id}
                        type="radio"
                        name="isMain"
                        checked={updatedIndex === productPayload.MainImageIndex}
                        onChange={() => handleMainImage(img.id, updatedIndex)}
                      />
                    </label>
                  </div>
                )
              })}
              <div className={styles["btn_apload_img"]}>
                <FaCamera />
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/gif"
                  onChange={(e) => handleUploadImages(e)}
                  multiple={selectedPack?.countImage >= 1}
                />
              </div>
            </div>
          )}
          <div className={styles.container}>
            {pathname.includes("add") ? (
              productPayload?.videoUrl?.map((url, index) => (
                <div key={index} className={styles.urlInputContainer}>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e)}
                    placeholder={locale === "en" ? "Please enter a video link" : "ادخل رابط الفيديو"}
                    className={styles.urlInput}
                  />
                  {productPayload.videoUrl.length > 1 && (
                    <button onClick={() => removeUrlField(index)} className={styles.button}>
                      <AiOutlineMinus />
                    </button>
                  )}
                  <button onClick={addUrlField} className={styles.button}>
                    <AiOutlinePlus />
                  </button>
                </div>
              ))
            ) : (
              <Fragment>
                {productPayload?.listMedia
                  ?.filter((item) => item.type === 2)
                  .map((item, index) => (
                    <div key={index + id} className={styles.urlInputContainer}>
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => handleUrlChange(index, e)}
                        placeholder={locale === "en" ? "Please enter a video link" : "ادخل رابط الفيديو"}
                        className={styles.urlInput}
                        disabled
                      />
                      <button onClick={() => removeUrlFieldFromListmedia(item.id)} className={styles.button}>
                        <AiOutlineMinus />
                      </button>
                    </div>
                  ))}
                {productPayload?.videoUrl?.map((url, index) => (
                  <div key={index + id} className={styles.urlInputContainer}>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => handleUrlChange(index, e)}
                      placeholder={locale === "en" ? "Please enter a video link" : "ادخل رابط الفيديو"}
                      className={styles.urlInput}
                    />
                    {productPayload.videoUrl.length > 1 && (
                      <button onClick={() => removeUrlField(index)} className={styles.button}>
                        <AiOutlineMinus />
                      </button>
                    )}
                    <button onClick={addUrlField} className={styles.button}>
                      <AiOutlinePlus />
                    </button>
                  </div>
                ))}
              </Fragment>
            )}
          </div>
          <button className="btn-main mt-3 btn-disabled" type="button" onClick={validateProductImages}>
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
                    <label htmlFor={index} style={{ ...textAlignStyle(locale), display: "block" }}>
                      {spesfication.name}
                    </label>
                    {spesfication.type === 1 && (
                      <select
                        required={spesfication.isRequired}
                        id={index}
                        value={
                          (locale === "en"
                            ? productPayload?.productSep[index]?.ValueSpeEn
                            : productPayload?.productSep[index]?.ValueSpeAr) || ""
                        }
                        className={`${styles["form-control"]} form-control form-select`}
                        onChange={(e) => onChangeSpesfication(e, index, spesfication.type)}
                      >
                        <option value="" disabled hidden>
                          {spesfication?.placeHolder}
                        </option>
                        {Boolean(spesfication?.subSpecifications?.length) &&
                          spesfication.subSpecifications.map((subSpecification) => (
                            <option key={subSpecification?.id} value={subSpecification?.id}>
                              {locale === "en" ? subSpecification.nameEn : subSpecification.nameAr}
                            </option>
                          ))}
                      </select>
                    )}
                    {spesfication.type === 2 && (
                      <input
                        type={"text"}
                        id={index}
                        value={
                          (locale === "en"
                            ? productPayload?.productSep?.find(({ HeaderSpeEn }) => HeaderSpeEn === spesfication?.name)
                                ?.ValueSpeEn
                            : productPayload?.productSep?.find(({ HeaderSpeAr }) => HeaderSpeAr === spesfication?.name)
                                ?.ValueSpeAr) || ""
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
                    <label htmlFor="nameAr" style={{ ...textAlignStyle(locale), display: "block" }}>
                      {pathOr("", [locale, "Products", "productAddressAr"], t)}
                      <RequiredSympol />
                    </label>
                    <input
                      type="text"
                      id="nameAr"
                      className={`form-control ${styles["form-control"]}`}
                      placeholder={pathOr("", [locale, "Products", "enterProductAddressAr"], t)}
                      value={productPayload.nameAr}
                      onChange={(e) => setProductPayload({ ...productPayload, nameAr: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subTitleAr" style={{ ...textAlignStyle(locale), display: "block" }}>
                      {pathOr("", [locale, "Products", "productSecondaryAddressAr"], t)}
                    </label>
                    <input
                      type="text"
                      id="subTitleAr"
                      className={`form-control ${styles["form-control"]}`}
                      placeholder={pathOr("", [locale, "Products", "enterProductSecondaryAddressAr"], t)}
                      value={productPayload.subTitleAr}
                      onChange={(e) =>
                        setProductPayload({
                          ...productPayload,
                          subTitleAr: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label htmlFor="descriptionAr" style={{ ...textAlignStyle(locale), display: "block" }}>
                      {pathOr("", [locale, "Products", "productDetailsAr"], t)}
                    </label>
                    <textarea
                      id="descriptionAr"
                      className={`form-control ${styles["form-control"]}`}
                      placeholder={pathOr("", [locale, "Products", "enterDetailsAr"], t)}
                      value={productPayload.descriptionAr}
                      onChange={(e) =>
                        setProductPayload({
                          ...productPayload,
                          descriptionAr: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <div className="form-group">
                    <label htmlFor="nameEn" style={{ ...textAlignStyle(locale), display: "block" }}>
                      {pathOr("", [locale, "Products", "productAddressEn"], t)}
                      <RequiredSympol />
                    </label>
                    <input
                      type="text"
                      id="nameEn"
                      className={`form-control ${styles["form-control"]}`}
                      placeholder={pathOr("", [locale, "Products", "enterProductAddressEn"], t)}
                      value={productPayload.nameEn}
                      onChange={(e) => setProductPayload({ ...productPayload, nameEn: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subTitleEn" style={{ ...textAlignStyle(locale), display: "block" }}>
                      {pathOr("", [locale, "Products", "productSecondaryAddressEn"], t)}
                    </label>
                    <input
                      type="text"
                      id="subTitleEn"
                      className={`form-control ${styles["form-control"]}`}
                      placeholder={pathOr("", [locale, "Products", "enterProductSecondaryAddressEn"], t)}
                      value={productPayload.subTitleEn}
                      onChange={(e) =>
                        setProductPayload({
                          ...productPayload,
                          subTitleEn: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="form-group">
                    <label htmlFor="descriptionEn" style={{ ...textAlignStyle(locale), display: "block" }}>
                      {pathOr("", [locale, "Products", "productDetailsEn"], t)}
                    </label>
                    <textarea
                      id="descriptionEn"
                      className={`form-control ${styles["form-control"]}`}
                      placeholder={pathOr("", [locale, "Products", "enterDetailsEn"], t)}
                      value={productPayload.descriptionEn}
                      onChange={(e) =>
                        setProductPayload({
                          ...productPayload,
                          descriptionEn: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
                <Col>
                  <div className="form-group">
                    <label style={{ ...textAlignStyle(locale), display: "block" }}>
                      {pathOr("", [locale, "Products", "itemStatus"], t)}
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
                    <label style={{ ...textAlignStyle(locale), display: "block" }}>
                      {pathOr("", [locale, "Products", "quantity"], t)}
                      <RequiredSympol />
                    </label>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <label htmlFor="unlimitedQuantity" className="f-b">
                        {pathOr("", [locale, "Products", "unlimitedQuantity"], t)}
                      </label>
                      <div className="form-check form-switch p-0 m-0">
                        <input
                          className="form-check-input m-0"
                          type="checkbox"
                          role="switch"
                          id="unlimitedQuantity"
                          onChange={(e) => handleUnlimtedQuantity(e)}
                          // checked={productPayload.qty === null}
                          checked={unlimtedQuantity}
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
                        onKeyDown={(e) => onlyNumbersInInputs(e)}
                        onChange={(e) => setProductPayload({ ...productPayload, qty: +e.target.value })}
                      />
                      <button
                        className="btn_ minus"
                        disabled={productPayload.qty == 1 || unlimtedQuantity}
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
              {!unlimtedQuantity && (
                <Row>
                  <Col md={6}>
                    <div className="form-group">
                      <label style={{ ...textAlignStyle(locale), display: "block" }}>
                        {pathOr("", [locale, "Products", "productsAlmostOut"], t)}
                      </label>
                      <div className="inpt_numb">
                        <button
                          className="btn_ plus"
                          onClick={(e) => {
                            e.preventDefault()
                            setProductPayload({
                              ...productPayload,
                              AlmostSoldOutQuantity: productPayload.AlmostSoldOutQuantity + 1,
                            })
                          }}
                        >
                          <FaPlus />
                        </button>
                        <input
                          type="unlimtedQuantity ? 'text' : 'number'"
                          className={`form-control ${styles["form-control"]}`}
                          value={productPayload.AlmostSoldOutQuantity == 0 ? 1 : productPayload.AlmostSoldOutQuantity}
                          onKeyDown={(e) => onlyNumbersInInputs(e)}
                          onChange={(e) =>
                            setProductPayload({ ...productPayload, AlmostSoldOutQuantity: +e.target.value })
                          }
                        />
                        <button
                          className="btn_ minus"
                          disabled={productPayload.AlmostSoldOutQuantity === 1}
                          onClick={(e) => {
                            e.preventDefault()
                            setProductPayload({
                              ...productPayload,
                              AlmostSoldOutQuantity: productPayload.AlmostSoldOutQuantity - 1,
                            })
                          }}
                        >
                          <FaMinus />
                        </button>
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
              <div className="form-group">
                <label style={{ ...textAlignStyle(locale), display: "block" }}>
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
                        <span
                          className={`${styles["input-group-text"]} input-group-text`}
                          id="basic-addon1"
                          style={{ padding: "14px" }}
                        >
                          {productPayload.countryId ? (
                            <img src={countryFlag} alt="country flag" width={30} height={20} />
                          ) : (
                            <FaFlag size={21} style={{ width: "30px" }} />
                          )}
                        </span>
                        <div className="po_R flex-grow-1">
                          <label htmlFor="countryId">{pathOr("", [locale, "Products", "country"], t)}</label>
                          <select
                            id="countryId"
                            className={`${styles["form-control"]} form-control form-select`}
                            value={productPayload.countryId || ""}
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
                              {pathOr("", [locale, "Products", "select"], t)}{" "}
                              {pathOr("", [locale, "Products", "country"], t)}
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
                          <Image src={cityImage} alt="region" width={20} height={20} />
                        </span>
                        <div className="po_R flex-grow-1">
                          <label htmlFor="regionId">{pathOr("", [locale, "Products", "region"], t)}</label>
                          <select
                            id="regionId"
                            className={`${styles["form-control"]} form-control form-select`}
                            value={productPayload.regionId || ""}
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
                            <option value="">
                              {pathOr("", [locale, "Products", "select"], t)}{" "}
                              {pathOr("", [locale, "Products", "region"], t)}
                            </option>
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
                          <Image src={regionImage} alt="region" width={20} height={20} />
                        </span>
                        <div className="po_R flex-grow-1">
                          <label htmlFor="neighborhoodId">{pathOr("", [locale, "Products", "city"], t)}</label>
                          <select
                            id="neighborhoodId"
                            className={`${styles["form-control"]} form-control form-select`}
                            value={productPayload?.neighborhoodId || ""}
                            onChange={(e) => {
                              setProductPayload({ ...productPayload, neighborhoodId: +e.target.value })
                            }}
                          >
                            <option value="">
                              {pathOr("", [locale, "Products", "select"], t)}{" "}
                              {pathOr("", [locale, "Products", "city"], t)}
                            </option>
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
                        <label htmlFor="District">{pathOr("", [locale, "Products", "area"], t)}</label>
                        <input
                          type="text"
                          id="District"
                          className={`form-control ${styles["form-control"]}`}
                          placeholder={pathOr("", [locale, "Products", "enterArea"], t)}
                          value={productPayload.District}
                          onChange={(e) => {
                            setProductPayload({ ...productPayload, District: e.target.value })
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="po_R">
                        <label htmlFor="Street">{pathOr("", [locale, "Products", "street"], t)}</label>
                        <input
                          type="text"
                          id="Street"
                          className={`form-control ${styles["form-control"]}`}
                          placeholder={pathOr("", [locale, "Products", "enterStreet"], t)}
                          value={productPayload.Street}
                          onChange={(e) => setProductPayload({ ...productPayload, Street: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="po_R">
                        <label htmlFor="GovernmentCode">{pathOr("", [locale, "Products", "countryCode"], t)}</label>
                        <input
                          id="GovernmentCode"
                          type="text"
                          className={`form-control ${styles["form-control"]}`}
                          placeholder={pathOr("", [locale, "Products", "enterCountryCode"], t)}
                          value={productPayload.GovernmentCode}
                          onChange={(e) => setProductPayload({ ...productPayload, GovernmentCode: e.target.value })}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="d-flex align-items-center justify-content-between flex-wrap mb-2">
                <label htmlFor="flexSwitchCheckCheck" className="f-b">
                  {pathOr("", [locale, "Products", "gettingQuestions"], t)}
                </label>
                <div className="form-check form-switch p-0 m-0">
                  <input
                    className="form-check-input m-0"
                    type="checkbox"
                    id="flexSwitchCheckCheck"
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
              if (productPayload.qty <= 0 && productPayload.qty !== null) {
                return toast.error(
                  locale === "en"
                    ? "You can't add product with quantity less than 1"
                    : "لا يمكنك اضافة منتج بكمية اقل من 1",
                )
              }
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
                      {pathOr("", [locale, "Products", "salesType"], t)}
                      <RequiredSympol />
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
                                id="IsFixedPriceEnabled"
                                checked={
                                  productPayload.IsFixedPriceEnabled === 0 ? "" : productPayload.IsFixedPriceEnabled
                                }
                                onChange={() =>
                                  setProductPayload({
                                    ...productPayload,
                                    IsFixedPriceEnabled: !productPayload.IsFixedPriceEnabled,
                                  })
                                }
                                disabled={pathname.includes("edit")}
                              />
                              <label htmlFor="IsFixedPriceEnabled">
                                {pathOr("", [locale, "Products", "adFixed"], t)}
                              </label>
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
                                id="IsAuctionEnabled"
                                checked={productPayload.IsAuctionEnabled === 0 ? "" : productPayload.IsAuctionEnabled}
                                onChange={() =>
                                  setProductPayload({
                                    ...productPayload,
                                    IsAuctionEnabled: !productPayload.IsAuctionEnabled,
                                  })
                                }
                                disabled={pathname.includes("edit")}
                              />
                              <label htmlFor="IsAuctionEnabled">{pathOr("", [locale, "Products", "adAuct"], t)}</label>
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
                                id="IsNegotiationEnabled"
                                checked={
                                  productPayload.IsNegotiationEnabled === 0 ? "" : productPayload.IsNegotiationEnabled
                                }
                                onChange={() =>
                                  setProductPayload({
                                    ...productPayload,
                                    IsNegotiationEnabled: !productPayload.IsNegotiationEnabled,
                                  })
                                }
                                disabled={pathname.includes("edit")}
                              />
                              <label htmlFor="IsNegotiationEnabled">
                                {pathOr("", [locale, "Products", "negotiation"], t)}
                              </label>
                              <span className="bord" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {(productPayload.IsFixedPriceEnabled || productPayload.IsNegotiationEnabled) && (
                  <div className="col-md-6">
                    <div className="form-group">
                      <label
                        htmlFor="Price"
                        style={{ textAlign: locale === "en" ? "left" : undefined, display: "block" }}
                      >
                        {pathOr("", [locale, "Products", "purchasingPrice"], t)}
                        <RequiredSympol />
                      </label>
                      <div
                        className={`input-group ${styles["input-group"]}  flex-nowrap`}
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
                            id="Price"
                            type="number"
                            onKeyDown={(e) => onlyNumbersInInputs(e)}
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
                          <label>
                            {pathOr("", [locale, "Products", "auction_start_price"], t)}
                            <RequiredSympol />
                          </label>
                          <div
                            className={`input-group ${styles["input-group"]}  flex-nowrap`}
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
                                onKeyDown={(e) => onlyNumbersInInputs(e)}
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
                          <label>
                            {pathOr("", [locale, "Products", "minimum_price"], t)}
                            <RequiredSympol />
                          </label>
                          <div
                            className={`input-group ${styles["input-group"]}  flex-nowrap`}
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
                                onKeyDown={(e) => onlyNumbersInInputs(e)}
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
                    <div className="contint_paner">
                      <div className="row">
                        <div className="col-12 d-flex align-items-center justify-content-between flex-wrap mb-4 px-3">
                          <span className="f-b fs-5">
                            {pathOr("", [locale, "Products", "auto_send_negotiation_offers_post_auction"], t)}
                          </span>
                          <div className="form-check form-switch p-0 m-0">
                            <input
                              className="form-check-input m-0"
                              type="checkbox"
                              role="switch"
                              id="flexSwitchCheckChecked"
                              checked={productPayload.SendOfferForAuction}
                              onChange={() =>
                                setProductPayload({
                                  ...productPayload,
                                  SendOfferForAuction: !productPayload.SendOfferForAuction,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              {pathOr("", [locale, "Products", "negotiation_price"], t)}
                              <RequiredSympol />
                            </label>
                            <div
                              className={`input-group ${styles["input-group"]} flex-nowrap`}
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
                                  className={`form-control ${styles["form-control"]}`}
                                  onKeyDown={(e) => onlyNumbersInInputs(e)}
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
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <label style={{ ...textAlignStyle(locale), display: "block" }}>
                            {pathOr("", [locale, "Products", "who_to_send_offer"], t)}
                            <RequiredSympol />
                          </label>
                          <div className="d-flex gap-3 flex-wrap">
                            <div
                              onClick={() => setProductPayload({ ...productPayload, AuctionNegotiateForWhom: "All" })}
                              className={`${styles.p_select} ${
                                productPayload.AuctionNegotiateForWhom == "All" ? styles.p_select_active : ""
                              }`}
                            >
                              {pathOr("", [locale, "Products", "all_bidders"], t)}
                            </div>
                            <div
                              onClick={() =>
                                setProductPayload({ ...productPayload, AuctionNegotiateForWhom: "Highest3" })
                              }
                              className={`${styles.p_select} ${
                                productPayload.AuctionNegotiateForWhom == "Highest3" ? styles.p_select_active : ""
                              }`}
                            >
                              {pathOr("", [locale, "Products", "top_three_bidders"], t)}
                            </div>
                            <div
                              onClick={() =>
                                setProductPayload({ ...productPayload, AuctionNegotiateForWhom: "Favorit" })
                              }
                              className={`${styles.p_select} ${
                                productPayload.AuctionNegotiateForWhom == "Favorit" ? styles.p_select_active : ""
                              }`}
                            >
                              {pathOr("", [locale, "Products", "product_favorites"], t)}
                            </div>
                          </div>
                        </div>
                      </div>
                      {
                        <div className="col-12 d-flex align-items-center justify-content-between flex-wrap mb-2 px-1">
                          <span className="f-b fs-5">
                            {pathOr("", [locale, "Products", "send_account_info_to_winner"], t)}
                          </span>
                          <div className="form-check form-switch p-0 m-0">
                            <input
                              className="form-check-input m-0"
                              type="checkbox"
                              role="switch"
                              id="flexSwitchCheckChecked"
                              checked={productPayload.SendYourAccountInfoToAuctionWinner}
                              onChange={(e) =>
                                setProductPayload((prev) => ({
                                  ...prev,
                                  SendYourAccountInfoToAuctionWinner: e.target.checked,
                                }))
                              }
                            />
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                )}
              </Row>
              <Row>
                <div className="col-12">
                  <div className="form-group">
                    <label style={{ textAlign: locale === "en" ? "left" : undefined, display: "block" }}>
                      {pathOr("", [locale, "Products", "paymentOptions"], t)}
                      <RequiredSympol />
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
                                id="cash"
                                checked={productPayload.PaymentOptions?.includes(1) ? true : false}
                                onChange={() => paymentOptionsHandler(1)}
                              />
                              <label htmlFor="cash">{pathOr("", [locale, "Products", "cash"], t)}</label>
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
                                id="bankTransfer"
                                checked={productPayload.PaymentOptions?.includes(2) ? true : false}
                                onChange={() => paymentOptionsHandler(2)}
                                onClick={() => setShowBanksData(true)}
                              />
                              <label htmlFor="bankTransfer">
                                {pathOr("", [locale, "Products", "bankTransfer"], t)}
                              </label>
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
                        productPayload={productPayload}
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
                                checked={true}
                                disabled
                                readOnly
                              />
                              <label>{pathOr("", [locale, "Products", "creditCard"], t)}</label>
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
                                checked={true}
                                disabled
                                readOnly
                              />
                              <label>{pathOr("", [locale, "Products", "mada"], t)}</label>
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
              (productPayload.IsFixedPriceEnabled && !productPayload.Price) ||
              (productPayload.IsAuctionEnabled &&
                (!productPayload.AuctionStartPrice ||
                  !productPayload.AuctionMinimumPrice ||
                  !productPayload.AuctionNegotiatePrice)) ||
              (productPayload.IsNegotiationEnabled && !productPayload.Price)
                ? toast.error(locale === "en" ? " Missing data" : "املأ بعض البيانات")
                : setEventKey("4")
            }
          >
            {pathOr("", [locale, "Products", "next"], t)}
          </button>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="4">
        <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("4")}>
          <span>5</span>
          {pathOr("", [locale, "Products", "shippingAndDuration"], t)}
        </Accordion.Button>
        <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
          <div className="form-content">
            <form>
              <Row>
                {productPayload?.IsAuctionEnabled && !pathname.includes("edit") && (
                  <Fragment>
                    <h5 className="f-b" style={{ ...textAlignStyle(locale), display: "block" }}>
                      {pathOr("", [locale, "Products", "offer_duration"], t)}
                      <RequiredSympol />
                    </h5>
                    <AuctionClosingTimeComp
                      productPayload={productPayload}
                      setProductPayload={setProductPayload}
                      selectedCatProps={selectedCatProps}
                    />
                  </Fragment>
                )}
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label style={{ textAlign: locale === "en" ? "left" : undefined, display: "block" }}>
                      {pathOr("", [locale, "Products", "shippingOptions"], t)}
                    </label>
                    <div className="row">
                      {productPayload.ShippingOptions?.includes(2) || productPayload.ShippingOptions?.includes(3)
                        ? shippingOptions.map((item) => (
                            <div className="col-lg-6 col-md-6" key={item.id}>
                              <div className="form-group">
                                <div
                                  className={`${
                                    [4, 5, 6].includes(item.id) ? "orange-border" : ""
                                  } form-control outer-check-input`}
                                >
                                  <div className="form-check form-switch p-0 m-0">
                                    <input
                                      className="form-check-input m-0"
                                      type="checkbox"
                                      role="switch"
                                      id={item.id + " ShippingOptions"}
                                      checked={productPayload.ShippingOptions?.includes(item.id)}
                                      onChange={() => handleShippingOptions(item.id)}
                                    />
                                    <label htmlFor={item.id + " ShippingOptions"}>{item.shippingOptionName}</label>
                                    <span className="bord" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        : shippingOptions
                            .filter((item) => item.id !== 4 && item.id !== 5 && item.id !== 6)
                            .map((item) => (
                              <div className="col-lg-6 col-md-6" key={item.id}>
                                <div className="form-group">
                                  <div className="form-control outer-check-input">
                                    <div className="form-check form-switch p-0 m-0">
                                      <input
                                        className="form-check-input m-0"
                                        type="checkbox"
                                        role="switch"
                                        id={item.id + " ShippingOptions"}
                                        checked={productPayload.ShippingOptions?.includes(item.id)}
                                        onChange={() => handleShippingOptions(item.id)}
                                      />
                                      <label htmlFor={item.id + " ShippingOptions"}>{item.shippingOptionName}</label>
                                      <span className="bord" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                    </div>
                  </div>
                </div>
              </Row>
            </form>
          </div>
          <button className="btn-main mt-3" type="button" onClick={() => shippingOptionsErrorHandling()}>
            {!pathname.includes("edit")
              ? pathOr("", [locale, "Products", "next"], t)
              : pathOr("", [locale, "Products", "edit"], t)}
          </button>
        </Accordion.Body>
      </Accordion.Item>
      {!pathname.includes("edit") && (
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
                                checked={productPayload.pakatId === +pack?.id}
                                value={+pack?.id}
                                readOnly
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
                            <img
                              src={
                                productPayload.listMedia?.find((item) => item.isMainMadia === true)?.url ||
                                URL.createObjectURL(productPayload.listImageFile[0])
                              }
                            />
                            <div className={styles["two_btn_"]}>
                              <button className={styles["btn_"]}>
                                {pathOr("", [locale, "Products", "merchant"], t)}
                              </button>
                              <button className={styles["btn_"]}>
                                {pathOr("", [locale, "Products", "freeDelivery"], t)}
                              </button>
                            </div>
                            {productPayload.AuctionClosingTime &&
                              new Date(productPayload.AuctionClosingTime) - new Date() > 0 && (
                                <div className={styles["time"]}>
                                  <div>
                                    <span>
                                      {Math.floor(
                                        (new Date(productPayload.AuctionClosingTime) - new Date()) /
                                          (1000 * 60 * 60 * 24),
                                      )}
                                    </span>{" "}
                                    Day
                                  </div>
                                  <div>
                                    <span>
                                      {Math.floor(
                                        ((new Date(productPayload.AuctionClosingTime) - new Date()) %
                                          (1000 * 60 * 60 * 24)) /
                                          (1000 * 60 * 60),
                                      )}
                                    </span>{" "}
                                    Hour
                                  </div>
                                  <div>
                                    <span>
                                      {Math.floor(
                                        ((new Date(productPayload.AuctionClosingTime) - new Date()) %
                                          (1000 * 60 * 60)) /
                                          (1000 * 60),
                                      )}
                                    </span>{" "}
                                    min
                                  </div>
                                </div>
                              )}
                            <button className={styles["btn-star"]}>
                              <FaStar />
                            </button>
                          </div>
                          <div className={styles["info"]}>
                            <div className="mb-3">
                              <h5 className="f-b mb-1">{productPayload?.nameAr}</h5>
                              <div className="font-18 gray-color">
                                {regions?.find((item) => +item.id === +productPayload?.regionId)?.name} -{" "}
                                {new Date().toLocaleDateString()}
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
                              {productPayload?.HighestBidPrice && (
                                <div className="col-md-6">
                                  <div className="font-18">
                                    <div>{pathOr("", [locale, "Products", "highestPrice"], t)}</div>
                                    <div className="f-b">
                                      {productPayload?.HighestBidPrice}{" "}
                                      {pathOr("", [locale, "Products", "currency"], t)}
                                    </div>
                                  </div>
                                </div>
                              )}
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
                            <img
                              src={
                                productPayload.listMedia?.find((item) => item.isMainMadia === true)?.url ||
                                URL.createObjectURL(productPayload?.listImageFile?.[0])
                              }
                            />
                            <div className={styles["two_btn_"]}>
                              <button className={styles["btn_"]}>
                                {pathOr("", [locale, "Products", "merchant"], t)}
                              </button>
                              <button className={styles["btn_"]}>
                                {pathOr("", [locale, "Products", "freeDelivery"], t)}
                              </button>
                            </div>
                            {/*          const auctionClosingTime = new Date(auctionClosingTimeStr)
                              const currentTime = new Date()
                              const timeDifference = auctionClosingTime - currentTime
                              const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
                              const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                              const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))*/}
                            {productPayload.AuctionClosingTime &&
                              new Date(productPayload.AuctionClosingTime) - new Date() > 0 && (
                                <div className={styles["time"]}>
                                  <div>
                                    <span>
                                      {Math.floor(
                                        (new Date(productPayload.AuctionClosingTime) - new Date()) /
                                          (1000 * 60 * 60 * 24),
                                      )}
                                    </span>{" "}
                                    Day
                                  </div>
                                  <div>
                                    <span>
                                      {Math.floor(
                                        ((new Date(productPayload.AuctionClosingTime) - new Date()) %
                                          (1000 * 60 * 60 * 24)) /
                                          (1000 * 60 * 60),
                                      )}
                                    </span>{" "}
                                    Hour
                                  </div>
                                  <div>
                                    <span>
                                      {Math.floor(
                                        ((new Date(productPayload.AuctionClosingTime) - new Date()) %
                                          (1000 * 60 * 60)) /
                                          (1000 * 60),
                                      )}
                                    </span>{" "}
                                    min
                                  </div>
                                </div>
                              )}
                            <button className={styles["btn-star"]}>
                              <FaStar />
                            </button>
                          </div>
                          <div className={styles["info"]}>
                            <div className="mb-3">
                              <h5 className="f-b mb-1">{productPayload?.nameAr}</h5>
                              <div className="font-18 gray-color">
                                {regions?.find((item) => +item.id === +productPayload?.regionId)?.name} -{" "}
                                {new Date().toLocaleDateString()}
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
                              {productPayload?.HighestBidPrice && (
                                <div className="col-md-6">
                                  <div className="font-18">
                                    <div>{pathOr("", [locale, "Products", "highestPrice"], t)}</div>
                                    <div className="f-b">
                                      {productPayload?.HighestBidPrice}{" "}
                                      {pathOr("", [locale, "Products", "currency"], t)}
                                    </div>
                                  </div>
                                </div>
                              )}
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
              onClick={(e) => {
                handleGoToReviewPage()
                pathname.includes("add") && setEditModeOn(true)
              }}
            >
              {pathname.includes("add")
                ? pathOr("", [locale, "Products", "next"], t)
                : pathOr("", [locale, "Products", "edit"], t)}
            </button>
          </Accordion.Body>
        </Accordion.Item>
      )}
    </Accordion>
  )
}

export default AddProductStepTwo
const RequiredSympol = () => <span style={{ color: "red", fontSize: "1.3rem" }}>*</span>

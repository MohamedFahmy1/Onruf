/* eslint-disable react/jsx-key */
import { useState, useEffect, useId } from "react"
import axios from "axios"
import styles from "./stepTwo.module.css"
import { FaCamera, FaCheckCircle, FaFlag, FaMinus, FaPlus, FaStar } from "react-icons/fa"
import { IoIosRemoveCircle } from "react-icons/io"
import { Accordion, Row, Col } from "react-bootstrap"
import bigger from "../../../../public/images/screencaptur.png"
import Router, { useRouter } from "next/router"
import { omit } from "ramda"
import { toast } from "react-toastify"
import CheckRoundedIcon from "@mui/icons-material/CheckRounded"
import Alerto from "../../../../common/Alerto"

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
  const [speficationsPayload, setSpeficationsPayload] = useState([])
  const [productPayload, setProductPayload] = useState({
    nameAr: "",
    nameEn: "",
    subTitleAr: "",
    subTitleEn: "",
    descriptionAr: "",
    descriptionEn: "",
    qty: 1,
    price: 0,
    priceDisc: 0,
    streetName: "",
    codeRegion: "",
    acceptQuestion: false,
    isNegotiationOffers: false,
    withFixedPrice: true,
    isMazad: false,
    isSendOfferForMazad: false,
    startPriceMazad: 0,
    lessPriceMazad: 0,
    mazadNegotiatePrice: 0,
    mazadNegotiateForWhom: 0,
    appointment: "1",
    status: 1,
    categoryId: catId,
    countryId: null,
    regionId: null,
    neighborhoodId: null,
    pakatId: packat[0]?.id,
    productSep: speficationsPayload,
    // productSep: '[{ "HeaderSpeAr": "cbdegyg", "HeaderSpeEn": "cbdegyg", "ValueSpeAr": "", "ValueSpeEn": "", "Type": 2}, { "HeaderSpeAr": "نوع المحرك", "HeaderSpeEn": "نوع المحرك", "ValueSpeAr": "", "ValueSpeEn": "", "Type": 2 }, {"HeaderSpeAr": "model year", "HeaderSpeEn": "model year", "ValueSpeAr": "", "ValueSpeEn": "", "Type": 1 }, {"HeaderSpeAr": "color", "HeaderSpeEn": "color", "ValueSpeAr": "xxxxx", "ValueSpeEn": "xxxxx", "Type": 2 },  {"HeaderSpeAr": "Model", "HeaderSpeEn": "Model", "ValueSpeAr": "xxxxx", "ValueSpeEn": "xxxxx", "Type": 1 }, {"HeaderSpeAr": "Model", "HeaderSpeEn": "Model", "ValueSpeAr": "2022", "ValueSpeEn": "2022", "Type": 1 }]',
    listImageFile: [],
    // videoUrl: [],
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
      const { data: packatData } = await axios(
        process.env.NEXT_PUBLIC_API_URL + `/getAllPakatsList?lang=${locale}&currentPage=1`,
      )
      const { data: packatList } = packatData
      setPackat(packatList)
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
        HeaderSpeAr: spefication.name,
        HeaderSpeEn: spefication.name,
        ValueSpeAr: "",
        ValueSpeEn: "",
        Type: spefication.type,
      }))
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
            acceptQuestions: acceptQuestion,
            mazadNegotiateForWhom: productMazadNegotiate?.forWhom || 0,
            mazadNegotiatePrice: productMazadNegotiate?.price || 0,
          })
          setStateName(regionName)
        }
      } catch (e) {
        Alerto(e)
      }
    })()
  }, [locale, product])

  const handleUploadImages = (e) => {
    let file = e.target.files[0]
    file.id = Date.now()
    setProductPayload({ ...productPayload, listImageFile: [...productPayload?.listImageFile, file] })
  }

  const handleChoosePackat = (pack) => {
    setProductPayload({ ...productPayload, pakatId: pack.id })
    setselectedPack(pack)
  }

  const toggleAccordionPanel = (eKey) => {
    eventKey === eKey ? setEventKey("") : setEventKey(eKey)
  }

  Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0])
  }

  const handleRemoveImage = (index) => {
    setProductPayload({ ...productPayload, listImageFile: productPayload.listImageFile?.filter((_, i) => i !== index) })
  }

  const handleMainImage = (id) => {
    if (id !== mainImgId) {
      const targetId = productPayload.listImageFile.find((ele) => ele.id === id)?.id
      setMainImgId(targetId)
    } else {
      setMainImgId(null)
    }
    // setProductPayload({ ...productPayload })
  }

  const handleUnlimtedQuantity = ({ target: { checked } }) => {
    if (checked) {
      setUnlimtedQuantity(true)
      setProductPayload({ ...productPayload, qty: 1000000 })
    } else {
      setUnlimtedQuantity(false)
      setProductPayload({ ...productPayload, qty: 1 })
    }
  }

  const handleSelectPack = ({ target: { value: pakatId } }, pack) => {
    setProductPayload({ ...productPayload, pakatId })
    setselectedPack(pack)
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
    productPayload.listImageFile.forEach((ele, indx) => {
      console.log("sudany", productPayload.listImageFile)
      ele.id === mainImgId && indx !== 0 && productPayload.listImageFile.move(indx, 0)
    })

    console.log("1", productPayload.productSep)
    for (var key in productPayload) {
      if (key === "listImageFile") {
        for (const image of productPayload["listImageFile"]) {
          formData.append("listImageFile", image)
        }
      } else if (key === "productSep") {
        formData.append(key, JSON.stringify(productPayload[key]))
      } else {
        formData.append(key, productPayload[key])
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
        } = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/AddProduct", formData)
        toast.success(locale === "en" ? "Products has been created successfully!" : "تم اضافة المنتج بنجاح")
        Router.push(`/${locale}/products/add/review/${id}`)
      }
    } catch (err) {
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
    stateName,
    productPayload.streetName,
    productPayload.codeRegion,
  ]

  const inputsChecker = (inputs) => {
    const checkInputIsEmpty = (value) => value?.length > 0 || value != 0
    const isInputEmpty = inputs.every(checkInputIsEmpty)
    return isInputEmpty
  }

  console.log("productPayload", productPayload)

  return (
    <>
      <Accordion activeKey={eventKey} flush>
        <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="0">
          <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("0")}>
            <span>1</span>
            صور المنتج
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
                    <span> الصورة الرئيسيه</span>
                    <input
                      type="radio"
                      name="isMain"
                      checked={img?.id === mainImgId}
                      onClick={() => handleMainImage(img.id)}
                    />
                  </label>
                </div>
              ))}
              <div className={styles["btn_apload_img"]}>
                <FaCamera />
                <input type="file" onChange={handleUploadImages} multiple={selectedPack.countImage >= 1} />
              </div>
            </div>
            <button
              className="btn-main mt-3 btn-disabled"
              type="button"
              onClick={() => {
                productPayload?.listImageFile.length > 0
                  ? setEventKey("1")
                  : toast.error(locale === "en" ? "No photo uploaded for the product" : "لايوجد صور للمنتج ")
              }}
            >
              التالي
            </button>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="1">
          <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("1")}>
            <span>2</span>
            تفاصيل المنتج
          </Accordion.Button>
          <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
            <div className="form-content">
              <form>
                {Boolean(spesfications?.length) &&
                  spesfications.map((spesfication, index) => (
                    <div className="form-group" key={spesfication?.id}>
                      <label>{spesfication.name}</label>
                      {spesfication.type === 1 && (
                        <select
                          required={spesfication.isRequired}
                          // value={productPayload?.listProductSep[1]?.valueSpa}
                          className={`${styles["form-control"]} form-control form-select`}
                          onChange={(e) => onChangeSpesfication(e, 0, 1)}
                        >
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
                          defaultValue={
                            productPayload?.listProductSep?.find(({ headerSpe }) => headerSpe === spesfication?.name)
                              ?.valueSpe
                          }
                          required={spesfication.isRequired}
                          onChange={(e) => onChangeSpesfication(e, 1, 2)}
                          className={`${styles["form-control"]} form-control`}
                        />
                      )}
                    </div>
                  ))}
              </form>
            </div>
            <button className="btn-main mt-3" type="button" onClick={() => setEventKey("2")}>
              التالي
            </button>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="2">
          <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("2")}>
            <span>3</span>
            تفاصيل الاعلان
          </Accordion.Button>
          <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
            <div className="form-content">
              <form>
                <Row>
                  <Col md={6}>
                    <div className="form-group">
                      <label>عنوان المنتج</label> <RequiredSympol />
                      <input
                        type="text"
                        className={`form-control ${styles["form-control"]}`}
                        placeholder="اكتب عنوان المنتج"
                        value={productPayload.nameAr}
                        onChange={(e) =>
                          setProductPayload({ ...productPayload, nameAr: e.target.value, nameEn: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>عنوان فرعي</label>
                      <input
                        type="text"
                        className={`form-control ${styles["form-control"]}`}
                        placeholder="اكتب عنوان الفرعي المنتج"
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
                      <label>تفاصيل المنتج</label>
                      <textarea
                        className={`form-control ${styles["form-control"]}`}
                        placeholder="اكتب التفاصيل هنا"
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
                      <label>حالة المنتج</label>
                      <div className="d-flex gap-3">
                        <div
                          onClick={() =>
                            productPayload.status == 1 ? setProductPayload({ ...productPayload, status: 2 }) : null
                          }
                          className={`${styles.p_select} ${productPayload.status == 2 ? styles.p_select_active : ""}`}
                        >
                          جديد
                        </div>
                        <div
                          onClick={() =>
                            productPayload.status == 2 ? setProductPayload({ ...productPayload, status: 1 }) : null
                          }
                          className={`${styles.p_select} ${productPayload.status == 1 ? styles.p_select_active : ""}`}
                        >
                          مستعمل
                        </div>
                        {/* <div className="status-P">
                          <input
                            type="radio"
                            name="status"
                            checked={productPayload.status === 2}
                            onChange={() => setProductPayload({ ...productPayload, status: 2 })}
                          />
                          <span>جديد</span>
                          <span className="pord" />
                          <span className="back" />
                        </div>
                        <div className="status-P">
                          <input
                            type="radio"
                            name="status"
                            checked={productPayload.status === 1}
                            onChange={() => setProductPayload({ ...productPayload, status: 1 })}
                          />
                          <span>مستعمل</span>
                          <span className="pord" />
                          <span className="back" />
                        </div> */}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="form-group">
                      <label>الكميه</label>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="f-b">كميه غير محدوده</span>
                        <div className="form-check form-switch p-0 m-0">
                          <input
                            className="form-check-input m-0"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                            onChange={(e) => handleUnlimtedQuantity(e)}
                            checked={productPayload.qty == 1000000}
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
                          value={productPayload.qty == 1000000 ? "" : productPayload.qty}
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
                  <label>العنوان</label>
                  <Row>
                    <Col md={6}>
                      <div className="form-group">
                        <div className={`input-group ${styles["input-group"]}`}>
                          <span className={`${styles["input-group-text"]} input-group-text`} id="basic-addon1">
                            <FaFlag fontSize="18px" />
                          </span>
                          <div className="po_R flex-grow-1">
                            <label>البلد</label>
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
                              <option value="">Select</option>
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
                        <div className={`input-group ${styles["input-group"]}`}>
                          <span className={`${styles["input-group-text"]} input-group-text`} id="basic-addon1">
                            <FaFlag fontSize="18px" />
                          </span>
                          <div className="po_R flex-grow-1">
                            <label>المحافظة</label>
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
                              <option value="">Select</option>
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
                        <div className={`input-group ${styles["input-group"]}`}>
                          <span className={`${styles["input-group-text"]} input-group-text`} id="basic-addon1">
                            <FaFlag fontSize="18px" />
                          </span>
                          <div className="po_R flex-grow-1">
                            <label>المنطقة</label>
                            <select
                              className={`${styles["form-control"]} form-control form-select`}
                              value={productPayload?.neighborhoodId}
                              onChange={(e) => {
                                setProductPayload({ ...productPayload, neighborhoodId: +e.target.value })
                              }}
                            >
                              <option value="">Select</option>
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
                          <label>اسم الحي</label>
                          <input
                            type="text"
                            className={`form-control ${styles["form-control"]}`}
                            placeholder="اكتب اسم الحي"
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="po_R">
                          <label>اسم الشارع</label>
                          <input
                            type="text"
                            className={`form-control ${styles["form-control"]}`}
                            placeholder="اكتب اسم الشارع"
                            value={productPayload.streetName}
                            onChange={(e) => setProductPayload({ ...productPayload, streetName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="po_R">
                          <label>كود المحافظة</label>
                          <input
                            type="text"
                            className={`form-control ${styles["form-control"]}`}
                            placeholder="اكتب كود المحافظة"
                            value={productPayload.codeRegion}
                            onChange={(e) => setProductPayload({ ...productPayload, codeRegion: e.target.value })}
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="d-flex align-items-center justify-content-between flex-wrap mb-2">
                  <span className="f-b">تلقي أسئلة من العملاء عن المنتج ؟</span>
                  <div className="form-check form-switch p-0 m-0">
                    <input
                      className="form-check-input m-0"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckChecked"
                      value={productPayload.acceptQuestions}
                      checked={productPayload.acceptQuestions}
                      onChange={() =>
                        setProductPayload({ ...productPayload, acceptQuestion: !productPayload.acceptQuestion })
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
              التالي
            </button>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="3">
          <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("3")}>
            <span>4</span>
            تفاصيل البيع
          </Accordion.Button>
          <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
            <div className="form-content">
              <form>
                <Row>
                  <div className="col-12">
                    <div className="form-group">
                      <label>نوع الاعلان</label>
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
                                  checked={productPayload.withFixedPrice === 0 ? "" : productPayload.withFixedPrice}
                                  onChange={() =>
                                    setProductPayload({
                                      ...productPayload,
                                      withFixedPrice: !productPayload.withFixedPrice,
                                    })
                                  }
                                />
                                <span>اعلان بسعر ثابت</span>
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
                                  checked={productPayload.isMazad === 0 ? "" : productPayload.isMazad}
                                  onChange={() =>
                                    setProductPayload({ ...productPayload, isMazad: !productPayload.isMazad })
                                  }
                                />
                                <span>مزاد</span>
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
                                    productPayload.isNegotiationOffers === 0 ? "" : productPayload.isNegotiationOffers
                                  }
                                  onChange={() =>
                                    setProductPayload({
                                      ...productPayload,
                                      isNegotiationOffers: !productPayload.isNegotiationOffers,
                                    })
                                  }
                                />
                                <span>عروض تفاوض</span>
                                <span className="bord" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {productPayload.withFixedPrice && (
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>سعر المنتج</label>
                        <div className={`input-group ${styles["input-group"]}`}>
                          <span
                            className={`${styles["input-group-text"]} input-group-text main-color f-b`}
                            id="basic-addon1"
                          >
                            S.R
                          </span>
                          <div className="po_R flex-grow-1">
                            <input
                              type="number"
                              value={productPayload.price === 0 ? "" : productPayload.price}
                              onChange={(e) => setProductPayload({ ...productPayload, price: +e.target.value })}
                              className={`form-control ${styles["form-control"]}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {productPayload.isMazad && (
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
                                S.R
                              </span>
                              <div className="po_R flex-grow-1">
                                <input
                                  type="number"
                                  value={productPayload.startPriceMazad === 0 ? "" : productPayload.startPriceMazad}
                                  onChange={(e) =>
                                    setProductPayload({ ...productPayload, startPriceMazad: +e.target.value })
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
                                S.R
                              </span>
                              <div className="po_R flex-grow-1">
                                <input
                                  type="number"
                                  value={productPayload.lessPriceMazad === 0 ? " " : productPayload.lessPriceMazad}
                                  onChange={(e) =>
                                    setProductPayload({ ...productPayload, lessPriceMazad: +e.target.value })
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
                  {productPayload.isNegotiationOffers && (
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
                              productPayload.isSendOfferForMazad === 0 ? " " : productPayload.isSendOfferForMazad
                            }
                            onChange={() =>
                              setProductPayload({
                                ...productPayload,
                                isSendOfferForMazad: !productPayload.isSendOfferForMazad,
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
                                  S.R
                                </span>
                                <div className="po_R flex-grow-1">
                                  <input
                                    type="number"
                                    className={`form-control ${styles["form-control"]}`}
                                    value={
                                      productPayload.mazadNegotiatePrice === 0 ? "" : productPayload.mazadNegotiatePrice
                                    }
                                    onChange={(e) =>
                                      setProductPayload({ ...productPayload, mazadNegotiatePrice: +e.target.value })
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
                                    checked={productPayload.mazadNegotiateForWhom === 1}
                                    onChange={(e) => setProductPayload({ ...productPayload, mazadNegotiateForWhom: 1 })}
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
                                    checked={productPayload.mazadNegotiateForWhom === 2}
                                    onChange={(e) => setProductPayload({ ...productPayload, mazadNegotiateForWhom: 2 })}
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
                                    checked={productPayload.mazadNegotiateForWhom === 3}
                                    onChange={(e) => setProductPayload({ ...productPayload, mazadNegotiateForWhom: 3 })}
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
              </form>
            </div>
            <button
              className="btn-main mt-3"
              type="button"
              onClick={() =>
                productPayload.price != " " ||
                (productPayload.startPriceMazad && productPayload.lessPriceMazad != " ") ||
                productPayload.mazadNegotiatePrice != " "
                  ? setEventKey("4")
                  : toast.error(locale === "en" ? " Missing data" : "املأ بعض البيانات")
              }
            >
              التالي
            </button>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="4">
          <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("4")}>
            <span>5</span>
            باقات النشر
          </Accordion.Button>
          <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
            <div className="form-content">
              <div>
                <div className="text-center mt-4 mb-5">
                  <h4 className="f-b">اختر واحده من باقاتنا الخاصة</h4>
                  <h5>واحصل علي مزايا عديده لعرض منتجك</h5>
                </div>
                <Row className="justify-content-center">
                  <Col lg={9}>
                    <div className="row justify-content-center">
                      {Boolean(packat?.length) &&
                        packat.map((pack, index) => (
                          <Col md={6} key={pack?.id + index}>
                            {selectedPack?.id == pack.id && <CheckRoundedIcon className={styles.selectedIcon} />}
                            <div
                              className={`${styles["box-Bouquet"]} ${pack.popular ? styles["box-Bouquet-gold"] : ""} ${
                                selectedPack?.id == pack.id ? styles["activePack"] : ""
                              }`}
                              onClick={() => handleChoosePackat(pack)}
                            >
                              <div className={styles["head"]}>
                                <div>{pack.name}</div>
                                <div>{pack.price} ريال</div>
                              </div>
                              <ul className={styles["info"]}>
                                {Boolean(pack.countImage) && (
                                  <li>
                                    <FaStar />
                                    عدد الصور: {pack.countImage}
                                  </li>
                                )}
                                {Boolean(pack.countVideo) && (
                                  <li>
                                    <FaStar />
                                    عدد مقاطع الفيديو: {pack.countVideo}
                                  </li>
                                )}
                                {Boolean(pack.isSms) && (
                                  <li>
                                    <FaStar />
                                    يمكنك ارسال رسالة
                                  </li>
                                )}
                                {Boolean(pack.numMonth) && (
                                  <li>
                                    <FaStar />
                                    عدد الشهور: {pack.numMonth}
                                  </li>
                                )}
                              </ul>
                              {pack.popular && <aside className={styles["Tinf"]}>شائع</aside>}
                              <input
                                type="radio"
                                name="Bouquet"
                                checked={productPayload.pakatId === pack?.id}
                                onChange={(e) => handleSelectPack(e, pack)}
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
                {selectedPack?.productSze === 1 && (
                  <div className="mt-4">
                    <h5 className="mb-3 f-b text-center">اكتشف التغيير</h5>
                    <Row className="align-items-center">
                      <Col md={5}>
                        <div className={styles["box-product"]}>
                          <div className={styles["imge"]}>
                            {Boolean(productPayload?.listImageFile?.length) && (
                              <img src={URL.createObjectURL(productPayload.listImageFile[0])} />
                            )}
                            <div className={styles["two_btn_"]}>
                              <button className={styles["btn_"]}>merchant</button>
                              <button className={styles["btn_"]}>free delivery</button>
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
                                  <div>purchasing price</div>
                                  <div className="f-b main-color">{productPayload?.price}R.S</div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="font-18">
                                  <div>highest price</div>
                                  <div className="f-b">290R.S</div>
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
                              <button className={styles["btn_"]}>merchant</button>
                              <button className={styles["btn_"]}>free delivery</button>
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
                                  <div>purchasing price</div>
                                  <div className="f-b main-color">{productPayload?.price}R.S</div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="font-18">
                                  <div>highest price</div>
                                  <div className="f-b">290R.S</div>
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
            <button className="btn-main mt-3" type="button" onClick={handleSubmit}>
              {router.pathname.includes("edit") ? "تعديل " : "اضافه المنتج"}
            </button>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  )
}

export default AddProductStepTwo
const RequiredSympol = () => <span style={{ color: "red", fontSize: "1.3rem" }}>*</span>

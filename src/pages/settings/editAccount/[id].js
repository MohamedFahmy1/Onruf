import React, { useEffect, useState } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import styles from "../../../modules/products/add/stepTwo/stepTwo.module.css"
import { Accordion } from "react-bootstrap"
import { toast } from "react-toastify"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import registery from "../../../assets/images/registry.svg"
import office from "../../../assets/images/office-building.svg"
import Plate from "../../../assets/images/Plate Number.svg"
import email from "../../../assets/images/email (5).svg"
import Copyright from "../../../public/icons/Copyright_expiry.svg"
import facebook from "../../../public/icons/facebook.svg"
import instagram from "../../../public/icons/instagram.svg"
import tiktok from "../../../assets/images/tik-tok.svg"
import snapchat from "../../../assets/images/snapchat.svg"
import web from "../../../public/icons/008-maps.svg"
import Image from "next/image"
import { PiLinkedinLogoBold, PiTwitterLogoLight, PiYoutubeLogo } from "react-icons/pi"
import Alerto from "../../../common/Alerto"

const EditBussinessAccount = () => {
  const { locale } = useRouter()
  const [eventKey, setEventKey] = useState("0")
  const [businessAccountImage, setBusinessAccountImage] = useState(null)
  const [accountData, setAccountData] = useState()
  const { register, handleSubmit, setValue, reset } = useForm({ defaultValues: accountData })
  const [registeryFile, setRegisteryFile] = useState()
  const [minDate, setMinDate] = useState("")
  const [countries, setCountries] = useState([])
  const [regions, setRegions] = useState([])
  const [neighbourhoods, setNeighbourhoods] = useState([])
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)
  const getAccountData = async () => {
    const {
      data: { data: accountData },
    } = await axios.get(process.env.REACT_APP_API_URL + "/GetBusinessAccountById", {
      params: { businessAccountId: buisnessAccountId },
    })
    setRegisteryFile(accountData.businessAccountCertificates)
    setAccountData(accountData)
    reset(accountData)
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
  const fetchRegions = async (id) => {
    try {
      const { data: data } = await axios(
        process.env.NEXT_PUBLIC_API_URL + `/ListRegionsByCountryId?countriesIds=${id}&lang=${locale}&currentPage=1`,
      )
      const { data: regions } = data
      setRegions(regions)
    } catch (e) {
      Alerto(e)
    }
  }
  const fetchNeighbourhoods = async (id) => {
    try {
      const { data: data } = await axios(
        process.env.NEXT_PUBLIC_API_URL + `/ListNeighborhoodByRegionId?regionsIds=${id}&lang=${locale}&currentPage=1`,
      )
      const { data: neighbourhood } = data
      setNeighbourhoods(neighbourhood)
    } catch (e) {
      Alerto(e)
    }
  }

  useEffect(() => {
    buisnessAccountId && getAccountData()
    buisnessAccountId && fetchCountries()
  }, [buisnessAccountId])

  // Getting Today's Date To Set Minimum Date for Expiary Date Input Element
  useEffect(() => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const dd = String(today.getDate()).padStart(2, "0")
    setMinDate(`${yyyy}-${mm}-${dd}`)
  }, [])
  const toggleAccordionPanel = (eKey) => {
    eventKey === eKey ? setEventKey("") : setEventKey(eKey)
  }
  const handleEditBusinessAccount = async ({ ...values }) => {
    const formData = new FormData()
    Object.keys(values).forEach((key) => {
      if (key === "BusinessAccountCertificates" || key === "businessAccountImage") {
        if (values[key] && values[key].length > 0) {
          formData.append(key, values[key][0])
        }
      } else if (key === "businessAccountUserName") {
        formData.append(key, "test")
      } else {
        formData.append(key, values[key])
      }
    })
    formData.append("id", accountData?.id)
    formData.append("BusinessAccountNameEn", values.businessAccountName)
    try {
      // const payload = {
      //   ...values,
      //   Id: accountData?.id,
      //   // BusinessAccountCertificates: registeryFile,
      //   businessAccountUserName: "test",
      //   BusinessAccountNameEn: values.businessAccountName,
      // }
      // if (businessAccountImage != null) {
      //   payload.businessAccountImage = businessAccountImage
      // } else payload.businessAccountImage = accountData.businessAccountImage

      const { data } = await axios.post(process.env.REACT_APP_API_URL + "/AddEditBusinessAccount", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success(locale === "en" ? "Your account data saved!" : "!تم حفظ البيانات بنجاح")
    } catch (error) {
      toast.error(locale === "en" ? "Please Enter All Data!" : "الرجاء ادخال جميع البيانات")
    }
  }
  // const countryFlag = countries?.map((item) => {
  //   if (item.id == productPayload.countryId) {
  //     return item.countryFlag
  //   }
  // })
  return (
    <div className="body-content">
      {accountData && accountData.id && (
        <div>
          <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
            <h6 className="f-b m-0">{pathOr("", [locale, "Settings", "store_settings"], t)}</h6>
          </div>
          <Accordion activeKey={eventKey} flush>
            <form onSubmit={handleSubmit(handleEditBusinessAccount)}>
              <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="0">
                <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("0")}>
                  <span>1</span>
                  {pathOr("", [locale, "EditAccount", "typeOf"], t)}
                </Accordion.Button>
                <Accordion.Body>
                  <div className="contint_paner contint_paner_form">
                    <div className="form-content">
                      <div className="form-group">
                        <label>
                          {pathOr("", [locale, "Settings", "business_type"], t)}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <Image src={office} className="img-fluid" alt="" />
                          </span>
                          <select
                            // defaultValue={accountData.registrationDocumentType}
                            {...register("registrationDocumentType", { value: accountData.registrationDocumentType })}
                            onChange={(e) => {
                              setValue("registrationDocumentType", e.target.value)
                            }}
                            required
                            className="form-control form-select"
                          >
                            <option hidden disabled selected value={0}>
                              {pathOr("", [locale, "Settings", "chooseType"], t)}
                            </option>
                            <option value={"CommercialRegister"}>
                              {pathOr("", [locale, "Settings", "commercial_register"], t)}
                            </option>
                            <option value={"FreelanceCertificate"}>
                              {pathOr("", [locale, "Settings", "freelance_certificate"], t)}
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>
                          {pathOr("", [locale, "Settings", "commercial_register_number"], t)}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <Image src={Plate} className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("detailRegistrationNumber", { value: accountData.detailRegistrationNumber })}
                            onChange={(e) => setValue("detailRegistrationNumber", e.target.value)}
                            type="text"
                            required
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="expiry">
                          {pathOr("", [locale, "Settings", "expiration_date"], t)}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <Image src={Copyright} className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("registrationNumberExpiryDate", {
                              value: accountData.registrationNumberExpiryDate,
                            })}
                            onChange={(e) => {
                              setValue("registrationNumberExpiryDate", e.target.value)
                            }}
                            type="date"
                            id="expiry"
                            min={minDate}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "tax_number"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <Image src={registery} alt="" />
                          </span>
                          <input
                            {...register("vatNumber", {
                              value: accountData.vatNumber,
                            })}
                            onChange={(e) => setValue("vatNumber", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="form-control input_file">
                          <span>
                            {pathOr("", [locale, "Settings", "attach_commercial_register_image"], t)}
                            <span className="text-danger">*</span>
                          </span>
                          <input
                            onChange={(e) => {
                              setRegisteryFile(e.target.files[0])
                            }}
                            type="file"
                            required
                            {...register("BusinessAccountCertificates", {
                              value: accountData.BusinessAccountCertificates,
                            })}
                          />
                        </div>
                      </div>
                      <div className="form-group text-center">
                        <button
                          className="btn-main mt-3 btn-disabled"
                          type="button"
                          onClick={() => {
                            setEventKey("1")
                          }}
                        >
                          {pathOr("", [locale, "EditAccount", "next"], t)}
                        </button>
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              {/* Second Step */}
              <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="1">
                <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("1")}>
                  <span>2</span>
                  {pathOr("", [locale, "EditAccount", "storeInfo"], t)}
                </Accordion.Button>
                <Accordion.Body>
                  <div className="contint_paner contint_paner_form">
                    <div className="form-content">
                      <div className="form-group">
                        <div className="upload_Image">
                          <img
                            src={
                              businessAccountImage
                                ? URL.createObjectURL(businessAccountImage)
                                : accountData.businessAccountImage
                            }
                            alt="logo"
                          />
                          <div className="btn_" style={{ minWidth: "130px" }}>
                            {pathOr("", [locale, "Settings", "change_logo"], t)}
                            <input
                              {...register("businessAccountImage", { value: accountData.businessAccountImage })}
                              onChange={(e) => {
                                setBusinessAccountImage(e.target.files[0])
                              }}
                              type="file"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label> {pathOr("", [locale, "Settings", "UserName"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <img src={web.src} className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("businessAccountUserName", { value: accountData.businessAccountUserName })}
                            type="text"
                            readOnly
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "store_name"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <img src={office.src} className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("businessAccountName", { value: accountData.businessAccountName })}
                            onChange={(e) => {
                              setValue("businessAccountName", e.target.value)
                              setValue("BusinessAccountNameEn", e.target.value)
                            }}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "store_name_ar"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <img src={office.src} className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("businessAccountNameAr", { value: accountData.businessAccountNameAr })}
                            onChange={(e) => {
                              setValue("businessAccountNameAr", e.target.value)
                            }}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "email"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <img src={email.src} className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("businessAccountEmail", { value: accountData.businessAccountEmail })}
                            onChange={(e) => setValue("businessAccountEmail", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "phone_number"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <img src={Plate.src} className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("businessAccountPhoneNumber", {
                              value: accountData.businessAccountPhoneNumber,
                            })}
                            onChange={(e) => setValue("businessAccountPhoneNumber", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "main_store_website"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <img src={web.src} className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("businessAccountWebsite", { value: accountData.businessAccountWebsite })}
                            onChange={(e) => setValue("businessAccountWebsite", e.target.value)}
                            type="text"
                            className="form-control"
                            placeholder="ex: www.onruf.com"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "address"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <Image src={office} className="img-fluid" alt="country flag" />
                          </span>
                          <select
                            // {...register("countryId", { value: accountData.countryId })}
                            onChange={(e) => {
                              const selectedOption = countries.find((item) => item.id === +e.target.value)
                              if (selectedOption) {
                                setValue("countryId", +selectedOption.id)
                                fetchRegions(selectedOption.id)
                              }
                            }}
                            className="form-control form-select"
                          >
                            <option hidden disabled selected value={0}>
                              {pathOr("", [locale, "Settings", "selectCountry"], t)}
                            </option>
                            {countries.map((item) => (
                              <option value={item.id} key={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <Image src={office} className="img-fluid" alt="" />
                          </span>
                          <select
                            // {...register("regionId", { value: accountData.regionId })}
                            onChange={(e) => {
                              const selectedOption = regions.find((item) => item.id === +e.target.value)
                              if (selectedOption) {
                                setValue("regionId", +selectedOption.id)
                                fetchNeighbourhoods(+selectedOption.id)
                              }
                            }}
                            className="form-control form-select"
                          >
                            <option hidden disabled selected value={0}>
                              {pathOr("", [locale, "Settings", "selectRegion"], t)}
                            </option>
                            {regions.map((item) => (
                              <option value={item.id} key={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <Image src={office} className="img-fluid" alt="" />
                          </span>
                          <select
                            // {...register("neighborhoodId", { value: accountData.neighborhoodId })}
                            onChange={(e) => {
                              setValue("neighborhoodId", +e.target.value)
                            }}
                            className="form-control form-select"
                          >
                            <option hidden disabled selected value={0}>
                              {pathOr("", [locale, "Settings", "selectNeighbourhood"], t)}
                            </option>
                            {neighbourhoods.map((item) => (
                              <option value={item.id} key={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "district"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <img src={web.src} className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("district", { value: accountData.district })}
                            onChange={(e) => setValue("district", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "street"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <img src={web.src} className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("street", { value: accountData.street })}
                            onChange={(e) => setValue("street", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "zip"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <img src={web.src} className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("zipCode", { value: accountData.zipCode })}
                            onChange={(e) => setValue("zipCode", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "maroof"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <img src={web.src} className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("maroof", { value: accountData.maroof })}
                            onChange={(e) => setValue("maroof", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="form-check form-switch p-0 m-0">
                          <span className="input-group-text justify-content-between">
                            <label className="fs-5 f-b">{pathOr("", [locale, "Settings", "25years"], t)}</label>
                            <input
                              {...register("trade15Years", { value: accountData.trade15Years })}
                              className="form-check-input m-2"
                              onChange={(e) => setValue("trade15Years", e.target.checked)}
                              type="checkbox"
                              id="flexSwitchCheckChecked"
                              role="switch"
                            />
                          </span>
                        </div>
                      </div>
                      <div className="form-group text-center">
                        <button
                          className="btn-main mt-3 btn-disabled"
                          type="button"
                          onClick={() => {
                            setEventKey("2")
                          }}
                        >
                          {pathOr("", [locale, "EditAccount", "next"], t)}
                        </button>
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              {/* Third/last Step */}
              <Accordion.Item className={`${styles["accordion-item"]} accordion-item`} eventKey="2">
                <Accordion.Button bsPrefix={styles["header_Accord"]} onClick={() => toggleAccordionPanel("2")}>
                  <span>3</span>
                  {pathOr("", [locale, "EditAccount", "socialMedia"], t)}{" "}
                </Accordion.Button>
                <Accordion.Body>
                  <div className="contint_paner contint_paner_form">
                    <div className="form-content">
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "facebook"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <img src={facebook.src} className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("businessAccountFaceBook", { value: accountData.businessAccountFaceBook })}
                            onChange={(e) => setValue("businessAccountFaceBook", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "instagram"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <img src={instagram.src} className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("businessAccountInstagram", { value: accountData.businessAccountInstagram })}
                            onChange={(e) => setValue("businessAccountInstagram", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "tiktok"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <img src={tiktok.src} className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("businessAccountTikTok", { value: accountData.businessAccountTikTok })}
                            onChange={(e) => setValue("businessAccountTikTok", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "twitter"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <PiTwitterLogoLight size={30} />
                          </span>
                          <input
                            {...register("businessAccountTwitter", { value: accountData.businessAccountTwitter })}
                            onChange={(e) => setValue("businessAccountTwitter", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "linkedin"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <PiLinkedinLogoBold size={30} />
                          </span>
                          <input
                            {...register("businessAccountLinkedIn", { value: accountData.businessAccountLinkedIn })}
                            onChange={(e) => setValue("businessAccountLinkedIn", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "youtube"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <PiYoutubeLogo size={30} />
                          </span>
                          <input
                            {...register("businessAccountYouTube", { value: accountData.businessAccountYouTube })}
                            onChange={(e) => setValue("businessAccountYouTube", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "snapchat"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <img src={snapchat.src} className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("businessAccountSnapchat", { value: accountData.businessAccountSnapchat })}
                            onChange={(e) => setValue("businessAccountSnapchat", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group text-center">
                        <button
                          className="btn-main mt-3 btn-disabled"
                          type="submit"
                          onClick={handleSubmit(handleEditBusinessAccount)}
                        >
                          {pathOr("", [locale, "EditAccount", "save"], t)}
                        </button>
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </form>
          </Accordion>
        </div>
      )}
    </div>
  )
}
export default EditBussinessAccount

import React, { useCallback, useEffect, useMemo, useState } from "react"
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
import Copyright from "../../../../public/icons/Copyright_expiry.svg"
import facebook from "../../../../public/icons/facebook.svg"
import instagram from "../../../../public/icons/instagram.svg"
import tiktok from "../../../assets/images/tik-tok.svg"
import snapchat from "../../../assets/images/snapchat.svg"
import web from "../../../../public/icons/008-maps.svg"
import Image from "next/image"
import { PiLinkedinLogoBold, PiTwitterLogoLight, PiYoutubeLogo } from "react-icons/pi"
import Alerto from "../../../common/Alerto"
import { DevTool } from "@hookform/devtools"
import { minDate } from "../../../common/functions"
import { FaFlag } from "react-icons/fa"

const EditBussinessAccount = () => {
  const { locale } = useRouter()
  const [eventKey, setEventKey] = useState("0")
  const [businessAccountImage, setBusinessAccountImage] = useState(null)
  const [accountData, setAccountData] = useState()
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { isSubmitting },
  } = useForm({ defaultValues: accountData })
  const [registeryFile, setRegisteryFile] = useState()
  const [countries, setCountries] = useState([])
  const [regions, setRegions] = useState([])
  const [neighbourhoods, setNeighbourhoods] = useState([])
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)

  const countryId = watch("countryId")
  const countryFlag = useMemo(() => {
    return countryId && countries?.find((item) => item.id === +countryId)?.countryFlag
  }, [countries, countryId])

  const getAccountData = useCallback(async () => {
    const {
      data: { data: accountData },
    } = await axios.get("/GetBusinessAccountById", {
      params: { businessAccountId: buisnessAccountId },
    })
    setAccountData(accountData)
    reset(accountData)
  }, [buisnessAccountId, reset])

  const fetchCountries = useCallback(async () => {
    try {
      const { data: countriesData } = await axios(`/ListCountries?lang=${locale}&currentPage=1`)
      const { data: countriesList } = countriesData
      setCountries(countriesList)
    } catch (e) {
      Alerto(e)
    }
  }, [locale])

  const fetchRegions = useCallback(
    async (id) => {
      try {
        const { data: data } = await axios(`/ListRegionsByCountryId?countriesIds=${id}&lang=${locale}&currentPage=1`)
        const { data: regions } = data
        setRegions(regions)
      } catch (e) {
        Alerto(e)
      }
    },
    [locale],
  )

  const fetchNeighbourhoods = useCallback(
    async (id) => {
      try {
        const { data: data } = await axios(`/ListNeighborhoodByRegionId?regionsIds=${id}&lang=${locale}&currentPage=1`)
        const { data: neighbourhood } = data
        setNeighbourhoods(neighbourhood)
      } catch (e) {
        Alerto(e)
      }
    },
    [locale],
  )

  useEffect(() => {
    if (accountData) {
      accountData.countryId && fetchRegions(accountData.countryId)
      accountData.regionId && fetchNeighbourhoods(accountData.regionId)
    }
  }, [accountData, accountData?.regionId, accountData?.countryId, fetchRegions, fetchNeighbourhoods])

  useEffect(() => {
    buisnessAccountId && getAccountData()
    buisnessAccountId && fetchCountries()
  }, [buisnessAccountId, getAccountData, fetchCountries])

  useEffect(() => {
    const countryId = watch("countryId")
    const regionId = watch("regionId")
    const neighborhoodId = watch("neighborhoodId")
    if (regions && neighbourhoods) {
      reset({
        ...accountData,
        countryId: +countryId,
        regionId: +regionId,
        neighborhoodId: +neighborhoodId,
      })
    }
  }, [regions, neighbourhoods, watch, accountData, reset])

  const toggleAccordionPanel = (eKey) => {
    eventKey === eKey ? setEventKey("") : setEventKey(eKey)
  }
  const handleEditBusinessAccount = async (data) => {
    const { businessAccountCertificates, ...rest } = data
    const updatedValues = registeryFile
      ? { ...rest, businessAccountCertificates: businessAccountCertificates }
      : { ...rest }
    console.log(registeryFile)
    const formData = new FormData()
    for (const key of Object.keys(updatedValues)) {
      if (key === "businessAccountImage" && businessAccountImage == null) {
        continue
      } else if (key === "businessAccountImage") {
        if (updatedValues[key] && updatedValues[key].length > 0) {
          formData.append(key, updatedValues[key][0])
        }
      } else if (key === "businessAccountCertificates") {
        if (updatedValues[key] && updatedValues[key].length > 0) {
          formData.append(key, updatedValues[key][0])
        }
      } else if (key === "businessAccountUserName") {
        formData.append(key, "test")
      } else {
        formData.append(key, updatedValues[key])
      }
    }
    formData.append("id", accountData?.id)
    formData.append("BusinessAccountNameEn", data.businessAccountName)
    try {
      const { data } = await axios.post("/AddEditBusinessAccount", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      toast.success(locale === "en" ? "Your account data saved!" : "!تم حفظ البيانات بنجاح")
    } catch (error) {
      toast.error(locale === "en" ? "Please Enter All Required Data!" : "من فضلك ادخل جميع البيانات اللازمة")
    }
  }

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
                            {...register("registrationDocumentType", { value: accountData.registrationDocumentType })}
                            onChange={(e) => {
                              setValue("registrationDocumentType", e.target.value)
                            }}
                            required
                            className="form-control form-select"
                          >
                            <option hidden disabled value={0}>
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
                            <Image src={Plate} className="img-fluid" alt="Plate" />
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
                            <Image src={Copyright} className="img-fluid" alt="copyright" />
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
                            min={minDate()}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>{pathOr("", [locale, "Settings", "tax_number"], t)}</label>
                        <div className="input-group" style={{ flexDirection: locale === "en" ? "row-reverse" : "row" }}>
                          <span className="input-group-text">
                            <Image src={registery} alt="registery" />
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
                            multiple
                            onClick={(e) => {
                              setRegisteryFile(e.target.files)
                            }}
                            type="file"
                            required
                            {...register("businessAccountCertificates", {
                              value: accountData.businessAccountCertificates,
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
                            <Image src={web.src} className="img-fluid" alt="web" width={30} height={30} />
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
                            <img src={office.src} className="img-fluid" alt="office" />
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
                            <img src={office.src} className="img-fluid" alt="office" />
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
                            <img src={email.src} className="img-fluid" alt="email" />
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
                            <img src={Plate.src} className="img-fluid" alt="Plate" />
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
                            <img src={web.src} className="img-fluid" alt="web" />
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
                            {Boolean(countryFlag) ? (
                              <Image src={countryFlag} alt="country flag" width={30} height={20} />
                            ) : (
                              <FaFlag size={25} />
                            )}
                          </span>
                          <select
                            {...register("countryId", { value: +accountData.countryId })}
                            onChange={(e) => {
                              const selectedOption = countries.find((item) => item.id === +e.target.value)
                              if (selectedOption) {
                                setValue("countryId", +selectedOption.id)
                                setValue("regionId", 0)
                                setValue("neighborhoodId", 0)
                                setNeighbourhoods([])
                                setRegions([])
                                fetchRegions(selectedOption.id)
                              }
                            }}
                            className="form-control form-select"
                          >
                            {/* <option disabled value={0}>
                              {pathOr("", [locale, "Settings", "selectCountry"], t)}
                            </option> */}
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
                            <Image src={office} className="img-fluid" alt="office" />
                          </span>
                          <select
                            {...register("regionId", { value: +accountData.regionId })}
                            onChange={(e) => {
                              const selectedOption = regions.find((item) => item.id === +e.target.value)
                              if (selectedOption) {
                                setValue("regionId", +selectedOption.id)
                                setValue("neighborhoodId", 0)
                                setNeighbourhoods([])
                                fetchNeighbourhoods(+selectedOption.id)
                              }
                            }}
                            className="form-control form-select"
                          >
                            <option disabled value={0}>
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
                            <Image src={office} className="img-fluid" alt="office" />
                          </span>
                          <select
                            {...register("neighborhoodId", { value: +accountData.neighborhoodId })}
                            onChange={(e) => {
                              setValue("neighborhoodId", +e.target.value)
                            }}
                            className="form-control form-select"
                          >
                            <option disabled value={0}>
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
                            <img src={web.src} className="img-fluid" alt="web" />
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
                            <img src={web.src} className="img-fluid" alt="web" />
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
                            <img src={web.src} className="img-fluid" alt="web" />
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
                            <img src={web.src} className="img-fluid" alt="web" />
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
                            <img src={instagram.src} className="img-fluid" alt="instagram" />
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
                            <img src={tiktok.src} className="img-fluid" alt="tiktok" />
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
                            <img src={snapchat.src} className="img-fluid" alt="snapchat" />
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
                          className="btn-main mt-3"
                          type="submit"
                          disabled={isSubmitting}
                          onClick={handleSubmit(handleEditBusinessAccount)}
                        >
                          {!isSubmitting
                            ? pathOr("", [locale, "EditAccount", "save"], t)
                            : pathOr("", [locale, "EditAccount", "loading"], t)}
                        </button>
                      </div>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </form>
            {process.env.NODE_ENV === "development" && <DevTool control={control} />}
          </Accordion>
        </div>
      )}
    </div>
  )
}
export default EditBussinessAccount

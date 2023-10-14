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

const EditBussinessAccount = () => {
  const [eventKey, setEventKey] = useState("0")
  const [BusinessAccountImage, setImage] = useState(null)
  const [accountData, setAccountData] = useState()
  const { register, handleSubmit, setValue, reset } = useForm({ defaultValues: accountData })
  const [registeryFile, setRegisteryFile] = useState(accountData?.CommercialRegisterFile)

  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)

  console.log("accountData",accountData)
  const getAccountData = async () => {
    const {
      data: { data: accountData },
    } = await axios.get(process.env.REACT_APP_API_URL + "/GetBusinessAccountById", {
      params: { businessAccountId: buisnessAccountId },
    })
    setAccountData(accountData)
    reset(accountData)
  }

  useEffect(() => {
    buisnessAccountId && getAccountData()
  }, [buisnessAccountId, reset])

  const toggleAccordionPanel = (eKey) => {
    eventKey === eKey ? setEventKey("") : setEventKey(eKey)
  }

  const handleEditBusinessAccount = async ({ commercialRegisterFile, ...values }) => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_API_URL + "/AddEditBusinessAccount",
        { id: accountData?.id, CommercialRegisterFile: registeryFile, BusinessAccountImage: BusinessAccountImage, ...values },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      toast.success("Your account data saved!")
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const { locale } = useRouter()

  return (
    <div className="body-content">
      {accountData && accountData.id && (
        <div>
          <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
            <h6 className="f-b m-0">اعدادات المتجر</h6>
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
                        <label>نوع العمل</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <image src="../core/imgs/office-building.svg" className="img-fluid" alt="" />
                          </span>
                          <select className="form-control form-select">
                            <option>سجل تجاري</option>
                            <option>1</option>
                            <option>2</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>رقم السجل التجاري</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <image src="../core/imgs/Plate%20Number.svg" className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("commercialRegisterNumber", { value: accountData.commercialRegisterNumber })}
                            onChange={(e) => setValue("commercialRegisterNumber", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>تاريخ الانتهاء</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <image src="../core/imgs/Copyright_expiry.svg" className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("commercialRegisterExpiryDate", {
                              value: accountData.commercialRegisterExpiryDate,
                            })}
                            onChange={(e) => setValue("commercialRegisterExpiryDate", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>

                      {/* <div className="form-group">
                        <label>الرقم الضريبي</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <image src="../core/imgs/registry.svg" className="img-fluid" alt="" />
                          </span>
                          <input type="number" className="form-control" />
                        </div>
                      </div> */}
                      <div className="form-group">
                        <div className="form-control input_file">
                          <span>ارفق صورة السجل التجاري</span>
                          <input
                            onChange={(e) => {
                              setRegisteryFile(e.target.files[0])
                            }}
                            type="file"
                          />
                        </div>
                      </div>
                      <div className="form-group text-center">
                        <button
                          classNameName="btn-main mt-3 btn-disabled"
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
                  {pathOr("", [locale, "EditAccount", "storeInfo"], t)}{" "}
                </Accordion.Button>
                <Accordion.Body>
                  <div className="contint_paner contint_paner_form">
                    <div className="form-content">
                      <div className="form-group">
                        <div className="upload_Image">
                          <image src={BusinessAccountImage ? URL.createObjectURL(BusinessAccountImage) : "../core/imgs/home2.jpg"} alt="" />
                          <div className="btn_">
                            تغيير الشعار
                            <input
                              onChange={(e) => {
                                setImage(e.target.files[0])
                              }}
                              type="file"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>اسم المتجر</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <image src="../core/imgs/office-building.svg" className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("businessAccountNameEn", { value: accountData.businessAccountNameEn })}
                            onChange={(e) => setValue("businessAccountNameEn", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>اسم المتجر Ar</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <image src="../core/imgs/office-building.svg" className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("businessAccountNameAr", { value: accountData.businessAccountNameAr })}
                            onChange={(e) => setValue("businessAccountNameAr", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>اسم الشركه</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <image src="../core/imgs/office-building.svg" className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("companyNameEn", { value: accountData.companyNameEn })}
                            onChange={(e) => setValue("companyNameEn", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>اسم الشركه Ar</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <image src="../core/imgs/office-building.svg" className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("companyNameAr", { value: accountData.companyNameAr })}
                            onChange={(e) => setValue("companyNameAr", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>البريد الالكترونى</label>
                        <div className="input-group">
                          <span className="input-group-text">
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
                        <label>رقم الهاتف</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <image src="../core/imgs/Plate%20Number.svg" className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("businessAccountPhoneNumber", { value: accountData.businessAccountPhoneNumber })}
                            onChange={(e) => setValue("businessAccountPhoneNumber", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label> موظف الحساب </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <image src="../core/imgs/Plate%20Number.svg" className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("businessAccountEmployees", { value: accountData.businessAccountEmployees })}
                            onChange={(e) => setValue("businessAccountEmployees", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>الموقع الرئيسي للمتجر</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <image src="../core/imgs/008-maps.svg" className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("businessAccountWebsite", { value: accountData.businessAccountWebsite })}
                            onChange={(e) => setValue("businessAccountWebsite", e.target.value)}
                            type="text"
                            className="form-control"
                            placeholder="تحديد موقع الشركة"
                          />
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
                        <label>فيسبوك</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <image src="../core/imgs/facebook.svg" className="img-fluid" alt="" />
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
                        <label>انستغرام</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <image src="../core/imgs/instagram.svg" className="img-fluid" alt="" />
                          </span>
                          <input
                            {...register("businessAccountInstagram", { value: accountData.businessAccountInstagram })}
                            onChange={(e) => setValue("businessAccountInstagram", e.target.value)}
                            type="text"
                            className="form-control"
                          />
                        </div>
                      </div>

                      <div className="form-group text-center">
                        <button className="btn-main mt-3 btn-disabled" type="submit">
                          {pathOr("", [locale, "EditAccount", "save"], t)}{" "}
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

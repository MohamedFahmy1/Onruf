import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Row, Col, Modal } from "react-bootstrap"
import { AiOutlinePlus } from "react-icons/ai"
import { BiEditAlt } from "react-icons/bi"
import { RiDeleteBin5Line } from "react-icons/ri"
import VisaImg from "../../../../public/images/Visa.png"
import BoxBankImg from "../../../../public/images/box-bank.png"
import stcPayImg from "../../../../public/images/stc-pay.png"
import StcPayImg from "../../../../public/images/Stc_pay2.png"
import stc from "../../../../public/images/stc.png"
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import axios from "axios"
import "react-datepicker/dist/react-datepicker.css"
import t from "../../../translations.json"
import { pathOr } from "ramda"

const PaymentCards = ({ bankTransfers }) => {
  const { locale } = useRouter()
  const [openModal, setOpenModal] = useState()
  // This is for edit
  const [id, setId] = useState()
  const [bankTransferData, setBankTransferData] = useState(bankTransfers || [])
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({ mode: "onBlur" })

  const fetchBankTransfer = async () => {
    const {
      data: { data },
    } = await axios.get(process.env.REACT_APP_API_URL + "/ListBankTransfers", {
      params: {
        currentPage: 1,
      },
    })
    setBankTransferData(data)
  }

  const handleOpenEditModalAndSetFormWithDefaultValues = (bankId) => {
    setId(bankId)
    setOpenModal(true)
    const getSelectedBankTransfer = bankTransferData.map((b) => b).find((b) => b.id === bankId)
    reset({ ...getSelectedBankTransfer })
  }

  const handleDeleteBankTransfer = async (bankId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/RemoveBankTransfer`, { params: { id: bankId } })
      setBankTransferData([...bankTransferData.filter((b) => b.id !== bankId)])
      toast.success(locale === "en" ? "Bank transfer has been deleted successfully!" : "تم مسح الحساب البنكي بنجاح")
      fetchBankTransfer()
    } catch (error) {
      toast.error(
        locale === "en"
          ? "Can't delete transfer as it's part of a product payment option!"
          : "لا يمكن مسح الحساب لانه مرتبط كوسيلة دفع لمنتج",
      )
    }
  }

  const submit = async ({ ...values }) => {
    try {
      if (id) {
        const formData = new FormData()
        for (let key in values) {
          formData.append(key, values[key])
        }
        await axios.put(process.env.REACT_APP_API_URL + "/EditBankTransfer", formData)
        setBankTransferData([...bankTransferData?.filter((b) => b.id !== id), { ...values }])
        setOpenModal(false)
        setId(undefined)
        toast.success(locale === "en" ? "Bank transfer has been edited successfully!" : "تم تعديل الحساب البنكي بنجاح")
        fetchBankTransfer()
      } else {
        try {
          const formData = new FormData()
          for (let key in values) {
            formData.append(key, values[key])
          }
          await axios.post(process.env.REACT_APP_API_URL + "/AddBankTransfer", formData)
          setBankTransferData([...bankTransferData, { ...values }])
          setOpenModal(false)
          toast.success(locale === "en" ? "Bank transfer has been added successfully!" : "تم اضافة الحساب البنكي بنجاح")
          fetchBankTransfer()
        } catch (error) {
          toast.error("Error!")
          setOpenModal(false)
        }
      }
    } catch (error) {
      console.error({ error })
      toast.error(error.response.data.message)
    } finally {
      reset({})
    }
  }

  const handleOpenModal = () => {
    setOpenModal(!openModal)
    setId("")
    reset(
      {
        paymentAccountType: null,
        bankHolderName: null,
        swiftCode: null,
        ibanNumber: null,
        accountNumber: null,
        bankName: null,
        expiaryDate: null,
      },
      { keepValues: false },
    )
  }

  useEffect(() => {
    setBankTransferData(bankTransfers)
  }, [bankTransfers])
  if (!bankTransferData) return "Loading"
  return (
    <Col lg={8}>
      <div className="contint_paner">
        <h6 className="f-b mb-3">{pathOr("", [locale, "Settings", "bankAccounts"], t)}</h6>
        <div className="d-flex gap-4">
          <button
            type="button"
            className="btn-bank-accounts"
            onClick={handleOpenModal}
            data-bs-toggle="modal"
            data-bs-target="#acount_Banck"
          >
            <AiOutlinePlus />
          </button>
          <div
            className="d-flex justify-content-around overflow-scroll gap-4"
            style={{ height: "300px", alignItems: "center" }}
          >
            {bankTransferData?.map((bank) => (
              <div
                className="box-bank-account"
                key={bank?.id}
                style={{
                  color: bank.paymentAccountType === "BankDeposit" ? "black" : undefined,
                  border: bank.paymentAccountType === "BankDeposit" ? "1px solid #ccc" : undefined,
                }}
              >
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-10">
                    {bank.paymentAccountType === "CreditCard" && <img src={VisaImg.src} className="img_" />}
                    {bank.paymentAccountType === "STCPay" && <img src={stcPayImg.src} className="img_" />}
                    <button
                      className="btn_edit"
                      onClick={() => handleOpenEditModalAndSetFormWithDefaultValues(bank?.id)}
                    >
                      <BiEditAlt />
                    </button>
                    <button className="btn_edit" onClick={() => handleDeleteBankTransfer(bank?.id)}>
                      <RiDeleteBin5Line />
                    </button>
                  </div>
                  <div>{bank?.accountNumber}</div>
                </div>
                <div>
                  <div className="mt-10">
                    <div>
                      {pathOr("", [locale, "BankAccounts", "BankName"], t)}: {bank?.bankName}
                    </div>
                    <div>{bank?.bankHolderName}</div>
                  </div>
                  {bank.paymentAccountType === "BankDeposit" ? (
                    <div className="mt-10">
                      <div>{bank?.swiftCode}</div>
                    </div>
                  ) : (
                    <div className="mt-10">
                      <div>{pathOr("", [locale, "BankAccounts", "expiryDate"], t)}</div>
                      <div>{bank?.expiaryDate}</div>
                    </div>
                  )}
                </div>
                {bank.paymentAccountType === "CreditCard" && <img src={BoxBankImg.src} className="baner" />}
                {bank.paymentAccountType === "STCPay" && <img src={stc.src} className="baner" />}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Payment Modal */}
      <form>
        <Modal show={openModal} onHide={() => setOpenModal(false)}>
          <Modal.Header>
            <h5 className="modal-title m-0 f-b" id="staticBackdropLabel">
              {!id ? (locale === "en" ? "Add" : "اضافة") : locale === "en" ? "Edit" : "تعديل"}{" "}
              {pathOr("", [locale, "BankAccounts", "bankAccount"], t)}
            </h5>
            <button type="button" className="btn-close" onClick={() => setOpenModal(false)} />
          </Modal.Header>
          <Modal.Body>
            <div className="mb-2">
              <label className="f-b">{pathOr("", [locale, "BankAccounts", "accountType"], t)}</label>
              <div className="d-flex gap-3">
                <div className="status-P">
                  <input
                    type="radio"
                    name="days"
                    value={3}
                    {...register("paymentAccountType", {
                      required: locale === "en" ? "This field is required" : "من فضلك ادخل هذا الحقل",
                    })}
                  />
                  <span>{pathOr("", [locale, "BankAccounts", "creditCard"], t)}</span>
                  <span className="pord rounded-pill"></span>
                </div>
                <div className="status-P">
                  <input
                    type="radio"
                    name="days"
                    value={5}
                    {...register("paymentAccountType", {
                      required: locale === "en" ? "This field is required" : "من فضلك ادخل هذا الحقل",
                    })}
                  />

                  <img src={StcPayImg.src} width="65px" />
                  <span className="pord rounded-pill"></span>
                </div>
                <div className="status-P">
                  <input
                    type="radio"
                    name="days"
                    value={1}
                    {...register("paymentAccountType", {
                      required: locale === "en" ? "This field is required" : "من فضلك ادخل هذا الحقل",
                    })}
                  />
                  <span> {pathOr("", [locale, "BankAccounts", "bankAccount"], t)} </span>
                  <span className="pord rounded-pill"></span>
                </div>
              </div>
              {errors["paymentAccountType"] && (
                <p className="errorMsg text-center">{errors["paymentAccountType"]["message"]}</p>
              )}
            </div>
            <Row>
              <Col md={6}>
                <div className="mb-2">
                  <label className="f-b">{pathOr("", [locale, "BankAccounts", "Holder's"], t)}</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("bankHolderName", {
                      required: locale === "en" ? "This field is required" : "من فضلك ادخل هذا الحقل",
                    })}
                  />
                  {errors["bankHolderName"] && <p className="errorMsg">{errors["bankHolderName"]["message"]}</p>}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-2">
                  <label className="f-b">{pathOr("", [locale, "BankAccounts", "BankName"], t)}</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("bankName", {
                      required: locale === "en" ? "This field is required" : "من فضلك ادخل هذا الحقل",
                    })}
                  />
                  {errors["bankName"] && <p className="errorMsg">{errors["bankName"]["message"]}</p>}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-2">
                  <label className="f-b">{pathOr("", [locale, "BankAccounts", "AccountNumber"], t)}</label>
                  <input
                    type="number"
                    className="form-control"
                    {...register("accountNumber", {
                      required: locale === "en" ? "This field is required" : "من فضلك ادخل هذا الحقل",
                    })}
                  />
                  {errors["accountNumber"] && <p className="errorMsg">{errors["accountNumber"]["message"]}</p>}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-2">
                  <label className="f-b">{pathOr("", [locale, "BankAccounts", "ibn"], t)}</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("ibanNumber", {
                      required: locale === "en" ? "This field is required" : "من فضلك ادخل هذا الحقل",
                      pattern: {
                        value: /^[A-Za-z0-9]+$/,
                        message:
                          locale === "en" ? "Invalid characters in IBAN number" : "أحرف غير صالحة في رقم الآيبان",
                      },
                    })}
                  />
                  {errors["ibanNumber"] && <p className="errorMsg">{errors["ibanNumber"]["message"]}</p>}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-2">
                  <label className="f-b">{pathOr("", [locale, "BankAccounts", "swift"], t)}</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("swiftCode", {
                      required: locale === "en" ? "This field is required" : "من فضلك ادخل هذا الحقل",
                      pattern: {
                        value: /^[A-Za-z0-9]+$/,
                        message:
                          locale === "en" ? "Invalid characters in IBAN number" : "أحرف غير صالحة في رقم الآيبان",
                      },
                    })}
                  />
                  {errors["swiftCode"] && <p className="errorMsg">{errors["swiftCode"]["message"]}</p>}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-2">
                  <label className="f-b">{pathOr("", [locale, "BankAccounts", "yearExpiryDate"], t)}</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: 07/27"
                    {...register("expiaryDate", {
                      required: locale === "en" ? "This field is required" : "من فضلك ادخل هذا الحقل",
                      pattern: {
                        value: /^(0[1-9]|[12][0-9]|3[01])\/(2[3-9]|[3-8][0-9]|90)$/,
                        message:
                          locale === "en"
                            ? "Invalid date format (DD/YY, days from 01 to 31)"
                            : "تنسيق التاريخ غير صحيح (يوم/سنة، أيام من 01 إلى 31)",
                      },
                    })}
                  />
                  {errors["expiaryDate"] && <p className="errorMsg">{errors["expiaryDate"]["message"]}</p>}
                </div>
              </Col>
              <Col md={12}>
                <div className="mb-2">
                  <label
                    style={{ flexDirection: "row", justifyContent: "space-between", display: "flex" }}
                    className="f-b"
                  >
                    <span> {pathOr("", [locale, "Products", "saveLater"], t)}</span>
                    <div className="form-group">
                      <div className="form-check form-switch p-0 m-0">
                        <input
                          className="form-check-input m-0"
                          name="SaveForLaterUse"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckChecked"
                        />
                      </div>
                    </div>
                  </label>
                  {errors["saveForLaterUse"] && <p className="errorMsg">{errors["saveForLaterUse"]["message"]}</p>}
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="modal-footer">
            <button type="submit" onClick={handleSubmit(submit)} className="btn-main">
              {!id ? (locale === "en" ? "Add" : "اضافة") : locale === "en" ? "Edit" : "تعديل"}
            </button>
          </Modal.Footer>
        </Modal>
      </form>
    </Col>
  )
}

export default PaymentCards

import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Row, Col, Modal } from "react-bootstrap"
import { AiOutlinePlus } from "react-icons/ai"
import { BiEditAlt } from "react-icons/bi"
import { RiDeleteBin5Line } from "react-icons/ri"
import VisaImg from "../../../public/images/Visa.png"
import BoxBankImg from "../../../public/images/box-bank.png"
import stcPayImg from "../../../public/images/stc-pay.png"
import StcPayImg from "../../../public/images/Stc_pay2.png"
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

  const handleOpenEditModalAndSetFormWithDefaultValues = (bankId) => {
    setId(bankId)
    setOpenModal(true)
    const getSelectedBankTransfer = bankTransferData.map((b) => b).find((b) => b.id === bankId)
    const month = getSelectedBankTransfer?.expiaryDate.split("/")[0]
    const year = getSelectedBankTransfer?.expiaryDate.split("/")[1]
    reset({ ...getSelectedBankTransfer, month, year })
  }

  const handleDeleteBankTransfer = async (bankId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/RemoveBankTransfer`, { params: { id: bankId } })
      setBankTransferData([...bankTransferData.filter((b) => b.id !== bankId)])
      toast.success("Bank transfer has been deleted successfully!")
    } catch (error) {
      toast.error("Can't delete transfer as it's part of a product payment option!")
    }
  }

  const submit = async ({ month, year, ...values }) => {
    try {
      if (id) {
        const formData = new FormData()
        for (let key in values) {
          formData.append(key, values[key])
        }
        formData.append("expiaryDate", `${month}/${year}`)
        await axios.put(process.env.REACT_APP_API_URL + "/EditBankTransfer", formData)
        setBankTransferData([
          ...bankTransferData?.filter((b) => b.id !== id),
          { ...values, expiaryDate: `${month}/${year}` },
        ])
        setOpenModal(false)
        setId(undefined)
        toast.success("Bank transfer has been edited successfully!")
      } else {
        try {
          const formData = new FormData()
          for (let key in values) {
            formData.append(key, values[key])
          }
          formData.append("expiaryDate", `${month}/${year}`)
          await axios.post(process.env.REACT_APP_API_URL + "/AddBankTransfer", formData)
          setBankTransferData([...bankTransferData, { ...values, expiaryDate: `${month}/${year}` }])
          setOpenModal(false)
          toast.success("Bank transfer has been added successfully!")
        } catch (error) {
          toast.success("Bank transfer has been added successfully!")
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
        bankHolderName: null,
        swiftCode: null,
        ibanNumber: null,
        accountNumber: null,
        bankName: null,
        month: null,
        year: null,
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
          <div className="d-flex justify-content-around overflow-scroll">
            {bankTransferData?.map((bank) => (
              <div className="box-bank-account" key={bank?.id}>
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-10">
                    <img src={VisaImg.src} className="img_" />
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
                    <div>bank name: {bank?.bankName}</div>
                    <div>{bank?.bankHolderName}</div>
                  </div>
                  <div className="mt-10">
                    <div>Expiary date</div>
                    <div>{bank?.expiaryDate}</div>
                  </div>
                </div>
                <img src={BoxBankImg.src} className="baner" />
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
              {!id ? "اضافة" : "تعديل"} حساب بنكي
            </h5>
            <button type="button" className="btn-close" onClick={() => setOpenModal(false)} />
          </Modal.Header>
          <Modal.Body>
            <div className="mb-2">
              <label className="f-b">نوع الحساب</label>
              <div className="d-flex gap-3">
                <div className="status-P">
                  <input type="radio" name="days" />
                  <span>فيزا/ماستر كارد</span>
                  <span className="pord rounded-pill"></span>
                </div>
                <div className="status-P">
                  <input type="radio" name="days" />
                  <img src={StcPayImg.src} width="65px" />
                  <span className="pord rounded-pill"></span>
                </div>
                <div className="status-P">
                  <input type="radio" name="days" checked />
                  <span> حساب بنكي </span>
                  <span className="pord rounded-pill"></span>
                </div>
              </div>
            </div>
            <Row>
              <Col md={6}>
                <div className="mb-2">
                  <label className="f-b">اسم صاحب الحساب</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("bankHolderName", { required: "This field is required" })}
                  />
                  {errors["bankHolderName"] && <p className="errorMsg">{errors["bankHolderName"]["message"]}</p>}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-2">
                  <label className="f-b">اسم البنك</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("bankName", { required: "This field is required" })}
                  />
                  {errors["bankName"] && <p className="errorMsg">{errors["bankName"]["message"]}</p>}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-2">
                  <label className="f-b">رقم الحساب</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("accountNumber", { required: "This field is required" })}
                  />
                  {errors["accountNumber"] && <p className="errorMsg">{errors["accountNumber"]["message"]}</p>}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-2">
                  <label className="f-b">الايبان</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("ibanNumber", { required: "This field is required" })}
                  />
                  {errors["ibanNumber"] && <p className="errorMsg">{errors["ibanNumber"]["message"]}</p>}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-2">
                  <label className="f-b">سويفت كود</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("swiftCode", { required: "This field is required" })}
                  />
                  {errors["swiftCode"] && <p className="errorMsg">{errors["swiftCode"]["message"]}</p>}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-2">
                  <label className="f-b">شهر تاريخ الانتهاء</label>
                  <input
                    type="number"
                    className="form-control"
                    {...register("month", {
                      required: "This field is required",
                      maxLength: {
                        value: 2,
                        message: locale === "en" ? "Invalid month value" : "الشهر غير صحيح",
                      },
                      minLength: {
                        value: 1,
                        message: locale === "en" ? "Invalid month value" : "الشهر غير صحيح",
                      },
                      min: {
                        value: 1,
                        message: locale === "en" ? "Invalid month value" : "الشهر غير صحيح",
                      },
                      max: {
                        value: 12,
                        message: locale === "en" ? "Invalid month value" : "الشهر غير صحيح",
                      },
                    })}
                  />
                  {errors["month"] && <p className="errorMsg">{errors["month"]["message"]}</p>}
                </div>
              </Col>

              <Col md={6}>
                <div className="mb-2">
                  <label className="f-b">سنة تاريخ الانتهاء</label>
                  <input
                    type="number"
                    className="form-control"
                    {...register("year", {
                      required: "This field is required",
                      maxLength: {
                        value: 4,
                        message: locale === "en" ? "Invalid غثشق value" : "السنة غير صحيحة",
                      },
                      minLength: {
                        value: 4,
                        message: locale === "en" ? "Invalid غثشق value" : "السنة غير صحيحة",
                      },
                      min: {
                        value: 2000,
                        message: locale === "en" ? "Invalid غثشق value" : "السنة غير صحيحة",
                      },
                    })}
                  />
                  {errors["year"] && <p className="errorMsg">{errors["year"]["message"]}</p>}
                </div>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer className="modal-footer">
            <button type="submit" onClick={handleSubmit(submit)} className="btn-main">
              {!id ? "اضافة" : "تعديل"}
            </button>
          </Modal.Footer>
        </Modal>
      </form>
    </Col>
  )
}

export default PaymentCards

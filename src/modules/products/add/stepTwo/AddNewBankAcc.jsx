import React, { useState } from "react"
import classes from "./AddNewBankAcc.module.css"
import styles from "./stepTwo.module.css"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import axios from "axios"
import { pathOr } from "ramda"
import t from "../../../../translations.json"

const AddBankForm = ({ setShowAddAcc, setfetchNewData }) => {
  const { locale } = useRouter()
  const [formData, setFormData] = useState({
    accountNumber: "",
    bankName: "",
    bankHolderName: "",
    ibanNumber: "",
    swiftCode: "",
    expiaryDate: "",
    SaveForLaterUse: false,
  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "SaveForLaterUse" ? e.target.checked : value,
    }))
  }
  const sendDataToDB = async () => {
    try {
      let finalData = new FormData()
      finalData.append("accountNumber", formData.accountNumber)
      finalData.append("expiaryDate", formData.expiaryDate.replaceAll("-", "/"))
      finalData.append("bankHolderName", formData.bankHolderName)
      finalData.append("ibanNumber", formData.ibanNumber)
      finalData.append("swiftCode", formData.swiftCode)
      finalData.append("bankName", formData.bankName)
      finalData.append("SaveForLaterUse", formData.SaveForLaterUse)
      await axios.post(`/AddBankTransfer`, finalData)
      toast.success(locale === "en" ? "Account has been added successfully!" : "تم اضافةالحساب بنجاح")
      setfetchNewData(true)
      setShowAddAcc(false)
    } catch (error) {
      console.error("API Error:", error.response)
      toast.error(locale === "en" ? "Please enter valid data" : "رجاء ادخال جميع البيانات بشكل صحيح")
    }
  }
  const isFormValid = (data) => {
    for (let key in data) {
      if (key !== "SaveForLaterUse" && !data[key]) {
        return false
      }
    }
    return true
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (isFormValid(formData)) {
      sendDataToDB()
    } else {
      toast.error(locale === "en" ? "Please enter all necessary data" : "رجاء ادخال جميع البيانات")
    }
  }
  return (
    <form className={classes.box} onSubmit={handleSubmit}>
      <h2>{pathOr("", [locale, "Products", "addNewBank"], t)}</h2>
      <div className={classes.container}>
        <div>
          <label>
            {pathOr("", [locale, "Products", "Holder's"], t)}
            <input
              type="text"
              className={`form-control ${styles["form-control"]}`}
              name="bankHolderName"
              value={formData.bankHolderName}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            {pathOr("", [locale, "Products", "BankName"], t)}
            <input
              type="text"
              name="bankName"
              className={`form-control ${styles["form-control"]}`}
              value={formData.bankName}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            {pathOr("", [locale, "Products", "AccountNumber"], t)}
            <input
              type="text"
              name="accountNumber"
              className={`form-control ${styles["form-control"]}`}
              value={formData.accountNumber}
              onChange={handleChange}
            />
          </label>
          <br />
        </div>
        <div>
          <label>
            {pathOr("", [locale, "Products", "ibn"], t)}
            <input
              type="text"
              name="ibanNumber"
              className={`form-control ${styles["form-control"]}`}
              value={formData.ibanNumber}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            {pathOr("", [locale, "Products", "swift"], t)}
            <input
              type="text"
              name="swiftCode"
              className={`form-control ${styles["form-control"]}`}
              value={formData.swiftCode}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            {pathOr("", [locale, "Products", "expiryDate"], t)}
            <input
              type="date"
              name="expiaryDate"
              className={`form-control ${styles["form-control"]}`}
              value={formData.expiaryDate}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>
      <br />
      <label className={classes.checkbox}>
        <span> {pathOr("", [locale, "Products", "saveLater"], t)}</span>
        <div className="form-group">
          <div className="form-check form-switch p-0 m-0">
            <input
              className="form-check-input m-0"
              name="SaveForLaterUse"
              type="checkbox"
              role="switch"
              id="flexSwitchCheckChecked"
              checked={formData.SaveForLaterUse}
              onChange={handleChange}
            />
          </div>
        </div>
      </label>
      <br />
      <button
        className="btn-main mt-3"
        style={{ display: "block", margin: "0 auto" }}
        type="submit"
        onClick={handleSubmit}
      >
        {pathOr("", [locale, "Products", "addNewBank"], t)}
      </button>
      <button
        className="btn-secondary mt-3"
        style={{ display: "block", margin: "0 auto" }}
        type="button"
        onClick={() => setShowAddAcc(false)}
      >
        {pathOr("", [locale, "Products", "cancel"], t)}
      </button>
    </form>
  )
}

export default AddBankForm

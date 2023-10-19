import React, { useEffect, useState } from "react"
import styles from "./BanksData.module.css"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import AddNewBankAcc from "./AddNewBankAcc"
import Alerto from "../../../../common/Alerto"
import axios from "axios"
import { pathOr } from "ramda"
import t from "../../../../translations.json"
const BanksData = ({ data, setShowBanksData, setProductPayload }) => {
  const { locale } = useRouter()
  const [selectedBank, setSelectedBank] = useState([])
  const [showAddAcc, setShowAddAcc] = useState(false)
  const [userData, setuserData] = useState([])
  const [fetchNewData, setfetchNewData] = useState(false)

  const changeHandler = (bankId) => {
    setSelectedBank((prev) => {
      if (prev.includes(bankId)) {
        return prev.filter((id) => id !== bankId)
      } else {
        return [...prev, bankId]
      }
    })
  }

  const submitBanksDataHanler = (event) => {
    event.preventDefault()
    setShowBanksData(false)
    if (selectedBank.length > 0) {
      setProductPayload((prev) => ({
        ...prev,
        ProductBankAccounts: [...prev.ProductBankAccounts, ...selectedBank],
      }))
    } else {
      setProductPayload((prev) => ({
        ...prev,
        PaymentOptions: prev.PaymentOptions.filter((value) => value !== 2),
        ProductBankAccounts: [],
      }))
      toast.error(locale === "en" ? "You didn't choose one account at least" : "اختر حساب واحد علي الاقل")
    }
  }

  useEffect(() => {
    if (fetchNewData) {
      const fetchBanksData = async () => {
        try {
          const { data: data } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/BankTransfersList`)
          const { data: banksData } = data
          setuserData(banksData)
        } catch (e) {
          Alerto(e)
        }
      }
      fetchBanksData()
    } else setuserData(data)
  }, [fetchNewData, data, showAddAcc])

  return (
    <div className={styles.banksData}>
      {!showAddAcc && (
        <form className={styles.box} onSubmit={submitBanksDataHanler}>
          <h2>{pathOr("", [locale, "Products", "ChooseTheBankAccount"], t)}</h2>
          {userData.map((bank) => (
            <div key={bank.id} className={styles.bankItem} style={{ textAlign: locale === "ar" ? "right" : "left" }}>
              <label htmlFor={`bank-${bank.id}`}>
                <div style={{ margin: "0 20px", display: "flex" }}>
                  <p>{pathOr("", [locale, "Products", "AccountNumber"], t)}</p>
                  <p>{bank.accountNumber}</p>
                </div>
                <div className={styles.labelsBox}>
                  <div>
                    <p>{pathOr("", [locale, "Products", "BankName"], t)}</p>
                    <p>{bank.bankName}</p>
                  </div>
                  <div>
                    <p>{pathOr("", [locale, "Products", "Holder's"], t)}</p>
                    <p>{bank.bankHolderName}</p>
                  </div>
                  <div>
                    <p>{pathOr("", [locale, "Products", "ibn"], t)}</p>
                    <p>{bank.ibanNumber}</p>
                  </div>
                </div>
              </label>
              <input
                type="checkbox"
                id={`bank-${bank.id}`}
                name="bank"
                value={bank.id}
                onChange={() => changeHandler(bank.id)}
              />
            </div>
          ))}
          <button
            type="button"
            style={{
              display: "block",
              margin: "0 auto",
              border: "1px solid #ccc",
              padding: "10px 40px",
              width: "100%",
            }}
            onClick={() => setShowAddAcc(true)}
          >
            {pathOr("", [locale, "Products", "addNewBank"], t)}
          </button>
          <button
            type="submit"
            style={{ display: "block", margin: "0 auto" }}
            className="btn-main mt-3"
            onClick={submitBanksDataHanler}
          >
            {pathOr("", [locale, "Products", "done"], t)}
          </button>
        </form>
      )}
      {showAddAcc && <AddNewBankAcc setShowAddAcc={setShowAddAcc} setfetchNewData={setfetchNewData} />}
    </div>
  )
}

export default BanksData

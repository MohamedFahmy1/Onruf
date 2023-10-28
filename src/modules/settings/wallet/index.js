import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { Row, Col } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { formatDate, handleFormErrors } from "../../../common/functions"
import Alerto from "../../../common/Alerto"
import SimpleSnackbar from "../../../common/SnackBar"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { toast } from "react-toastify"
import wallet from "../../../assets/images/wallet_icon.svg"
import Image from "next/image"
import styles from "../../../modules/products/add/stepTwo/stepTwo.module.css"

const Wallet = () => {
  const [transType, setTransType] = useState("In")
  const [success, setSuccess] = useState(false)
  const [userWalletState, setUserWalletState] = useState({})
  const { walletBalance, walletTransactionslist } = userWalletState
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const { push, locale } = useRouter()

  console.log(transType)
  const handleWalletSubmit = async (values) => {
    const formData = new FormData()
    for (let key in values) {
      formData.append("TransactionSource", transType === "In" ? "ChargeWallet" : "DrawFromWallet")
      formData.append("TransactionType", transType === "In" ? "In" : "Out")
      formData.append(key, values[key])
    }
    try {
      const result = await axios.post(
        process.env.REACT_APP_API_URL + "/AddWalletTransaction",
        formData,
        //  {
        //   TransactionSource: transType === "In" ? "ChargeWallet" : "DrawFromWallet",
        //   TransactionType: transType === "In" ? "In" : "Out",
        //   ...values,
        // }
      )
      toast.success("Done")
      fetchWalletInfo()
    } catch (e) {
      toast.error("Error")
    }
  }

  const fetchWalletInfo = async () => {
    const {
      data: { data: userWalletState },
    } = await axios.get(process.env.REACT_APP_API_URL + "/GetUserWalletTransactions")
    setUserWalletState(userWalletState)
  }

  useEffect(() => {
    fetchWalletInfo()
  }, [])

  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">{pathOr("", [locale, "Wallet", "myWallet"], t)}</h6>
        </div>
        <SimpleSnackbar text="Your transaction is processed successfully!" show={success} setShow={setSuccess} />
        <div className="contint_paner">
          <Row className="justify-content-between">
            <Col lg={5}>
              <div className="info_sec_ mb-3">
                <div className="icon">
                  <Image src={wallet} className="img-fluid" alt="wallet" />
                </div>
                <h4 className="gray-color m-0">{pathOr("", [locale, "Wallet", "myBalance"], t)}</h4>
                <h5 className="f-b m-0">
                  {walletBalance} {pathOr("", [locale, "Products", "currency"], t)}
                </h5>
              </div>
            </Col>
            <Col lg={5}>
              <form onSubmit={handleSubmit(handleWalletSubmit)}>
                {/*<div className="form-group">
                  <label style={{ textAlign: locale === "en" ? "left" : "right", display: "block" }}>
                    {pathOr("", [locale, "Products", "productCondition"], t)}
                  </label>
                  <div className="d-flex gap-3">
                    <div
                      onClick={() => {}}
                      className={`${styles.p_select} ${transType == "In" ? styles.p_select_active : ""}`}
                    >
                      {pathOr("", [locale, "Products", "new"], t)}
                    </div>
                    <div
                      onClick={() => {}}
                      className={`${styles.p_select} ${transType == "Out" ? styles.p_select_active : ""}`}
                    >
                      {pathOr("", [locale, "Products", "used"], t)}
                    </div>
                  </div>
  </div>*/}
                <ul className="swich_larg d-flex justify-content-center gap-5">
                  <li
                    className="transaction-type"
                    style={{
                      backgroundColor: transType === "In" ? "var(--main)" : undefined,
                      color: transType === "In" ? "white" : undefined,
                    }}
                  >
                    <input
                      type="radio"
                      name="account"
                      id="in"
                      checked={transType === "In"}
                      onClick={() => {
                        setTransType("In")
                      }}
                    />
                    <span className="back" />
                    <label htmlFor="in" className="mx-2">
                      {pathOr("", [locale, "Wallet", "topUp"], t)}
                    </label>
                  </li>
                  <li
                    className="transaction-type"
                    style={{
                      backgroundColor: transType === "Out" ? "var(--main)" : undefined,
                      color: transType === "Out" ? "white" : undefined,
                    }}
                  >
                    <input
                      checked={transType === "Out"}
                      type="radio"
                      name="account"
                      id="out"
                      onClick={() => {
                        setTransType("Out")
                      }}
                    />
                    <span className="back" />
                    <label htmlFor="out" className="mx-2">
                      {" "}
                      {pathOr("", [locale, "Wallet", "withdraw"], t)}
                    </label>
                  </li>
                </ul>
                <div className="my-2 po_R">
                  <input
                    {...register("TransactionAmount", { required: "You can't submit empty field " })}
                    type="number"
                    className="form-control"
                  />
                  <span
                    className="icon_fa main-color"
                    style={{
                      right: locale === "en" ? "25px" : undefined,
                      width: "fit-content",
                      left: locale === "en" ? "inherit" : "25px",
                    }}
                  >
                    {pathOr("", [locale, "Products", "currency"], t)}
                  </span>
                </div>
                <p className="errorMsg">{handleFormErrors(errors, "TransactionAmount")}</p>
                <button className="btn-main d-block w-100" type="submit">
                  {transType === "In"
                    ? pathOr("", [locale, "Wallet", "topUp"], t)
                    : pathOr("", [locale, "Wallet", "withdraw"], t)}
                </button>
              </form>
            </Col>
          </Row>
          <div className="mt-4">
            <h5 className="mb-4">{pathOr("", [locale, "Wallet", "latestProcesses"], t)}</h5>
            {walletTransactionslist?.map((transaction) => (
              <div className="item_Processes" key={transaction.id}>
                <div className="f-b">
                  <div>
                    {pathOr("", [locale, "Wallet", "no"], t)} {transaction.id}
                  </div>
                  <div>
                    {pathOr("", [locale, "Wallet", "process"], t)} : {transaction.transactionAmount}
                  </div>
                  <div className="gray-color">
                    {pathOr("", [locale, "Wallet", "transaction_type"], t)} {transaction.transactionType}
                  </div>
                  <div className="gray-color">{formatDate(transaction.transactionDate)}</div>
                </div>
                <h5 className="m-0 main-color f-b text-center">
                  <span className="d-block">{transaction.totalWalletBalance}</span>
                  {pathOr("", [locale, "Products", "currency"], t)}
                </h5>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wallet

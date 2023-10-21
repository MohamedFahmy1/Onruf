import React, { useEffect, useState } from "react"
import Options from "./options"
import PaymentCards from "./payment"
import ProfileCard from "./profileCard"
import { Row } from "react-bootstrap"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../translations.json"
import axios from "axios"
import { useSelector } from "react-redux"

const Settings = () => {
  const [bankTransfers, setBankTransfer] = useState([])
  const [accountData, setAccountData] = useState({})
  const [userWalletState, setUserWalletState] = useState({})
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)
  const { locale } = useRouter()

  const fetchBankTransfer = async () => {
    const {
      data: { data },
    } = await axios.get(process.env.REACT_APP_API_URL + "/ListBankTransfers", {
      params: {
        currentPage: 1,
      },
    })
    console.log(data, "bank datra")
    setBankTransfer(data)
  }

  const fetchAccountData = async () => {
    const {
      data: { data: accountData },
    } = await axios.get(process.env.REACT_APP_API_URL + "/GetBusinessAccountById", {
      params: { businessAccountId: buisnessAccountId },
    })
    setAccountData(accountData)
  }
  const fetchUserWalletState = async () => {
    const {
      data: { data: userWalletState },
    } = await axios.get(process.env.REACT_APP_API_URL + "/GetUserWalletTransactions")
    setUserWalletState(userWalletState)
  }

  useEffect(() => {
    fetchBankTransfer()
    fetchUserWalletState()
    fetchAccountData()
  }, [])
  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">{pathOr("", [locale, "Settings", "settings"], t)}</h6>
        </div>
        <Row>
          <ProfileCard {...accountData} />
          <PaymentCards bankTransfers={bankTransfers} />
        </Row>
        <Options userWalletState={userWalletState} />
      </div>
    </div>
  )
}

export default Settings

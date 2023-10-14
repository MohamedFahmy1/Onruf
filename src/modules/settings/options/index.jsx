import React, { useState } from "react"
import { Col, Row } from "react-bootstrap"
import { Wallet, Point, Budget, Settings, Branch, CompanyWorkers } from "../../../public/icons"
import Link from "next/link"
import Image from "next/image"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { useRouter } from "next/router"
import { Box, Button, ButtonGroup, Modal, Typography } from "@mui/material"
import { useEffect } from "react"
import axios from "axios"
import { useSelector } from 'react-redux';
import Cookies from "js-cookie"


const Options = ({ userWalletState }) => {
  const { locale } = useRouter()
  const [manageAccountPop, setManageAccountPop] = useState(false)

  return (
    <Col>
      <Row>
        <Col lg={3} md={4}>
          <div className="box-setting_">
            <Image {...Wallet} />
            <h6 className="f-b">
              {pathOr("", [locale, "Settings", "myWallet"], t)} <span>{userWalletState?.walletBalance} SAR</span>
            </h6>
            <Link href="/settings/wallet">
              <a className="btn-main">{pathOr("", [locale, "Settings", "topUpCredit"], t)}</a>
            </Link>
          </div>
        </Col>
        <Col lg={3} md={4}>
          <div className="box-setting_">
            <Image {...Point} />
            <h6 className="f-b">
              {pathOr("", [locale, "Settings", "myPoint"], t)}{" "}
              <span>150 {pathOr("", [locale, "Settings", "point"], t)}</span>
            </h6>
            <Link href="/settings/mypoints">
              <a className="btn-main">{pathOr("", [locale, "Settings", "transferMyPoints"], t)}</a>
            </Link>
          </div>
        </Col>
        <Col lg={3} md={4}>
          <div className="box-setting_">
            <Image {...Point} />
            <h6 className="f-b">{pathOr("", [locale, "Settings", "shipping"], t)}</h6>
            <Link href="/settings/shipping">
              <a className="btn-main">{pathOr("", [locale, "Settings", "manageShipping"], t)}</a>
            </Link>
          </div>
        </Col>
        <Col lg={3} md={4}>
          <div className="box-setting_">
            <Image {...Branch} />
            <h6 className="f-b">{pathOr("", [locale, "Settings", "branches"], t)}</h6>
            <Link href="/settings/branches">
              <a className="btn-main">{pathOr("", [locale, "Settings", "manageBranches"], t)}</a>
            </Link>
          </div>
        </Col>
        <Col lg={3} md={4}>
          <div className="box-setting_">
            <Image {...CompanyWorkers} />
            <h6 className="f-b">{pathOr("", [locale, "Settings", "employees"], t)}</h6>
            <Link href="/settings/employees">
              <a className="btn-main">{pathOr("", [locale, "Settings", "manageEmployees"], t)}</a>
            </Link>
          </div>
        </Col>
        <Col lg={3} md={4}>
          <div className="box-setting_">
            <Image {...Budget} />
            <h6 className="f-b">{pathOr("", [locale, "Settings", "packages"], t)}</h6>
            <Link href="/settings/packages">
              <a className="btn-main">{pathOr("", [locale, "Settings", "manageYourPackage"], t)}</a>
            </Link>
          </div>
        </Col>
        <Col lg={3} md={4}>
          <div className="box-setting_">
            <Image {...Settings} />
            <h6 className="f-b">{pathOr("", [locale, "Settings", "account"], t)}</h6>
            <button
              onClick={() => setManageAccountPop(true)}
              className="btn-main"
              data-bs-dismiss="modal"
              data-bs-toggle="modal"
              data-bs-target="#add-new-folder"
            >
              {pathOr("", [locale, "Settings", "manageAccount"], t)}
            </button>
          </div>
        </Col>
      </Row>
      <ManageAccountModal showModal={manageAccountPop} setShowModal={setManageAccountPop} />
    </Col>
  )
}

// Manage Account Popup - Better to be moved some where else

const ManageAccountModal = ({ showModal, setShowModal }) => {
  const [accountData, setAccountData] = useState(null)
  const router = useRouter()
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    height: "fit-content",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 5,
  }

  // Handle Fetch Account
  const handleFetchAccount = async () => {
    const {
      data: { data: accountData },
    } = await axios.get(process.env.REACT_APP_API_URL + "/GetBusinessAccountById", {
      params: { businessAccountId:buisnessAccountId },
    })
    setAccountData(accountData)
  }

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    const { data } = await axios.delete(process.env.REACT_APP_API_URL + "/DeleteBusinessAccount", {
      params: { businessAccountId:buisnessAccountId },
    })
    setShowModal(false)
    Cookies.remove("id")
    router.push("/")
  }

  // Handle Delete Account
  const handleAccountStatus = async (isActive) => {
    const { data } = await axios.post(
      process.env.REACT_APP_API_URL + "/ChangeBusinessAccountStatus",
      {},
      {
        params: { buisnessAccountId, isActive },
      },
    )
    handleFetchAccount()
  }

  useEffect(() => {
    handleFetchAccount();
  }, [buisnessAccountId])

  if (!accountData) {
    return null
  }else{
  return (
    <Modal
      open={showModal}
      onClose={() => {
        setShowModal(false)
      }}
      aria-labelledby="modal-manage-account"
      aria-describedby="modal-manage-account"
    >
      <Box sx={style}>
        {/* Modal Header */}
        <Box sx={{ flex: 1, pb: 2, display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h1" fontSize={24} fontWeight={"bold"}>
            Manage Account
          </Typography>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </Box>

        {/* Modal - Handle Account Status */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
          <Typography variant="h1" fontSize={18} fontWeight={"500"}>
            اظهار المتجر
          </Typography>
          <Box>
            <div
              className="form-check form-switch"
              style={{ borderRadius: 20, border: "1px solid lightgray", padding: "12px" }}
            >
              <input
                onChange={(e) => {
                  handleAccountStatus(e.target.checked)
                }}
                className="form-check-input m-0"
                checked={accountData?.isActive}
                type="checkbox"
                role="switch"
                id="flexSwitchCheckChecked"
              />
              <span className="mx-1">Active</span>
            </div>
          </Box>
        </Box>
        <hr />

        {/* Modal - Button Group */}
        <Button
          sx={{
            p: 2,
            width: "100%",
            ":hover": { bgcolor: "#45495e" },
            bgcolor: "#45495e",
            borderRadius: "100px",
            color: "#fff",
          }}
        >
          CANCEL MEMEBERSHIP
        </Button>

        <Button
          onClick={handleDeleteAccount}
          sx={{
            p: 2,
            ":hover": { bgcolor: "primary.main" },
            width: "100%",
            bgcolor: "primary.main",
            mt: 2,
            borderRadius: "100px",
            color: "#fff",
          }}
        >
          DELETE ACCOUNT
        </Button>
      </Box>
    </Modal>
  )
}
}

export default Options

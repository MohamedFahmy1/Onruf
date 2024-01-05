import { useCallback, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { Wallet, Point, Budget, Settings, Branch, CompanyWorkers } from "../../../../public/icons"
import Link from "next/link"
import Image from "next/image"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { useRouter } from "next/router"
import { Box, Button, Modal, Typography } from "@mui/material"
import { useEffect } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import Cookies from "js-cookie"
import { toast } from "react-toastify"
import Alerto from "../../../common/Alerto"
import { useFetch } from "../../../hooks/useFetch"

const Options = ({ userWalletState }) => {
  const { locale } = useRouter()
  const [manageAccountPop, setManageAccountPop] = useState(false)
  const { data: myPointsData = {} } = useFetch(`/GetUserPointsTransactions`)

  return (
    <>
      <Row>
        <Col lg={3} md={4}>
          <div className="box-setting_">
            <Image {...Wallet} alt="wallet" />
            <h6 className="f-b">
              {pathOr("", [locale, "Settings", "myWallet"], t)}{" "}
              <span>
                {userWalletState?.walletBalance} {pathOr("", [locale, "Products", "currency"], t)}
              </span>
            </h6>
            <Link href="/settings/wallet">
              <a className="btn-main">{pathOr("", [locale, "Settings", "topUpCredit"], t)}</a>
            </Link>
          </div>
        </Col>
        <Col lg={3} md={4}>
          <div className="box-setting_">
            <Image {...Point} alt="Points" />
            <h6 className="f-b">
              {pathOr("", [locale, "Settings", "myPoint"], t)}
              <span>
                {myPointsData.pointsBalance} {pathOr("", [locale, "Settings", "point"], t)}
              </span>
            </h6>
            <Link href="/settings/mypoints">
              <a className="btn-main">{pathOr("", [locale, "Settings", "transferMyPoints"], t)}</a>
            </Link>
          </div>
        </Col>
        <Col lg={3} md={4}>
          <div className="box-setting_">
            <Image {...Point} alt="shipping" />
            <h6 className="f-b">{pathOr("", [locale, "Settings", "shipping"], t)}</h6>
            <Link href="/settings/shipping">
              <a className="btn-main">{pathOr("", [locale, "Settings", "manageShipping"], t)}</a>
            </Link>
          </div>
        </Col>
        <Col lg={3} md={4}>
          <div className="box-setting_">
            <Image {...Branch} alt="branches" />
            <h6 className="f-b">{pathOr("", [locale, "Settings", "branches"], t)}</h6>
            <Link href="/settings/branches">
              <a className="btn-main">{pathOr("", [locale, "Settings", "manageBranches"], t)}</a>
            </Link>
          </div>
        </Col>
        <Col lg={3} md={4}>
          <div className="box-setting_">
            <Image {...CompanyWorkers} alt="employees" />
            <h6 className="f-b">{pathOr("", [locale, "Settings", "employees"], t)}</h6>
            <Link href="/settings/employees?page=1">
              <a className="btn-main">{pathOr("", [locale, "Settings", "manageEmployees"], t)}</a>
            </Link>
          </div>
        </Col>
        <Col lg={3} md={4}>
          <div className="box-setting_">
            <Image {...Budget} alt="packages" />
            <h6 className="f-b">{pathOr("", [locale, "Settings", "packages"], t)}</h6>
            <Link href="/settings/packages">
              <a className="btn-main">{pathOr("", [locale, "Settings", "manageYourPackage"], t)}</a>
            </Link>
          </div>
        </Col>
        <Col lg={3} md={4}>
          <div className="box-setting_">
            <Image {...Settings} alt="account" />
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
    </>
  )
}

const ManageAccountModal = ({ showModal, setShowModal }) => {
  const [accountData, setAccountData] = useState(null)
  const { locale, push } = useRouter()
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)
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
  const handleFetchAccount = useCallback(async () => {
    try {
      const {
        data: { data: accountData },
      } = await axios.get(process.env.REACT_APP_API_URL + "/GetBusinessAccountById", {
        params: { businessAccountId: buisnessAccountId },
      })
      setAccountData(accountData)
    } catch (error) {
      Alerto(error)
    }
  }, [buisnessAccountId])

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    try {
      const { data } = await axios.delete(process.env.REACT_APP_API_URL + "/DeleteBusinessAccount", {
        params: { businessAccountId: buisnessAccountId },
      })
      setShowModal(false)
      toast.success(locale === "en" ? "Account Successfully Deleted!" : "تم حذف الاكونت بنجاح")
      Cookies.remove("businessAccountId")
      Cookies.remove("Token")
      Cookies.remove("ProviderId")
      push(process.env.NEXT_PUBLIC_WEBSITE)
    } catch (error) {
      Alerto(error)
    }
  }

  // Handle Delete Account
  const handleAccountStatus = async (isActive) => {
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_API_URL +
          `/ChangeBusinessAccountStatus?businessAccountId=${buisnessAccountId}&isActive=${isActive}`,
      )
      handleFetchAccount()
      toast.success("Account Status Updated Successfully!")
    } catch (error) {
      Alerto(error)
    }
  }

  useEffect(() => {
    handleFetchAccount()
  }, [buisnessAccountId, handleFetchAccount])

  if (!accountData) {
    return null
  } else {
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
          <Box sx={{ flex: 1, pb: 2, display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h1" fontSize={24} fontWeight={"bold"}>
              {pathOr("", [locale, "Settings", "manageAccount"], t)}
            </Typography>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setShowModal(false)}
            ></button>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
            <Typography variant="h1" fontSize={18} fontWeight={"500"}>
              {pathOr("", [locale, "Settings", "showStore"], t)}
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
                  defaultChecked={accountData?.isActive}
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                />
                <span className="mx-1">{pathOr("", [locale, "Settings", "active"], t)}</span>
              </div>
            </Box>
          </Box>
          <hr />
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
            {pathOr("", [locale, "Settings", "deleteAccount"], t)}
          </Button>
        </Box>
      </Modal>
    )
  }
}

export default Options

import { useCallback, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { Wallet, Point, Budget, Branch, CompanyWorkers } from "../../../../public/icons"
import Settings from "../../../../public/icons/settings(9).svg"
import Link from "next/link"
import Image from "next/image"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { useRouter } from "next/router"
import { Box, Button, Modal, Skeleton, Typography } from "@mui/material"
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
    <section>
      <Row>
        <Col xl={3} lg={4} md={6}>
          <div className="box-setting_">
            <Image src={Wallet} alt="wallet" {...Wallet} height={82} />
            <h6 className="f-b">
              {pathOr("", [locale, "Settings", "myWallet"], t)}{" "}
              <span className="d-flex justify-content-center">
                {userWalletState?.walletBalance ? (
                  userWalletState?.walletBalance
                ) : (
                  <Skeleton variant="text" width={21} />
                )}{" "}
                {pathOr("", [locale, "Products", "currency"], t)}
              </span>
            </h6>
            <Link href="/settings/wallet">
              <span className="btn-main">{pathOr("", [locale, "Settings", "topUpCredit"], t)}</span>
            </Link>
          </div>
        </Col>
        <Col xl={3} lg={4} md={6}>
          <div className="box-setting_">
            <Image src={Point} {...Point} alt="Points" />
            <h6 className="f-b">
              {pathOr("", [locale, "Settings", "myPoints"], t)}
              <span className="d-flex justify-content-center">
                {myPointsData ? myPointsData.pointsBalance : <Skeleton variant="text" width={16} />}{" "}
                {pathOr("", [locale, "Settings", "point"], t)}
              </span>
            </h6>
            <Link href="/settings/mypoints">
              <span className="btn-main">{pathOr("", [locale, "Settings", "transferMyPoints"], t)}</span>
            </Link>
          </div>
        </Col>
        <Col xl={3} lg={4} md={6}>
          <div className="box-setting_">
            <Image src={Point} {...Point} alt="shipping" />
            <h6 className="f-b">{pathOr("", [locale, "Settings", "shipping"], t)}</h6>
            <Link href="/settings/shipping">
              <span className="btn-main">{pathOr("", [locale, "Settings", "manageShipping"], t)}</span>
            </Link>
          </div>
        </Col>
        <Col xl={3} lg={4} md={6}>
          <div className="box-setting_">
            <Image src={Branch} {...Branch} alt="branches" />
            <h6 className="f-b">{pathOr("", [locale, "Settings", "branches"], t)}</h6>
            <Link href="/settings/branches">
              <span className="btn-main">{pathOr("", [locale, "Settings", "manageBranches"], t)}</span>
            </Link>
          </div>
        </Col>
        <Col xl={3} lg={4} md={6}>
          <div className="box-setting_">
            <Image src={CompanyWorkers} {...CompanyWorkers} alt="employees" />
            <h6 className="f-b">{pathOr("", [locale, "Settings", "employees"], t)}</h6>
            <Link href="/settings/employees?page=1">
              <span className="btn-main">{pathOr("", [locale, "Settings", "manageEmployees"], t)}</span>
            </Link>
          </div>
        </Col>
        <Col xl={3} lg={4} md={6}>
          <div className="box-setting_">
            <Image src={Budget} {...Budget} alt="packages" />
            <h6 className="f-b">{pathOr("", [locale, "Settings", "packages"], t)}</h6>
            <Link href="/settings/packages">
              <span className="btn-main">{pathOr("", [locale, "Settings", "manageYourPackage"], t)}</span>
            </Link>
          </div>
        </Col>
        <Col xl={3} lg={4} md={6}>
          <div className="box-setting_">
            <Image src={Settings} width={81} height={73} alt="Settings" />
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
    </section>
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

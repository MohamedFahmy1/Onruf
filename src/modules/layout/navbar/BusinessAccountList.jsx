import React from "react"
import Image from "next/image"
import { Modal } from "@mui/material"
import { userImg } from "../../../constants"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
import { AiOutlineCloseCircle } from "react-icons/ai"
import { pathOr } from "ramda"
import t from "../../../translations.json"
const style = {
  margin: "auto",
  maxWidth: "1080px",
  minWidth: "350px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}
export const BusinessAccountList = ({
  businessAccountList,
  toggleBusinessAccountList,
  setToggleBusinessAccountList,
  setUserName,
  setUserImage,
}) => {
  const router = useRouter()
  const { locale } = useRouter()
  const setAccount = (businessAccountImage, businessAccountName, businessId, ProviderId) => {
    setUserName(businessAccountName)
    setUserImage(businessAccountImage)
    Cookies.remove("businessAccountId")
    Cookies.remove("ProviderId")
    Cookies.set("ProviderId", ProviderId)
    Cookies.set("businessAccountId", businessId)
    setToggleBusinessAccountList(false)
    router.push("/")
  }

  return (
    <Modal
      open={toggleBusinessAccountList}
      onClose={() => {
        setToggleBusinessAccountList(false)
      }}
      sx={style}
    >
      <ul
        className={`dropdown-menu ${toggleBusinessAccountList ? "show" : ""}`}
        aria-labelledby="dropdownMenuButton1"
        style={{
          minWidth: "550px",
          textAlign: "right",
          padding: "20px",
          height: "50%",
          overflowY: "auto",
          borderRadius: "20px",
        }}
      >
        <button
          type="button"
          className="text-left"
          style={{ width: "fit-content", marginRight: "auto", display: "block", marginBottom: "5px" }}
          onClick={() => setToggleBusinessAccountList(false)}
        >
          <AiOutlineCloseCircle size={40} />
        </button>
        {businessAccountList &&
          businessAccountList.map((account) => {
            return (
              <div key={account.id} className="py-2">
                <li>
                  <span className="d-flex align-items-center justify-content-between">
                    <button
                      type="button"
                      className="btn-main"
                      onClick={() =>
                        setAccount(
                          account.businessAccountImage,
                          account.businessAccountName,
                          account.id,
                          account.providerId,
                        )
                      }
                    >
                      {pathOr("", [locale, "navbar", "enter"], t)}
                    </button>
                    <div className="d-flex align-items-center">
                      <span className="icon mx-2 f-b fs-5">{account.businessAccountName}</span>
                      <Image
                        src={
                          account.businessAccountImage === null ||
                          account.businessAccountImage === "" ||
                          account.businessAccountImage === "http://onrufwebsite2-001-site1.btempurl.com/"
                            ? userImg
                            : `${account.businessAccountImage}`
                        }
                        alt="user"
                        width={60}
                        height={60}
                        style={{ borderRadius: "50%" }}
                      />
                    </div>
                  </span>
                </li>
              </div>
            )
          })}
      </ul>
    </Modal>
  )
}

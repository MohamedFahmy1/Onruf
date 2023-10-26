import React, { useEffect, useState } from "react"
import Link from "next/link"
import { userImg } from "../../../constants"
import Cookies from "js-cookie"
import { useRouter } from "next/router"

export const BusinessAccountList = ({
  businessAccountList,
  toggleBusinessAccountList,
  setToggleBusinessAccountList,
  setUserName,
  setUserImage,
}) => {
  const router = useRouter()
  const setAccount = (businessAccountImage, businessAccountName, businessId, ProviderId) => {
    setUserName(businessAccountName)
    setUserImage(businessAccountImage)
    Cookies.remove("businessId")
    Cookies.remove("id")
    Cookies.set("id", ProviderId)
    Cookies.set("businessId", businessId)
    setToggleBusinessAccountList(false)
    router.push("/")
  }

  return (
    <>
      <ul className={`dropdown-menu ${toggleBusinessAccountList ? "show" : ""}`} aria-labelledby="dropdownMenuButton1">
        {businessAccountList &&
          businessAccountList.map((account) => {
            return (
              <div key={account.id}>
                <li>
                  <Link locale="ar" href={"/"}>
                    <a
                      className="dropdown-item"
                      onClick={() =>
                        setAccount(
                          account.businessAccountImage,
                          account.businessAccountName,
                          account.id,
                          account.userId,
                        )
                      }
                    >
                      <span>
                        {" "}
                        {console.log(account.businessAccountImage)}
                        <img
                          src={
                            account.businessAccountImage === null || account.businessAccountImage === ""
                              ? userImg
                              : `http://onrufwebsite2-001-site1.btempurl.com/${account.businessAccountImage}`
                          }
                        />
                      </span>{" "}
                      <span className="icon">{account.businessAccountName}</span>
                    </a>
                  </Link>
                </li>
              </div>
            )
          })}
      </ul>
    </>
  )
}

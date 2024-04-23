import React, { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { AiOutlinePoweroff } from "react-icons/ai"
import { FaExchangeAlt } from "react-icons/fa"
import { GoSearch } from "react-icons/go"
import { logoSvg, userImg } from "../../../constants"
import t from "../../../translations.json"
import { pathOr } from "ramda"
import { BusinessAccountList } from "./BusinessAccountList"
import axios from "axios"
import { useSelector } from "react-redux"
import Image from "next/image"
import Alerto from "../../../common/Alerto"
import { Skeleton } from "@mui/material"

const Navbar = () => {
  const [toggleLangMenu, setToggleLangMenu] = useState(false)
  const { locale, asPath, push } = useRouter()
  const [toggleBusinessAccountList, setToggleBusinessAccountList] = useState()
  const [businessAccountList, setBusinessAccountList] = useState([])
  const [userImage, setUserImage] = useState()
  const [userName, setUserName] = useState()
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)
  const deviceId = useSelector((state) => state.id)
  const dropdownRef = useRef(null)

  const getAllBuisnessAccounts = async (id) => {
    try {
      const { data } = await axios.get(`/GatAllBusinessAccounts`)
      setBusinessAccountList(data.data)
    } catch (error) {
      Alerto(error)
    }
  }
  const handleSendCurrentLang = async (lang) => {
    try {
      await axios.post(`/ChangeLanguage?language=${lang}`)
    } catch (error) {
      Alerto(error)
    }
  }
  const accountData = useCallback(() => {
    const account = businessAccountList.filter((buisness) => buisness.id == buisnessAccountId)
    setUserName(account[0]?.businessAccountName)
    setUserImage(`${account[0]?.businessAccountImage}`)
  }, [buisnessAccountId, businessAccountList])

  const handleLogout = async () => {
    try {
      await axios.post("/LogoutWebsite", {
        params: { deviceId: deviceId },
      })
      push(process.env.NEXT_PUBLIC_WEBSITE)
    } catch (error) {
      Alerto(error)
    }
  }

  const onClick = () => {
    setToggleBusinessAccountList(!toggleBusinessAccountList)
  }

  useEffect(() => {
    buisnessAccountId && getAllBuisnessAccounts()
  }, [locale, buisnessAccountId])

  useEffect(() => {
    businessAccountList.length > 0 && accountData()
  }, [businessAccountList, locale, accountData])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToggleLangMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header id="header">
      <div className="d-flex align-items-center flex-grow-1">
        <button className="open_nav">{logoSvg()}</button>
        <div className="po_R flex-grow-1">
          <input
            type="search"
            className="form-control search"
            style={{ paddingLeft: "40px" }}
            placeholder={pathOr("", [locale, "navbar", "search"], t)}
          />
          <span className="icon_fa">
            <GoSearch />
          </span>
        </div>
      </div>
      <div className="top_linko">
        <div className="change_acc">
          <div className="d-flex align-items-center">
            {<Image src={userImage || userImg} alt="user" width={50} height={50} />}
            <div className="mx-1">
              <h6 className="f-b m-0">{userName ? userName : <Skeleton variant="text" width={129} height={19} />}</h6>
              <button className="main-color" onClick={() => onClick()}>
                {pathOr("", [locale, "navbar", "switch"], t)}
                <FaExchangeAlt className="mx-2" />
              </button>
            </div>
          </div>
          <button className="close_" aria-label="close Business Account" onClick={handleLogout}>
            <AiOutlinePoweroff />
          </button>
          {toggleBusinessAccountList && (
            <BusinessAccountList
              businessAccountList={businessAccountList}
              toggleBusinessAccountList={toggleBusinessAccountList}
              setToggleBusinessAccountList={setToggleBusinessAccountList}
              setUserImage={setUserImage}
              setUserName={setUserName}
            />
          )}
        </div>
        <div className="dropdown lang_" ref={dropdownRef}>
          <button
            onClick={() => setToggleLangMenu(!toggleLangMenu)}
            className="btn dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className="mx-1">{locale === "ar" ? t[locale]?.Settings.arLang : t[locale]?.Settings.enLang}</span>
          </button>
          <ul
            className={`dropdown-menu ${toggleLangMenu ? "show" : ""} mt-2`}
            style={{ left: "50%", transform: "translateX(-50%)" }}
            aria-labelledby="dropdownMenuButton1"
          >
            <li
              onClick={() => {
                setToggleLangMenu(!toggleLangMenu)
              }}
            >
              <Link locale="ar" href={asPath}>
                <button className="dropdown-item" onClick={() => handleSendCurrentLang("ar")}>
                  <span> {t[locale]?.Settings.arLang}</span> <span className="icon">AR</span>
                </button>
              </Link>
            </li>
            <li
              onClick={() => {
                setToggleLangMenu(!toggleLangMenu)
              }}
            >
              <Link locale="en" href={asPath}>
                <button className="dropdown-item" onClick={() => handleSendCurrentLang("en")}>
                  <span> {t[locale]?.Settings.enLang}</span> <span className="icon">EN</span>
                </button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Navbar

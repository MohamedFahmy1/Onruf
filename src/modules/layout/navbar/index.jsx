import React, { useEffect, useRef, useState } from "react"
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
import { useSelector, useDispatch } from "react-redux"
import { getTokensFromCookie } from "../../../appState/personalData/authActions"

const Navbar = () => {
  const [toggleLangMenu, setToggleLangMenu] = useState(false)
  const { pathname, push, locale, reload, asPath } = useRouter()
  const router = useRouter()
  const dispatch = useDispatch()
  const [toggleBusinessAccountList, setToggleBusinessAccountList] = useState()
  const [businessAccountList, setBusinessAccountList] = useState([])
  const [userImage, setUserImage] = useState(userImg)
  const [userName, setUserName] = useState()
  const token = useSelector((state) => state.authSlice.token)
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)
  const providerId = useSelector((state) => state.authSlice.providerId)
  const dropdownRef = useRef(null)

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = token
    axios.defaults.headers.common["Provider-Id"] = providerId
    axios.defaults.headers.common["Business-Account-Id"] = buisnessAccountId
    axios.defaults.headers.common["User-Language"] = locale
  }, [token, providerId, buisnessAccountId, locale])

  const getAllBuisnessAccounts = async (id) => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/GatAllBusinessAccounts`)
    setBusinessAccountList(data.data)
  }

  const accountData = () => {
    if (buisnessAccountId) {
      const account = businessAccountList.filter((buisness) => buisness.id == buisnessAccountId)
      setUserName(account[0]?.businessAccountName)
      setUserImage(`${account[0]?.businessAccountImage}`)
    }
  }

  useEffect(() => {
    dispatch(getTokensFromCookie())
  }, [router])

  useEffect(() => {
    getAllBuisnessAccounts()
  }, [locale])

  useEffect(() => {
    businessAccountList && accountData()
  }, [businessAccountList, locale])

  const onClick = () => {
    setToggleBusinessAccountList(!toggleBusinessAccountList)
  }
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
            {/* <img src="../../../public/icons/search.svg" /> */}
            <GoSearch />
          </span>
        </div>
      </div>
      <div className="top_linko">
        <div className="change_acc">
          <div className="d-flex align-items-center">
            <img src={userImage} />
            <div>
              <h6 className="f-b m-0">{userName}</h6>
              <button className="main-color" onClick={() => onClick()}>
                {pathOr("", [locale, "navbar", "switch"], t)}
                <FaExchangeAlt className="mx-2" />
              </button>
            </div>
          </div>
          <a href="#" className="close_">
            <AiOutlinePoweroff />
          </a>
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
          <ul className={`dropdown-menu ${toggleLangMenu ? "show" : ""} mt-2`} aria-labelledby="dropdownMenuButton1">
            <li
              onClick={() => {
                // push({ locale: "ar" })
                setToggleLangMenu(!toggleLangMenu)
              }}
            >
              <Link locale="ar" href={asPath}>
                <a className="dropdown-item">
                  <span> {t[locale]?.Settings.arLang}</span> <span className="icon">AR</span>
                </a>
              </Link>
            </li>
            <li
              onClick={() => {
                // push({ locale: "en" })
                setToggleLangMenu(!toggleLangMenu)
              }}
            >
              <Link locale="en" href={asPath}>
                <a className="dropdown-item">
                  <span> {t[locale]?.Settings.enLang}</span> <span className="icon">EN</span>
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Navbar

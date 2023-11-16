import { useRouter } from "next/router"
import { pathOr } from "ramda"
import React from "react"
import { Col } from "react-bootstrap"
import t from "../../../translations.json"

const Notifications = () => {
  const { locale } = useRouter()

  return (
    <Col lg={3}>
      <div className="contint_paner py-2 px-0">
        <div className="d-flex align-items-center justify-content-between mb-2 px-3">
          <h6 className="f-b m-0">{pathOr("", [locale, "Notifications", "notifications"], t)}</h6>
          <a href="#" className="main-color text-decoration-none">
            {pathOr("", [locale, "Notifications", "viewall"], t)}
          </a>
        </div>
        <ul className="list_notifcation px-3">
          <li className="item agree">
            <div className="gray-color mb-1">
              <span>{pathOr("", [locale, "Notifications", "neworder"], t)} </span>
              <span>اليوم 10:30 مساءا</span>
            </div>
            <div className="po_R">{pathOr("", [locale, "Notifications", "pendingconfirm"], t)}</div>
          </li>
          <li className="item">
            <div className="gray-color mb-1">
              <span>{pathOr("", [locale, "Notifications", "neworder"], t)} </span>
              <span>اليوم 10:30 مساءا</span>
            </div>
            <div className="po_R">{pathOr("", [locale, "Notifications", "pendingreply"], t)}</div>
          </li>
          <li className="item">
            <div className="gray-color mb-1">
              <span>{pathOr("", [locale, "Notifications", "neworder"], t)} </span>
              <span>اليوم 10:30 مساءا</span>
            </div>
            <div className="po_R">{pathOr("", [locale, "Notifications", "pendingreply"], t)}</div>
          </li>
        </ul>
      </div>
    </Col>
  )
}

export default Notifications

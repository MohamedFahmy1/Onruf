import { useRouter } from "next/router"
import { pathOr } from "ramda"
import React from "react"
import { Col } from "react-bootstrap"
import t from "../../../translations.json"

const Notifications = () => {
  const { locale } = useRouter()

  return (
    <Col lg={3}>
      <article className="contint_paner py-2 px-0">
        <section className="d-flex align-items-center justify-content-between mb-2 px-3">
          <p className="f-b fs-6 m-0">{pathOr("", [locale, "Notifications", "notifications"], t)}</p>
          <a href="#" className="main-color text-decoration-none">
            {pathOr("", [locale, "Notifications", "viewall"], t)}
          </a>
        </section>
        <ul className="list_notifcation px-3">
          <li className="item agree">
            <section className="gray-color mb-1">
              <span>{pathOr("", [locale, "Notifications", "neworder"], t)} </span>
              <span>اليوم 10:30 مساءا</span>
            </section>
            <section className="po_R">{pathOr("", [locale, "Notifications", "pendingconfirm"], t)}</section>
          </li>
          <li className="item">
            <section className="gray-color mb-1">
              <span>{pathOr("", [locale, "Notifications", "neworder"], t)} </span>
              <span>اليوم 10:30 مساءا</span>
            </section>
            <section className="po_R">{pathOr("", [locale, "Notifications", "pendingreply"], t)}</section>
          </li>
          <li className="item">
            <section className="gray-color mb-1">
              <span>{pathOr("", [locale, "Notifications", "neworder"], t)} </span>
              <span>اليوم 10:30 مساءا</span>
            </section>
            <section className="po_R">{pathOr("", [locale, "Notifications", "pendingreply"], t)}</section>
          </li>
        </ul>
      </article>
    </Col>
  )
}

export default Notifications

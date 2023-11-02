import React from "react"
import { Col } from "react-bootstrap"
import { BsArrowLeft } from "react-icons/bs"
import { userImg } from "../../../constants"
import Link from "next/link"
import { useRouter } from "next/router"

import { pathOr } from "ramda"
import t from "../../../translations.json"

const LatestOrdersWithClients = ({ clients }) => {
  const { locale } = useRouter()

  return (
    <Col md={6}>
      <div className="contint_paner">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h5 className="f-b m-0">{pathOr("", [locale, "LastOrdersWithClients", "lastOrdersWithClients"], t)}</h5>
          <Link href={`/${locale}/users`}>
            <a className="main-color font-18 text-decoration-none">
              {pathOr("", [locale, "LastOrdersWithClients", "allClients"], t)}
            </a>
          </Link>
        </div>
        <ul className="all_pro_cus">
          {Boolean(clients && clients?.length) &&
            clients.map((client, idx) => (
              <li className="item d-flex justify-content-between my-5 border-bottom" key={idx}>
                <div className="d-flex align-items-center">
                  <img src={client.imgProfile} className="img_table img_table2" />
                  <div>
                    <h6 className="m-0 f-b">{client.userName}</h6>
                    <div className="gray-color">
                      {pathOr("", [locale, "LastOrdersWithClients", "clientSince"], t)} 1/1/2020
                    </div>
                  </div>
                </div>
                <a href={`/${locale}/users/${client.id}`} className="main-color text-decoration-none">
                  <div>{pathOr("", [locale, "LastOrdersWithClients", "clientProfile"], t)}</div>
                  <BsArrowLeft />
                </a>
              </li>
            ))}
        </ul>
      </div>
    </Col>
  )
}

export default LatestOrdersWithClients

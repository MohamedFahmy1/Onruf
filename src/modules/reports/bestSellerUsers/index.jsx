import React from "react"
import { Col } from "react-bootstrap"
import user from "../../../../public/images/user.png"
import { useRouter } from "next/router"
import t from "../../../translations.json"
import { pathOr } from "ramda"

const BestSellerUsers = () => {
  const { locale } = useRouter()
  return (
    <Col md={7}>
      <div className="contint_paner">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h5 className="f-b m-0">{pathOr("", [locale, "Reports", "bestSellerClients"], t)}</h5>
          <a href="#" className="main-color font-18">
            {pathOr("", [locale, "Reports", "allClients"], t)}
          </a>
        </div>
        <ul className="all_pro_cus">
          <li className="item">
            <div className="d-flex align-items-center">
              <img src={user.src} className="img_table img_table2" />
              <div>
                <h6 className="m-0 f-b">ali Reda</h6>
                <div className="gray-color">
                  {pathOr("", [locale, "LastOrdersWithClients", "clientSince"], t)} 1/1/2020
                </div>
              </div>
            </div>
            <div>
              <div className="gray-color">{pathOr("", [locale, "Reports", "totalSell"], t)}</div>
              <div className="f-b main-color">500 S.R</div>
            </div>
          </li>
          <li className="item">
            <div className="d-flex align-items-center">
              <img src={user.src} className="img_table img_table2" />
              <div>
                <h6 className="m-0 f-b">new hyenday 2021</h6>
                <div className="gray-color">
                  {pathOr("", [locale, "LastOrdersWithClients", "clientSince"], t)} 1/1/2020
                </div>{" "}
              </div>
            </div>
            <div>
              <div className="gray-color">{pathOr("", [locale, "Reports", "totalSell"], t)}</div>
              <div className="f-b main-color">500 S.R</div>
            </div>
          </li>
          <li className="item">
            <div className="d-flex align-items-center">
              <img src={user.src} className="img_table img_table2" />
              <div>
                <h6 className="m-0 f-b">new hyenday 2021</h6>
                <div className="gray-color">
                  {pathOr("", [locale, "LastOrdersWithClients", "clientSince"], t)} 1/1/2020
                </div>{" "}
              </div>
            </div>
            <div>
              <div className="gray-color">{pathOr("", [locale, "Reports", "totalSell"], t)}</div>
              <div className="f-b main-color">500 S.R</div>
            </div>
          </li>
        </ul>
      </div>
    </Col>
  )
}

export default BestSellerUsers

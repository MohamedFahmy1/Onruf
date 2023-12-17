import React from "react"
import { Col } from "react-bootstrap"
import img from "../../../../public/images/pro1.png"

import { useRouter } from "next/router"
import t from "../../../translations.json"
import { pathOr } from "ramda"

const BestSellerProducts = () => {
  const { locale } = useRouter()

  return (
    <Col md={7}>
      <div className="contint_paner">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h5 className="f-b m-0">{pathOr("", [locale, "Reports", "mostOrderedProducts"], t)}</h5>
          <a href="#" className="main-color font-18">
            {pathOr("", [locale, "Notifications", "viewall"], t)}
          </a>
        </div>
        <ul className="all_pro_cus">
          <li className="item">
            <div className="d-flex align-items-center">
              <img src={img.src} className="img_table" />
              <div>
                <h6 className="m-0 f-b">new hyenday 2021</h6>
                <div className="gray-color">1/1/2020</div>
              </div>
            </div>
            <div>
              <div className="gray-color">{pathOr("", [locale, "Reports", "remainingQuantity"], t)}</div>
              <div className="f-b main-color">قطعة واحده</div>
            </div>
          </li>
          <li className="item">
            <div className="d-flex align-items-center">
              <img src={img.src} className="img_table" />
              <div>
                <h6 className="m-0 f-b">new hyenday 2021</h6>
                <div className="gray-color">1/1/2020</div>
              </div>
            </div>
            <div>
              <div className="gray-color">{pathOr("", [locale, "Reports", "remainingQuantity"], t)}</div>
              <div className="f-b main-color">قطعة واحده</div>
            </div>
          </li>
          <li className="item">
            <div className="d-flex align-items-center">
              <img src={img.src} className="img_table" />
              <div>
                <h6 className="m-0 f-b">new hyenday 2021</h6>
                <div className="gray-color">1/1/2020</div>
              </div>
            </div>
            <div>
              <div className="gray-color">{pathOr("", [locale, "Reports", "remainingQuantity"], t)}</div>
              <div className="f-b main-color">قطعة واحده</div>
            </div>
          </li>
        </ul>
      </div>
    </Col>
  )
}

export default BestSellerProducts

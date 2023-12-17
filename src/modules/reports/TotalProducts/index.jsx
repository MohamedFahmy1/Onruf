import React from "react"
import { Col } from "react-bootstrap"
import mask from "../../../../public/icons/Mask Group 36.svg"

import { useRouter } from "next/router"
import t from "../../../translations.json"
import { pathOr } from "ramda"

const TotalProducts = () => {
  const { locale } = useRouter()

  return (
    <Col md={5}>
      <div className="contint_paner">
        <h5 className="f-b mb-2">{pathOr("", [locale, "Reports", "totalAdsAndProducts"], t)}</h5>
        <div className="text-center mt-4 mb-4">
          <div className="img_report">
            <img src={mask.src} className="img-fluid" />
          </div>
          <h2 className="f-b h1 m-0">56</h2>
          <h4 className="mb-2">{pathOr("", [locale, "Reports", "adAndProduct"], t)}</h4>
          <div className="The-ratio">
            2.5% <i className="fas fa-chart-line"></i>
          </div>
        </div>
      </div>
    </Col>
  )
}

export default TotalProducts

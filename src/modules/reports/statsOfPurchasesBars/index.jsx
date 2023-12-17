import React from "react"
import { Col } from "react-bootstrap"
import chart from "../../../../public/images/screencapture-chartjs.png"

import { useRouter } from "next/router"
import t from "../../../translations.json"
import { pathOr } from "ramda"

const StatsOfPurchasesBars = () => {
  const { locale } = useRouter()

  return (
    <Col lg={9}>
      <div className="contint_paner">
        <h5 className="f-b mb-2">{pathOr("", [locale, "Reports", "statsOfPurchase"], t)}</h5>
        <img src={chart.src} width="100%" height="220px" />
      </div>
    </Col>
  )
}

export default StatsOfPurchasesBars

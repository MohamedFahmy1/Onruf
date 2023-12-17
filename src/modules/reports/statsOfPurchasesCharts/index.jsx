import React from "react"
import { Col } from "react-bootstrap"
import chart from "../../../../public/icons/Component.svg"
import { useRouter } from "next/router"
import t from "../../../translations.json"
import { pathOr } from "ramda"

const StatsOfPurchasesCharts = () => {
  const { locale } = useRouter()

  return (
    <Col lg={3}>
      <div className="contint_paner">
        <h5 className="f-b mb-2">{pathOr("", [locale, "Reports", "totalOfPurchase"], t)}</h5>
        <img src={chart.src} width="100%" height="220px" />
      </div>
    </Col>
  )
}

export default StatsOfPurchasesCharts

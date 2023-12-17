import React from "react"
import { Col } from "react-bootstrap"
import chart from "../../../../public/images/screencapture-chartjs.png"
import { useRouter } from "next/router"
import t from "../../../translations.json"
import { pathOr } from "ramda"

const StatsOfOrders = () => {
  const { locale } = useRouter()

  return (
    <Col md={7}>
      <div className="contint_paner">
        <h5 className="f-b mb-2">{pathOr("", [locale, "Reports", "statsOfOrder"], t)}</h5>
        <div className="mt-4 mb-4">
          <h2 className="f-b m-0 main-color">5600</h2>
          <h4 className="mb-2">{pathOr("", [locale, "Reports", "order"], t)}</h4>
          <img src={chart.src} width="100%" height="180px" />
        </div>
      </div>
    </Col>
  )
}

export default StatsOfOrders

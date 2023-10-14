import React from "react"
import { Row } from "react-bootstrap"
import StatsOfPurchasesBars from "./statsOfPurchasesBars"
import StatsOfPurchasesCharts from "./statsOfPurchasesCharts"
import TotalProducts from "./TotalProducts"
import BestSellerProducts from "./bestSellerProducts"
import TotalUsers from "./TotalUsers"
import BestSellerUsers from "./bestSellerUsers"
import StatsOfOrders from "./statsOfOrders"
import TotalOrders from "./TotalOrders"

import { useRouter } from "next/router"
import t from "../../translations.json"
import { pathOr } from "ramda"

const Reports = () => {
  const { locale } = useRouter()

  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">{pathOr("", [locale, "Reports", "reports"], t)}</h6>
        </div>

        <Row>
          <StatsOfPurchasesBars />
          <StatsOfPurchasesCharts />
        </Row>

        <Row>
          <TotalProducts />
          <BestSellerProducts />
        </Row>

        <Row>
          <TotalUsers />
          <BestSellerUsers />
        </Row>
        <Row>
          <TotalOrders />
          <StatsOfOrders />
        </Row>
      </div>
    </div>
  )
}

export default Reports

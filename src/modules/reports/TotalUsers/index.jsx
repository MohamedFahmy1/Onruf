import React from "react"
import { Col } from "react-bootstrap"
import user from "../../../public/images/screencapture-chartjs.png"
import { useRouter } from "next/router"
import t from "../../../translations.json"
import { pathOr } from "ramda"

const TotalUsers = () => {
  const { locale } = useRouter()

  return (
    <Col md={5}>
      <div className="contint_paner">
        <div className="mb-2 d-flex justify-content-between align-items-center">
          <h5 className="f-b m-0">{pathOr("", [locale, "Reports", "totalClients"], t)}</h5>
          <div className="The-ratio">
            2.5% <i className="fas fa-chart-line"></i>
          </div>
        </div>
        <div className="mt-3 mb-3">
          <h2 className="f-b m-0 main-color">5600</h2>
          <h4>{pathOr("", [locale, "Reports", "client"], t)}</h4>
          <img src={user.src} width="100%" height="180px" />
        </div>
      </div>
    </Col>
  )
}

export default TotalUsers

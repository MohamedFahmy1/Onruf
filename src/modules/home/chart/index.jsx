import React from "react"
import { Col } from "react-bootstrap"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { GrLineChart } from "react-icons/gr"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../../translations.json"

const Chart = ({ sales }) => {
  const { locale } = useRouter()

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
  const labels = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000]
  const data = {
    labels,
    datasets: [
      {
        label: "",
        data: labels.map((label) => label),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  }

  return (
    <Col lg={9}>
      <div className="contint_paner">
        <div className="d-flex gap-4">
          <div className="option_chart">
            <div className="form-group">
              <label htmlFor="chart-type">{locale === "en" ? "Chart Type" : "نوع المخطط"}</label>
              <select name="chart-type" defaultValue={1} className="form-control form-select">
                <option value={1}>{pathOr("", [locale, "Chart", "profit"], t)}</option>
                <option value={2}>{pathOr("", [locale, "Chart", "orders"], t)}</option>
                <option value={3}>{pathOr("", [locale, "Chart", "sales"], t)}</option>
              </select>
            </div>
            <h3 className="f-b main-color m-0 text-center">
              {sales} {pathOr("", [locale, "Products", "currency"], t)}
            </h3>
            <div className="font-18">{pathOr("", [locale, "Chart", "profit"], t)}</div>
            <div className="The-ratio">
              2.5% <GrLineChart id="line-chart" />
            </div>
          </div>
          <div className="flex-grow-1">
            <Line options={options} data={data} />
          </div>
        </div>
      </div>
    </Col>
  )
}

export default Chart

import React, { useMemo } from "react"
import { Col } from "react-bootstrap"
import Table from "../../../common/table"
import Pagination from "../../../common/pagination"
import { formatDate } from "../../../common/functions"
import Link from "next/link"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../../translations.json"

const LatestOrders = ({ orders }) => {
  const { locale } = useRouter()
  console.log(orders)
  const columns = useMemo(
    () => [
      {
        Header: pathOr("", [locale, "Orders", "orderNumber"], t),
        accessor: "orderNumber",
        Cell: ({ row: { original } }) => (
          <Link href={`${`orders/${original.orderId}`}`}>
            <div className="f-b" key={original.orderId} style={{ cursor: "pointer" }}>
              <a>#{original?.orderId}</a>
            </div>
          </Link>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "client"], t),
        accessor: "userName",
        Cell: ({ row: { original } }) => (
          <Link href={`${`orders/${original.orderId}`}`}>
            <h6 className="m-0 f-b" style={{ cursor: "pointer" }}>
              {original?.clientName}
            </h6>
          </Link>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "orderHistory"], t),
        accessor: "createdAt",
        Cell: ({ row: { original } }) => (
          <Link href={`${`orders/${original.orderId}`}`}>
            <h6 className="m-0 f-b" style={{ cursor: "pointer" }}>
              {original?.createdAt.slice(0, 10)}
            </h6>
          </Link>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "shipping"], t),
        accessor: "shippingFee",
        Cell: ({ row: { original } }) => (
          <Link href={`${`orders/${original.orderId}`}`}>
            <div className="f-b" style={{ cursor: "pointer" }}>
              {original?.shippingFee === 0 ? pathOr("", [locale, "Orders", "freeDelivery"], t) : original?.shippingFee}
            </div>
          </Link>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "payment"], t),
        accessor: "paymentType",
        Cell: ({ row: { original } }) => (
          <Link href={`${`orders/${original.orderId}`}`}>
            <div className="f-b" style={{ cursor: "pointer" }}>
              {original?.paymentType}
            </div>
          </Link>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "status"], t),
        accessor: "status",
        Cell: ({ row: { original } }) => (
          <Link href={`${`orders/${original.orderId}`}`}>
            <div className="f-b main-color" style={{ cursor: "pointer" }}>
              {original?.status}
            </div>
          </Link>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "total"], t),
        accessor: "totalAfterDiscount",
        Cell: ({ row: { original } }) => (
          <Link href={`${`orders/${original.orderId}`}`}>
            <div className="f-b" style={{ cursor: "pointer" }}>
              {original?.totalOrderAmountAfterDiscount} {pathOr("", [locale, "Products", "currency"], t)}
            </div>
          </Link>
        ),
      },
    ],
    [locale],
  )
  return (
    <Col>
      <div className="contint_paner">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="f-b m-0">{pathOr("", [locale, "LastOrders", "lastorders"], t)}</h5>
          <Link href={`/${locale}/orders`}>
            <a href="#" className="main-color font-18 text-dcoration-none">
              {pathOr("", [locale, "Notifications", "viewall"], t)}
            </a>
          </Link>
        </div>
        <div className="outer_table">
          {orders && <Table columns={columns} data={orders} pageSize={8} isCheckbox={false} />}
          <Pagination listLength={orders?.length} pageSize={8} />
        </div>
      </div>
    </Col>
  )
}

export default LatestOrders

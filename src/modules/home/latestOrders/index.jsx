import React, { useMemo } from "react"
import { Col } from "react-bootstrap"
import Table from "../../../common/table"
import Pagination from "../../../common/pagination"
import { formatDate, orderStatusTranslate, paymentTypesTranslation } from "../../../common/functions"
import Link from "next/link"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { useSelector } from "react-redux"

const LatestOrders = ({ orders }) => {
  const { locale } = useRouter()
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)

  const columns = useMemo(
    () => [
      {
        Header: pathOr("", [locale, "Orders", "orderNumber"], t),
        accessor: "orderNumber",
        Cell: ({ row: { original } }) => (
          <Link href={`${`orders/${original.orderId}`}`}>
            <div className="f-b" key={original.orderId} style={{ cursor: "pointer" }}>
              <span>#{original?.orderId}</span>
            </div>
          </Link>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "client"], t),
        accessor: "userName",
        Cell: ({ row: { original } }) => (
          <Link href={`${`orders/${original.orderId}`}`}>
            <p className="m-0 fs-6 f-b" style={{ cursor: "pointer" }}>
              {original?.clientName}
            </p>
          </Link>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "orderHistory"], t),
        accessor: "createdAt",
        Cell: ({ row: { original } }) => (
          <Link href={`${`orders/${original.orderId}`}`}>
            <p className="m-0 fs-6" style={{ cursor: "pointer" }}>
              {formatDate(original?.createdAt)}
            </p>
          </Link>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "shipping"], t),
        accessor: "shippingFee",
        Cell: ({ row: { original } }) => (
          <Link href={`${`orders/${original.orderId}`}`}>
            <div className="f-b" style={{ cursor: "pointer" }}>
              {original?.shippingFee === 0
                ? pathOr("", [locale, "Orders", "freeDelivery"], t)
                : `${pathOr("", [locale, "Products", "currency"], t)} ${original?.shippingFee}`}
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
              {paymentTypesTranslation(original?.paymentType, locale)}
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
              {original?.status && orderStatusTranslate(original?.status, locale)}
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
      <article className="contint_paner">
        <section className="d-flex align-items-center justify-content-between mb-3">
          <p className="f-b fs-5 m-0">{pathOr("", [locale, "LastOrders", "lastorders"], t)}</p>
          <Link href={`/${locale || "en"}/orders`}>
            <button className="main-color font-18 text-dcoration-none">
              {pathOr("", [locale, "Notifications", "viewall"], t)}
            </button>
          </Link>
        </section>
        <section className="outer_table">
          {orders && <Table columns={columns} data={orders} pageSize={8} isCheckbox={false} />}
          {buisnessAccountId && <Pagination listLength={orders?.length} pageSize={8} />}
        </section>
      </article>
    </Col>
  )
}

export default LatestOrders

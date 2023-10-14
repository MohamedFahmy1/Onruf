import React, { useMemo } from 'react'
import { Col } from 'react-bootstrap'
import Table from '../../../common/table'
import Pagination from '../../../common/pagination'
import { formatDate } from '../../../common/functions'
import OrdersStaticData from '../../../../OrdersStaticData.json'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { pathOr } from "ramda"
import t from "../../../translations.json"

const LatestOrders = ({ orders }) => {
  const { locale } = useRouter()

  const columns = useMemo(
    () => [
      {
        Header: pathOr("", [locale, "LastOrders", "orderNo"], t),
        accessor: "orderNumber",
        Cell: ({ row: { original } }) => <div className="f-b">#{original?.orderId}</div>,
      },
      {
        Header: pathOr("", [locale, "LastOrders", "client"], t),
        accessor: "userName",
        Cell: ({ row: { original } }) => (
          <div>
            <h6 className="m-0 f-b">{original?.clientName}</h6>
            <div className="gray-color">{original?.shippingAddress}</div>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "LastOrders", "orderDate"], t),
        accessor: "dateTime",
        Cell: ({ row: { original } }) => (
          <div>
            <h6 className="m-0 f-b">{formatDate(original?.createdAt)}</h6>
            {/* <div className="gray-color">مساء 4:50</div> */}
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "LastOrders", "shipping"], t),
        accessor: "shipping",
        Cell: ({ row: { original } }) => <div className="f-b">{original?.shipping}</div>,
      },
      {
        Header: pathOr("", [locale, "LastOrders", "pay"], t),
        accessor: "pay",
        Cell: ({ row: { original } }) => <div className="f-b">{original?.payType}</div>,
      },
      {
        Header: pathOr("", [locale, "LastOrders", "orderStatus"], t),
        accessor: "status",
        Cell: ({ row: { original } }) => (
          <div className="f-b main-color">{original?.status}</div>
        ),
      },
      {
        Header: pathOr("", [locale, "LastOrders", "total"], t),
        accessor: "totalAfterDiscount",
        Cell: ({ row: { original } }) => <div className="f-b">S.R {original?.totalOrderAmountAfterDiscount}</div>,
      },
    ],
    []
  )

  return (
    <Col>
      <div className="contint_paner">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="f-b m-0">{pathOr("", [locale, "LastOrders", "lastorders"], t)}</h5>
          <Link href={`/${locale}/orders`}><a href="#" className="main-color font-18 text-dcoration-none">
            {pathOr("", [locale, "Notifications", "viewall"], t)}
          </a></Link>
        </div>
        <div className="outer_table">
          {orders && <Table columns={columns} data={ orders} pageSize={8} isCheckbox={false} />}
          <Pagination listLength={orders?.length} pageSize={8} />
        </div>
      </div>
    </Col>
  )
}

export default LatestOrders

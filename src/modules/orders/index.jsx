import React, { useMemo, useState } from "react"
import Pagination from "../../common/pagination"
import Table from "../../common/table"
import axios from "axios"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../translations.json"
import Link from "next/link"
import { useSelector } from "react-redux"

const Orders = () => {
  const [shippingOptions, setShippingOptions] = useState()
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)
  const [orders, setOrders] = useState()
  const { locale } = useRouter()
  const [orderStatus, setorderStatus] = useState()
  const [totalOrders, setTotalOrders] = useState({
    total: 0,
    WaitingForPayment: 0,
    WaitingForReview: 0,
    InProgress: 0,
    ReadyForDelivery: 0,
    DeliveryInProgress: 0,
    Delivered: 0,
    Canceled: 0,
  })
  const [filter, setFilter] = useState({
    paymentType: null,
    shippingOptionId: null,
    year: null,
  })
  useEffect(() => {
    const fetchShippingOptions = async () => {
      const {
        data: { data: shippingOptions },
      } = await axios.get(process.env.REACT_APP_API_URL + "/GetAllShippingOptions", {
        params: { businessAccountId: buisnessAccountId, lang: locale },
      })
      console.log("shippingOptions:", shippingOptions)
      setShippingOptions(shippingOptions)
    }
    fetchShippingOptions()
  }, [buisnessAccountId, locale])
  useEffect(() => {
    const getOrder = async () => {
      const {
        data: { data },
      } = await axios(
        `${process.env.REACT_APP_API_URL}/GetBusinessAccountOrders?pageIndex=1&PageRowsCount=100000
        ${orderStatus ? `&orderStatus=${orderStatus}` : ``}`,
      )
      if (!orderStatus) {
        const WaitingForPayment = data.filter((item) => item.status === "Waiting For Payment")
        const WaitingForReview = data.filter((item) => item.status === "Waiting For Review")
        const InProgress = data.filter((item) => item.status === "In Progress")
        const ReadyForDelivery = data.filter((item) => item.status === "Ready For Delivery")
        const DeliveryInProgress = data.filter((item) => item.status === "Delivery In Progress")
        const Delivered = data.filter((item) => item.status === "Delivered")
        const Canceled = data.filter((item) => item.status === "Canceled")
        setTotalOrders({
          total: data.length,
          WaitingForPayment: WaitingForPayment.length,
          WaitingForReview: WaitingForReview.length,
          InProgress: InProgress.length,
          ReadyForDelivery: ReadyForDelivery.length,
          DeliveryInProgress: DeliveryInProgress.length,
          Delivered: Delivered.length,
          Canceled: Canceled.length,
        })
        setorderStatus("WaitingForPayment")
      }
      setOrders(data)
      console.log("orders:", data)
    }
    getOrder()
  }, [orderStatus])
  const filterOrders = () => {
    let updatedOrders
    if (filter.paymentType !== null) {
      updatedOrders = orders.filter((item) => item.paymentTypeId === filter.paymentType)
    }
    // if (filter.shippingOptionId !== null) {
    //   updatedOrders = orders.filter((item) => item.paymentTypeId === filter.paymentType)
    // }
    // setOrders()
  }

  const columns = useMemo(
    () => [
      {
        Header: pathOr("", [locale, "Orders", "orderNumber"], t),
        accessor: "orderNumber",
        Cell: ({ row: { original } }) => (
          <div className="f-b" key={original.orderId}>
            <Link href={`${`orders/${original.orderId}`}`}>
              <a>#{original?.orderId}</a>
            </Link>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "client"], t),
        accessor: "userName",
        Cell: ({ row: { original } }) => (
          <div>
            <h6 className="m-0 f-b">{original?.clientName}</h6>
            {/* <div className="gray-color">{original?.city}</div> */}
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "orderHistory"], t),
        accessor: "createdAt",
        Cell: ({ row: { original } }) => (
          <div>
            <h6 className="m-0 f-b">{original?.createdAt.slice(0, 10)}</h6>
            {/* <div className="gray-color">مساء 4:50</div> */}
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "shipping"], t),
        accessor: "shippingFee",
        Cell: ({ row: { original } }) => (
          <div className="f-b">
            {original?.shippingFee === 0 ? pathOr("", [locale, "Orders", "freeDelivery"], t) : original?.shippingFee}
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "payment"], t),
        accessor: "paymentType",
        Cell: ({ row: { original } }) => <div className="f-b">{original?.paymentType}</div>,
      },
      {
        Header: pathOr("", [locale, "Orders", "status"], t),
        accessor: "status",
        Cell: ({ row: { original } }) => <div className="f-b main-color">{original?.status}</div>,
      },
      {
        Header: pathOr("", [locale, "Orders", "total"], t),
        accessor: "totalAfterDiscount",
        Cell: ({ row: { original } }) => <div className="f-b">S.R {original?.totalOrderAmountAfterDiscount}</div>,
      },
    ],
    [locale],
  )
  return (
    <>
      <div className="body-content">
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">
            {" "}
            {pathOr("", [locale, "Orders", "orders"], t)} ( {orders && totalOrders.total} )
          </h6>
          <div className="filtter_2">
            <select
              className="form-control form-select"
              style={{ width: "170px" }}
              onChange={() => setFilter({ ...filter, year: e.target.value })}
            >
              <option hidden disabled selected>
                {pathOr("", [locale, "Orders", "orderHistory"], t)}
              </option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
              <option value={2021}>2021</option>
              <option value={2020}>2020</option>
            </select>
            <select
              className="form-control form-select"
              style={{ width: "170px" }}
              onChange={() => setFilter({ ...filter, shippingOptionId: e.target.value })}
            >
              <option hidden disabled selected>
                {pathOr("", [locale, "Orders", "filterByShipping"], t)}
              </option>
              {shippingOptions?.map((item) => (
                <option key={item.id}>{item.shippingOptionName}</option>
              ))}
            </select>
            <select
              className="form-control form-select"
              style={{ width: "170px" }}
              onChange={() => setFilter({ ...filter, paymentType: e.target.value })}
            >
              <option hidden disabled selected>
                {pathOr("", [locale, "Orders", "filterByPayment"], t)}
              </option>
              <option value={1}>{pathOr("", [locale, "Products", "cash"], t)}</option>
              <option value={2}>{pathOr("", [locale, "Products", "bankTransfer"], t)}</option>
              <option value={3}>{pathOr("", [locale, "Products", "creditCard"], t)}</option>
              <option value={4}>{pathOr("", [locale, "Products", "mada"], t)}</option>
            </select>
            <button className="btn-main rounded-0" onClick={filterOrders}>
              {" "}
              {pathOr("", [locale, "Orders", "filter"], t)}
            </button>
          </div>
        </div>
        <div className="filtter_1">
          <button
            className={orderStatus === "WaitingForPayment" ? "btn-main active" : "btn-main"}
            onClick={() => setorderStatus("WaitingForPayment")}
          >
            {pathOr("", [locale, "Orders", "waiting_for_payment"], t)}({totalOrders?.WaitingForPayment})
          </button>
          <button
            className={orderStatus === "WaitingForReview" ? "btn-main active" : "btn-main"}
            onClick={() => setorderStatus("WaitingForReview")}
          >
            {pathOr("", [locale, "Orders", "waiting_for_review"], t)} ({totalOrders.WaitingForReview})
          </button>
          <button
            className={orderStatus === "InProgress" ? "btn-main active" : "btn-main"}
            onClick={() => setorderStatus("InProgress")}
          >
            {" "}
            {pathOr("", [locale, "Orders", "in_progress"], t)} ({totalOrders.InProgress})
          </button>
          <button
            className={orderStatus === "ReadyForDelivery" ? "btn-main active" : "btn-main"}
            onClick={() => setorderStatus("ReadyForDelivery")}
          >
            {pathOr("", [locale, "Orders", "ready_for_delivery"], t)} ({totalOrders.ReadyForDelivery})
          </button>
          <button
            className={orderStatus === "DeliveryInProgress" ? "btn-main active" : "btn-main"}
            onClick={() => setorderStatus("DeliveryInProgress")}
          >
            {pathOr("", [locale, "Orders", "delivery_in_progress"], t)} ({totalOrders.DeliveryInProgress})
          </button>
          <button
            className={orderStatus === "Delivered" ? "btn-main active" : "btn-main"}
            onClick={() => setorderStatus("Delivered")}
          >
            {pathOr("", [locale, "Orders", "delivered"], t)} ({totalOrders.Delivered})
          </button>
          <button
            className={orderStatus === "Canceled" ? "btn-main active" : "btn-main"}
            onClick={() => setorderStatus("Canceled")}
          >
            {pathOr("", [locale, "Orders", "canceled"], t)} ({totalOrders.Canceled})
          </button>
        </div>
        <div className="contint_paner">
          {orders && <Table columns={columns} data={orders && orders} pageSize={10} />}
          {orders && orders?.length > 10 && <Pagination listLength={orders && orders.length} pageSize={10} />}
        </div>
      </div>
      <div className="btns_fixeds">
        <button className="btn-main btn-main-w rounded-0">
          {pathOr("", [locale, "Orders", "changeSelectorStatus"], t)}
        </button>
        <button className="btn-main btn-main-w rounded-0">{pathOr("", [locale, "Orders", "selectBranch"], t)}</button>
        <button className="btn-main btn-main-w rounded-0">
          {pathOr("", [locale, "Orders", "downloadSelectorInvoice"], t)}
        </button>
      </div>
    </>
  )
}
export default Orders

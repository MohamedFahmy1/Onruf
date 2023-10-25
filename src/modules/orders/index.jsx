import React, { Fragment, useMemo, useState } from "react"
import Pagination from "../../common/pagination"
import Table from "../../common/table"
import axios from "axios"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../translations.json"
import Link from "next/link"
import { useSelector } from "react-redux"
import styles from "./orders.module.css"
import { toast } from "react-toastify"
import ChangeStatusModal from "./ChangeStatusModal"
import ChangeBranchModal from "./ChangeBranchModal"
const Orders = () => {
  // const [shippingOptions, setShippingOptions] = useState()
  // const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)
  const [openBranchModal, setOpenBranchModal] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [branchesData, setBranchesData] = useState()
  const [updateOrders, setUpdateOrders] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState()
  const [selectedRows, setSelectedRows] = useState({})
  const [filterdOrders, setFilterdOrders] = useState()
  const [showFilter, setShowFilter] = useState(false)
  const [orders, setOrders] = useState()
  const { locale } = useRouter()
  const [orderStatus, setOrderStatus] = useState()
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
    paymentType: "",
    // shippingOptionId: "",
    year: "",
  })

  // useEffect(() => {
  //   const fetchShippingOptions = async () => {
  //     const {
  //       data: { data: shippingOptions },
  //     } = await axios.get(process.env.REACT_APP_API_URL + "/GetAllShippingOptions", {
  //       params: { businessAccountId: buisnessAccountId, lang: locale },
  //     })
  //     setShippingOptions(shippingOptions)
  //   }
  //   fetchShippingOptions()
  // }, [buisnessAccountId, locale])

  useEffect(() => {
    const getBranchesData = async () => {
      const {
        data: { data: data },
      } = await axios.get(`${process.env.REACT_APP_API_URL}/GetListBrancheByProviderId?lang=${locale}`)
      let branches = data.map((item) => {
        return { branchName: item.name, branchId: item.id }
      })
      setBranchesData(branches)
    }
    getBranchesData()
  }, [locale, openBranchModal])

  useEffect(() => {
    const getOrder = async () => {
      const {
        data: { data },
      } = await axios(
        `${process.env.REACT_APP_API_URL}/GetBusinessAccountOrders?pageIndex=1&PageRowsCount=100000
        ${orderStatus ? `&orderStatus=${orderStatus}` : ``}`,
      )
      if (!orderStatus || updateOrders) {
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
        setOrderStatus("WaitingForPayment")
        setUpdateOrders(false)
        updateOrders && setFilterdOrders()
      }
      setSelectedRows()
      setSelectedOrders()
      setOrders(data)
    }
    getOrder()
  }, [orderStatus, updateOrders])

  let paymentTyp
  switch (filter?.paymentType) {
    case "1":
      paymentTyp = pathOr("", [locale, "Products", "cash"], t)
      break
    case "2":
      paymentTyp = pathOr("", [locale, "Products", "bankTransfer"], t)
      break
    case "3":
      paymentTyp = pathOr("", [locale, "Products", "creditCard"], t)
      break
    case "4":
      paymentTyp = pathOr("", [locale, "Products", "mada"], t)
      break
  }
  const filterOrders = () => {
    if (!filter?.paymentType && !filter?.year) {
      toast.error(locale === "en" ? "Please Choose at least one filter!" : "أختر علي الاقل فلتر واحد")
      return
    } else {
      let updatedOrders
      if (filter?.paymentType !== "") {
        updatedOrders = orders.filter((item) => item.paymentTypeId == filter.paymentType)
      }
      // if (filter.shippingOptionId !== "") {
      //   updatedOrders = orders.filter((item) => item.shippingOptionId === filter.shippingOptionId)
      // }
      if (filter?.year !== "") {
        updatedOrders = orders.filter((item) => item.createdAt.slice(0, 4) == filter.year)
      }
      if (filter?.year !== "" && filter?.paymentType !== "") {
        updatedOrders = orders.filter((item) => item.paymentTypeId == filter.paymentType)
        updatedOrders = updatedOrders.filter((item) => item.createdAt.slice(0, 4) == filter.year)
      }
      setFilterdOrders(updatedOrders)
      setShowFilter(true)
    }
  }
  const deleteAllFilters = () => {
    setFilter({
      paymentType: "",
      year: "",
    })
    setFilterdOrders()
    setShowFilter(false)
  }
  const deletePaymentTypeFilter = () => {
    setFilter((prev) => ({
      ...prev,
      paymentType: "",
    }))
    setFilterdOrders()
    if (filter.year === "") {
      setShowFilter(false)
    }
  }
  const deleteYearFilter = () => {
    setFilter((prev) => ({
      ...prev,
      year: "",
    }))
    setFilterdOrders()
    if (filter.paymentType === "") {
      setShowFilter(false)
    }
  }
  // Selecting Multi Rows in the gird
  const rows = Object.keys(selectedRows ? selectedRows : {})
  const selectedOrdersObj = rows.map((row) => {
    const selectedRow = orders.filter((_, index) => index === +row)
    return { orderId: selectedRow?.[0]?.orderId, orderStatus: selectedRow?.[0]?.orderStatus }
  })
  useEffect(() => {
    setSelectedOrders(selectedOrdersObj)
  }, [selectedRows])

  // const changeSelectedOrdersStatus = async () => {
  //   if (selectedOrdersIds) {
  //     try {
  //       await axios.post(`${process.env.REACT_APP_API_URL}/ChangeOrderStatus?orderId=1&status=`)
  //     } catch (error) {

  //     }
  //   }
  // }
  // Columns of the gird
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
    <Fragment>
      <div className="body-content">
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">
            {" "}
            {pathOr("", [locale, "Orders", "orders"], t)} ( {orders && totalOrders.total} )
          </h6>
          <div className="filtter_2">
            <select
              className="form-control form-select"
              style={{ width: "180px" }}
              onChange={(e) => setFilter((prev) => ({ ...prev, year: e.target.value }))}
              value={filter.year || ""}
            >
              <option hidden disabled selected value={""}>
                {pathOr("", [locale, "Orders", "orderHistory"], t)}
              </option>
              <option value={2023}>2023</option>
              <option value={2022}>2022</option>
              <option value={2021}>2021</option>
              <option value={2020}>2020</option>
            </select>
            {/*<select
              className="form-control form-select"
              style={{ width: "180px" }}
              onChange={(e) => setFilter((prev) => ({ ...prev, shippingOptionId: e.target.value }))}
            >
              <option hidden disabled selected>
                {pathOr("", [locale, "Orders", "filterByShipping"], t)}
              </option>
              {shippingOptions?.map((item) => (
                <option key={item.id}>{item.shippingOptionName}</option>
              ))}
              </select>*/}
            <select
              className="form-control form-select"
              style={{ width: "210px" }}
              onChange={(e) => setFilter((prev) => ({ ...prev, paymentType: e.target.value }))}
              value={filter.paymentType || ""}
            >
              <option hidden disabled selected value={""}>
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
        {showFilter && (
          <div className={locale === "en" ? `m-3 text-left ${styles.filter}` : `m-3 text-right ${styles.filter}`}>
            <p className="fs-5">
              {pathOr("", [locale, "Orders", "filter"], t)}{" "}
              <a href="#" className="text-decoration-underline f-b main-color" onClick={deleteAllFilters}>
                {pathOr("", [locale, "Orders", "deleteAllFilters"], t)}
              </a>
            </p>
            <div>
              {filter?.year && (
                <div>
                  {filter?.year}
                  <button type="button" onClick={deleteYearFilter}>
                    X
                  </button>
                </div>
              )}
              {filter.paymentType && (
                <div>
                  {paymentTyp}
                  <button type="button" onClick={deletePaymentTypeFilter}>
                    X
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="filtter_1">
          <button
            className={orderStatus === "WaitingForPayment" ? "btn-main active" : "btn-main"}
            onClick={() => setOrderStatus("WaitingForPayment")}
          >
            {pathOr("", [locale, "Orders", "waiting_for_payment"], t)} ({totalOrders.WaitingForPayment})
          </button>
          <button
            className={orderStatus === "WaitingForReview" ? "btn-main active" : "btn-main"}
            onClick={() => setOrderStatus("WaitingForReview")}
          >
            {pathOr("", [locale, "Orders", "waiting_for_review"], t)} ({totalOrders.WaitingForReview})
          </button>
          <button
            className={orderStatus === "InProgress" ? "btn-main active" : "btn-main"}
            onClick={() => setOrderStatus("InProgress")}
          >
            {" "}
            {pathOr("", [locale, "Orders", "in_progress"], t)} ({totalOrders.InProgress})
          </button>
          <button
            className={orderStatus === "ReadyForDelivery" ? "btn-main active" : "btn-main"}
            onClick={() => setOrderStatus("ReadyForDelivery")}
          >
            {pathOr("", [locale, "Orders", "ready_for_delivery"], t)} ({totalOrders.ReadyForDelivery})
          </button>
          <button
            className={orderStatus === "DeliveryInProgress" ? "btn-main active" : "btn-main"}
            onClick={() => setOrderStatus("DeliveryInProgress")}
          >
            {pathOr("", [locale, "Orders", "delivery_in_progress"], t)} ({totalOrders.DeliveryInProgress})
          </button>
          <button
            className={orderStatus === "Delivered" ? "btn-main active" : "btn-main"}
            onClick={() => setOrderStatus("Delivered")}
          >
            {pathOr("", [locale, "Orders", "delivered"], t)} ({totalOrders.Delivered})
          </button>
          <button
            className={orderStatus === "Canceled" ? "btn-main active" : "btn-main"}
            onClick={() => setOrderStatus("Canceled")}
          >
            {pathOr("", [locale, "Orders", "canceled"], t)} ({totalOrders.Canceled})
          </button>
        </div>
        <div className="contint_paner">
          {orders && (
            <Table
              columns={columns}
              data={filterdOrders === undefined ? orders : filterdOrders}
              pageSize={10}
              selectedRows={selectedRows}
              onSelectedRowsChange={setSelectedRows}
            />
          )}
          {orders && orders?.length > 10 && (
            <Pagination listLength={filterdOrders ? filterdOrders.length : orders.length} pageSize={10} />
          )}
        </div>
        <ChangeStatusModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          selectedOrders={selectedOrders}
          setUpdateOrders={setUpdateOrders}
          setOrderStatus={setOrderStatus}
        />
        <ChangeBranchModal
          openBranchModal={openBranchModal}
          setOpenBranchModal={setOpenBranchModal}
          branchesData={branchesData}
          ordersId={selectedOrders?.map((item) => item.orderId)}
          // orderBranch={branchId}
        />
      </div>
      <div className={`btns_fixeds ${styles.buttons}`}>
        <button
          className="btn-main btn-w rounded-0"
          onClick={() => {
            if (selectedOrders.length > 0) {
              setOpenModal(true)
            } else
              toast.error(locale === "en" ? "Choose at least one order from the grid!" : "!اختر طلب واحد علي الاقل")
          }}
        >
          {pathOr("", [locale, "Orders", "changeSelectorStatus"], t)}
        </button>
        <button
          className="btn-main btn-w rounded-0"
          onClick={() => {
            if (selectedOrders.length > 0) {
              setOpenBranchModal(true)
            } else
              toast.error(locale === "en" ? "Choose at least one order from the grid!" : "!اختر طلب واحد علي الاقل")
          }}
        >
          {pathOr("", [locale, "Orders", "selectBranch"], t)}
        </button>
        <button className="btn-main btn-w rounded-0">
          {pathOr("", [locale, "Orders", "downloadSelectorInvoice"], t)}
        </button>
      </div>
    </Fragment>
  )
}
export default Orders

import React, { useMemo, useState } from "react"
import Pagination from "../../common/pagination"
import Table from "../../common/table"
import { formatDate } from "../../common/functions"
import orders from "../../../OrdersStaticData.json"
import { RiFolder5Fill } from "react-icons/ri"
import Modal from "react-bootstrap/Modal"
import axios from "axios"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../translations.json"
import Link from "next/link"

const Orders = () => {
  const [selectedFilter, setSelectedFilter] = useState("avaliableOrders")
  const [openFolderModal, setOpenFolderModal] = useState(false)
  const [orders, setOrders] = useState()
  const { locale } = useRouter()

  const getOrder = async () => {
    const {
      data: { data },
    } = await axios(`${process.env.REACT_APP_API_URL}/ListNewOrderForProvider?lang=${locale}`)
    setOrders(data)
  }

  useEffect(() => {
    getOrder()
  }, [])

  const ordersCount = orders && orders?.orderLists?.length
  const avaliableOrders = (orders && orders?.orderLists?.filter(({ isActive }) => isActive)) || []
  const inActiveOrders = (orders && orders?.orderLists?.filter(({ isActive }) => !isActive)) || []
  const ordersAlmostOut = (orders && orders?.orderLists?.filter(({ qty }) => qty < 2)) || []

  const filterOrders =
    selectedFilter === "avaliableOrders"
      ? avaliableOrders
      : selectedFilter === "ordersAlmostOut"
      ? ordersAlmostOut
      : inActiveOrders

  const columns = useMemo(
    () => [
      {
        Header: pathOr("", [locale, "Orders", "orderNumber"], t),
        accessor: "orderNumber",
        Cell: ({ row: { original } }) => <div className="f-b" key={original.orderId}><Link href={`${`orders/${original.orderId}`}`}><a>#{original?.orderId}</a></Link></div>,
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
        accessor: "dateTime",
        Cell: ({ row: { original } }) => (
          <div>
            <h6 className="m-0 f-b">{original?.dateTime}</h6>
            {/* <div className="gray-color">مساء 4:50</div> */}
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "shipping"], t),
        accessor: "shipping",
        Cell: ({ row: { original } }) => (
          <div className="f-b">{original?.shippingAddress?.slice(0, original.shippingAddress.length / 2)}...</div>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "payment"], t),
        accessor: "payment",
        Cell: ({ row: { original } }) => <div className="f-b">{original?.payType}</div>,
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
    [],
  )
  return (
    <>
      <div className="body-content">
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">
            {" "}
            {pathOr("", [locale, "Orders", "orders"], t)} ( {orders && orders?.countAllOrders} )
          </h6>
          <div className="filtter_2">
            <select className="form-control form-select">
              <option hidden disabled selected>
                {pathOr("", [locale, "Orders", "orderHistory"], t)}
              </option>
              <option>-----</option>
              <option>-----</option>
            </select>
            <select className="form-control form-select">
              <option hidden disabled selected>
                {pathOr("", [locale, "Orders", "filterByShipping"], t)}
              </option>
              <option>-----</option>
              <option>-----</option>
            </select>
            <select className="form-control form-select">
              <option hidden disabled selected>
                {pathOr("", [locale, "Orders", "filterByPayment"], t)}
              </option>
              <option>-----</option>
              <option>-----</option>
            </select>
            <button className="btn-main rounded-0"> {pathOr("", [locale, "Orders", "filter"], t)}</button>
          </div>
        </div>
        <div className="filtter_1">
          <button className="btn-main active">
            {pathOr("", [locale, "Orders", "pendingconfirm"], t)}
            ()
          </button>
          <button className="btn-main">
            {pathOr("", [locale, "Orders", "pendingpayment"], t)} ({orders && orders?.awaitingPayment})
          </button>
          <button className="btn-main"> {pathOr("", [locale, "Orders", "ontheway"], t)} ()</button>
          <button className="btn-main">
            {pathOr("", [locale, "Orders", "recieved"], t)} ({orders && orders?.finishedOrder})
          </button>
          <button className="btn-main">{pathOr("", [locale, "Orders", "cancelled"], t)} ()</button>
        </div>
        <div className="contint_paner">
          <Table columns={columns} data={orders && orders} pageSize={10} />
          {orders && orders?.orderLists?.length > 10 && (
            <Pagination listLength={orders && orders.length} pageSize={10} />
          )}
        </div>
      </div>
      {/* Folder Modal */}
      <Modal show={openFolderModal} onHide={() => setOpenFolderModal(false)}>
        <Modal.Header>
          <h5 className="modal-title m-0 f-b" id="staticBackdropLabel">
            {false ? pathOr("", [locale, "Orders", "folder"], t) : "اختر المجلد"}
          </h5>
          <button type="button" className="btn-close" onClick={() => setOpenFolderModal(false)}></button>
        </Modal.Header>
        <Modal.Body>
          {false ? (
            <div className="form-group">
              <label>اسم المجلد</label>
              <input type="text" className="form-control" placeholder="اكتب اسم المجلد" />
            </div>
          ) : (
            <ul className="list_folder">
              <li className="item">
                <div>
                  <img src="../core/imgs/home1.jpg" />
                  <div>
                    <h6 className="f-b">مجلد السيارات</h6>
                    <div className="gray-color">
                      <span className="main-color f-b">130</span> منتج مضاف
                    </div>
                  </div>
                </div>
                <button className="btn-main">حفظ</button>
              </li>
              <li className="item">
                <div>
                  <img src="../core/imgs/home1.jpg" />
                  <div>
                    <h6 className="f-b">مجلد السيارات</h6>
                    <div className="gray-color">
                      <span className="main-color f-b">130</span> منتج مضاف
                    </div>
                  </div>
                </div>
                <button className="btn-main">حفظ</button>
              </li>
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <button type="button" className="btn-main">
            حفظ
          </button>
        </Modal.Footer>
      </Modal>
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

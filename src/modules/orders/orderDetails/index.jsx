import axios from "axios"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import React, { useEffect, useState } from "react"
import t from "../../../translations.json"
import email from "../../../assets/images/email.png"
import sms from "../../../assets/images/sms.png"
import whatsapp from "../../../assets/images/whatsapp.png"
import delivery from "../../../assets/images/delivery-truck.png"
import shopping from "../../../assets/images/shopping.png"
import Image from "next/image"
import ChangeSingleStatusModal from "./ChangeSingleStatusModal"
import ChangeBranchModal from "../ChangeBranchModal"

export const OrderDetails = () => {
  const {
    locale,
    query: { id },
  } = useRouter()
  const router = useRouter()
  const [orderData, setOrderData] = useState()
  const [branchesData, setBranchesData] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [openBranchModal, setOpenBranchModal] = useState(false)
  const [orderStatusHistory, setOrderStatusHistory] = useState()
  const getOrderData = async (id) => {
    const {
      data: { data: orderData },
    } = await axios.get(`${process.env.REACT_APP_API_URL}/GetOrderDetailsByOrderId`, {
      params: {
        orderId: id,
      },
    })
    setOrderData(orderData)
  }
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
    const getListOrderStatusHistory = async () => {
      const {
        data: { data: data },
      } = await axios.post(`${process.env.REACT_APP_API_URL}/ListOrderStatusHistory?orderId=${id}`)
      setOrderStatusHistory(data)
    }
    id && getListOrderStatusHistory()
  }, [locale, openModal, id])

  useEffect(() => {
    router.query.id && getOrderData(router.query.id)
  }, [router.query.id, openModal])
  if (!orderData) return ""
  // Render Order Data
  const {
    clientName,
    clientEmail,
    clientImage,
    shippingAddress,
    shippingFee,
    shippingCount,
    totalOrderPrice,
    status,
    createdAt,
    phoneNumber,
    orderSaleType,
    orderProductFullInfoDto,
    orderStatus,
    branchId,
  } = orderData
  const totalQuantity = orderProductFullInfoDto
    .map((item) => item.quantity)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
  return (
    <div style={{ padding: "24px" }}>
      <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
        <h6 className="f-b m-0">{pathOr("", [locale, "Orders", "order_details"], t)}</h6>
        <a href="#" className="btn-main">
          {pathOr("", [locale, "Orders", "download_invoice"], t)}
        </a>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <div className="d-flex gap-3">
            <div className="form-group flex-grow-1 mb-1">
              <div className="po_R">
                <label>{pathOr("", [locale, "Orders", "order_status"], t)}</label>
                <select className="form-control form-select border-0 rounded" onClick={() => setOpenModal(true)}>
                  <option hidden disabled selected>
                    {pathOr("", [locale, "Orders", "changeOrderStatus"], t)}
                  </option>
                  {/*<option>{pathOr("", [locale, "Orders", "waiting_for_payment"], t)}</option>
                  <option>{pathOr("", [locale, "Orders", "waiting_for_review"], t)}</option>
                  <option>{pathOr("", [locale, "Orders", "in_progress"], t)}</option>
                  <option>{pathOr("", [locale, "Orders", "ready_for_delivery"], t)}</option>
                  <option>{pathOr("", [locale, "Orders", "delivery_in_progress"], t)}</option>
                  <option>{pathOr("", [locale, "Orders", "delivered"], t)}</option>
  <option>{pathOr("", [locale, "Orders", "canceled"], t)}</option>*/}
                </select>
                <ChangeSingleStatusModal
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  selectedOrder={{ orderStatus: orderStatus, orderId: router.query.id }}
                />
              </div>
            </div>
            <div className="form-group flex-grow-1 mb-1">
              <div className="po_R">
                <label>{pathOr("", [locale, "Orders", "select_branch"], t)}</label>
                <select className="form-control form-select border-0 rounded" onClick={() => setOpenBranchModal(true)}>
                  <option hidden disabled selected>
                    {pathOr("", [locale, "Orders", "select_branch"], t)}
                  </option>
                </select>
                <ChangeBranchModal
                  openBranchModal={openBranchModal}
                  setOpenBranchModal={setOpenBranchModal}
                  branchesData={branchesData}
                  ordersId={[+router.query.id]}
                  orderBranch={branchId}
                />
              </div>
            </div>
          </div>
          <div className="contint_paner p-0">
            <ul className="info_box_order d-flex flex-wrap">
              <li>
                <span className="gray-color">{pathOr("", [locale, "Orders", "order_number"], t)}</span>
                <div className="f-b">#{router.query.id}</div>
              </li>
              <li>
                <span className="gray-color">{pathOr("", [locale, "Orders", "order_type"], t)}</span>
                <div className="f-b">{orderSaleType}</div>
              </li>
              <li>
                <span className="gray-color">{pathOr("", [locale, "Orders", "order_time"], t)}</span>
                <div className="f-b">{createdAt.slice(11, 16)}</div>
                <div className="f-b">{createdAt.slice(0, 10)}</div>
              </li>
              <li>
                <span className="gray-color">{pathOr("", [locale, "Orders", "number_of_shipments"], t)}</span>
                <div className="f-b">{shippingCount}</div>
              </li>
              <li>
                <span className="gray-color">{pathOr("", [locale, "Orders", "order_total"], t)}</span>
                <div className="f-b">
                  {totalOrderPrice} {pathOr("", [locale, "Products", "currency"], t)}
                </div>
              </li>
              <li>
                <span className="gray-color">{pathOr("", [locale, "Orders", "order_status"], t)}</span>
                <div className="f-b main-color">{status}</div>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="contint_paner mt-0 p-0">
            <div className="detalis-customer">
              <div className="d-flex gap-2 mb-2 p-3">
                <Image src={clientImage} className="img img_table2" alt="user" width={110} height={50} />
                <div>
                  <div className="mb-2">
                    <h6 className="f-b m-0">{clientName}</h6>
                    <div className="gray-color">{clientEmail}</div>
                  </div>
                  <ul className="d-flex gap-1 contuct">
                    <li>
                      <a href="#">
                        <Image src={email} alt="" width={50} height={50} />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <Image src={sms} alt="" width={50} height={50} />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <Image src={whatsapp} alt="" width={50} height={50} />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <hr className="m-0" />
              <div className="d-flex align-items-end justify-content-between gap-3 p-3">
                <div>
                  <h6 className="f-b">{pathOr("", [locale, "Orders", "client_address"], t)}</h6>
                  <p>{shippingAddress}</p>
                  <p>{phoneNumber}</p>
                </div>
                <button className="btn-main btn-main-o">{pathOr("", [locale, "Orders", "shipping_bill"], t)}</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="contint_paner mt-0 p-0">
            <div className="info_elomola">
              <ul>
                <li>
                  <span>{pathOr("", [locale, "Orders", "subtotal"], t)}</span>{" "}
                  <span className="font-18">
                    {totalOrderPrice} {pathOr("", [locale, "Products", "currency"], t)}
                  </span>
                </li>
                <li>
                  <span>{pathOr("", [locale, "Orders", "delivery_cost"], t)}</span>{" "}
                  <span className="font-18">
                    {shippingFee} {pathOr("", [locale, "Products", "currency"], t)}
                  </span>
                </li>
                <li>
                  <span>{pathOr("", [locale, "Orders", "added_tax"], t)}</span>{" "}
                  <span className="font-18">
                    {totalOrderPrice * (12 / 100)} {pathOr("", [locale, "Products", "currency"], t)}
                  </span>
                </li>
              </ul>
              <aside>
                <span>{pathOr("", [locale, "Orders", "total"], t)}</span>{" "}
                <span className="font-18 f-b">
                  {totalOrderPrice} {pathOr("", [locale, "Products", "currency"], t)}
                </span>
              </aside>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="contint_paner">
            <h5 className="f-b fs-4">{pathOr("", [locale, "Orders", "products"], t)}</h5>
            <div className="all_list_producto mb-3">
              <div className="head">
                <h6 className="m-0 f-b">{pathOr("", [locale, "Orders", "number_of_products"], t)}</h6>{" "}
                <div>{totalQuantity}</div>
              </div>
              <ul>
                {orderProductFullInfoDto.map((item, index) => (
                  <li className="item" key={index}>
                    <div className="d-flex align-items-center gap-1">
                      <Image src={item.iamge} className="img_table" alt="" width={100} height={100} />
                      <div>
                        <div className="gray-color">{item.category}</div>
                        <div className="f-b">{item.productName}</div>
                        <div className="gray-color">
                          {orderSaleType === "FixedPrice" && locale === "ar" ? "اعلان بسعر ثابت" : orderSaleType}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <h5 className="f-b main-color m-0">
                        {totalOrderPrice} {pathOr("", [locale, "Products", "currency"], t)}
                      </h5>
                      <div className="num">{item.quantity}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="all_list_producto p-3">
              <div className="info_shan">
                <span>{pathOr("", [locale, "Orders", "shipping"], t)}</span>{" "}
                <span className="f-b">{pathOr("", [locale, "Orders", "free_shipping_in_saudi"], t)}</span>
              </div>
              <div className="info_shan">
                <span>{pathOr("", [locale, "Orders", "payment_method"], t)}</span>{" "}
                <span className="f-b">{pathOr("", [locale, "Orders", "via_bank"], t)}</span>
              </div>
              <div className="po_R upload_filo my-3">
                <input type="text" className="form-control" readOnly value="تم ارفاق الفاتورة" />
                <div className="btn_file">
                  <input type="file" />
                  {pathOr("", [locale, "Orders", "download_invoice"], t)}
                </div>
              </div>
              <div className="info_shan">
                <span>{pathOr("", [locale, "Orders", "shipping_total"], t)}</span>{" "}
                <span className="f-b main-color">
                  {totalOrderPrice} {pathOr("", [locale, "Products", "currency"], t)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="contint_paner p-0">
            <h5 className="f-b p-4 m-0 fs-4">{pathOr("", [locale, "Orders", "order_log"], t)}</h5>
            <ul className="all-order-record">
              {orderStatusHistory?.map((item) => (
                <li className="item" key={item.statusDate}>
                  <div className="d-flex align-items-center">
                    <Image src={delivery} alt="delivery" />
                    <div className="mx-4">
                      <div className="gray-color">{item.userName}</div>
                      <div className="f-b main-color">
                        {pathOr("", [locale, "Orders", "changeOrderHistory"], t)} {item.status}
                      </div>
                    </div>
                  </div>
                  <div className="gray-color">
                    {item.statusDate.slice(11, 16)} - {item.statusDate.slice(0, 10)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// export async function getServerSideProps({ query: { id = 548 } }) {
//   const {
//     data: { data: orderData },
//   } = await axios.get(`${process.env.REACT_APP_API_URL}/GetOrderDetailsByOrderId`, {
//     ...headersJson,
//     params: {
//       orderId: 548,
//     },
//   })
//   return {
//     props: {
//       orderData: orderData[0],
//     },
//   }
// }

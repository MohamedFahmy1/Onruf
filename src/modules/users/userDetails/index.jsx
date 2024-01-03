import React, { useEffect, useMemo, useState } from "react"
import { Row, Col } from "react-bootstrap"
import Router, { useRouter } from "next/router"
import ordersData from "../../../../OrdersStaticData.json"
import users from "../../../../UsersStaticData.json"
import userImg from "../../../../public/images/user.png"
import emailImg from "../../../../public/images/email.png"
import smsImg from "../../../../public/images/sms.png"
import whatsappImg from "../../../../public/images/whatsapp.png"
import mapImg from "../../../../public/images/1366_2000.png"
import Pagination from "./../../../common/pagination"
import Table from "../../../common/table"
import { formatDate } from "./../../../common/functions"
import { useQuery } from "@tanstack/react-query"
import { FaEnvelope, FaPhone } from "react-icons/fa6"
import axios from "axios"
import moment from "moment"
import SendNotificationModal from "../SendNotificationModal"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import Image from "next/image"
import ResponsiveImage from "../../../common/ResponsiveImage"
const UserDetails = () => {
  const {
    locale,
    query: { id },
  } = useRouter()
  const [user, setUser] = useState()
  const [userOrders, setUserOrders] = useState()
  const [openNotificationModal, setOpenNotificationModal] = useState(false)
  const router = useRouter()

  const getUserDetails = async () => {
    const {
      data: { data: userDetails },
    } = await axios.get(`${process.env.REACT_APP_API_URL}/ClientDetails?clientId=${id}&lang=${locale}`)
    setUser(userDetails)
  }

  const getUserOrders = async () => {
    const data = await axios.get(
      `${process.env.REACT_APP_API_URL}/GetClientAddedOrders?userId=${id}&pageIndex=1&PageRowsCount=10`,
    )
    setUserOrders(data.data.data)
  }

  useEffect(() => {
    id && getUserDetails()
    id && getUserOrders()
  }, [id])

  // const getUserOrders =async(id) => {
  //  return await axios.get(`${process.env.REACT_APP_API_URL}/GetClientAddedOrders?userId=${id}&pageIndex=1&PageRowsCount=10`)
  //   }

  //   const { data } = useQuery(["userOrders"], ()=> getUserOrders(router.query.id))

  const columns = useMemo(
    () => [
      {
        Header: pathOr("", [locale, "Orders", "order_number"], t),
        accessor: "orderInfoDtos.orderNumber",
        Cell: ({ row: { original } }) => <div className="f-b">#{original?.orderMasterId}</div>,
      },
      {
        Header: pathOr("", [locale, "Orders", "client"], t),
        Cell: ({ row: { original } }) => {
          return (
            <div>
              <h6 className="m-0 f-b">{original?.clientName}</h6>
              <h6 className="gray-color">{original?.shippingAddress}</h6>
            </div>
          )
        },
      },
      {
        Header: pathOr("", [locale, "Orders", "orderHistory"], t),
        accessor: "dateOfOrder",
        Cell: ({ row: { original } }) => (
          <div>
            <h6 className="m-0 f-b">{moment(original?.createdAt).format("lll")}</h6>
            {/* <div className="gray-color">مساء 4:50</div> */}
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "shipping"], t),
        accessor: "shipping",
        Cell: ({ row: { original } }) => (
          <div className="f-b">
            {original?.shippingFee === 0
              ? pathOr("", [locale, "Products", "freeDelivery"], t)
              : `${original?.shippingFee} ${pathOr("", [locale, "Products", "currency"], t)}`}
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "payment"], t),
        accessor: "payment",
        Cell: ({ row: { original } }) => <div className="f-b">{original?.paymentType}</div>,
      },
      {
        Header: pathOr("", [locale, "Orders", "order_status"], t),
        accessor: "status",
        Cell: ({ row: { original } }) => <div className="f-b main-color">{original?.status}</div>,
      },
      {
        Header: pathOr("", [locale, "Orders", "total"], t),
        accessor: "totalAfterDiscount",
        Cell: ({ row: { original } }) => (
          <div className="f-b">
            {original?.totalOrderAmountAfterDiscount} {pathOr("", [locale, "Products", "currency"], t)}
          </div>
        ),
      },
    ],
    [user?.name, locale],
  )

  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">{user && user?.name}</h6>
          <a href="#" className="btn-main" onClick={() => setOpenNotificationModal(!openNotificationModal)}>
            {pathOr("", [locale, "Users", "sendNotfi"], t)}
          </a>
        </div>
      </div>
      <Row>
        <Col lg={3} md={5}>
          <div className="contint_paner">
            <div className="detalis-customer">
              <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                {user?.clientImage && (
                  <ResponsiveImage
                    imageSrc={`${process.env.NEXT_PUBLIC_URL}${user?.clientImage}`}
                    alt={"client"}
                    width="50px"
                    height="50px"
                  />
                )}
                <ul className="d-flex gap-1 contuct">
                  <li>
                    <Image width={50} height={50} src={emailImg.src} alt="email" />
                  </li>
                  <li>
                    <Image width={50} height={50} src={smsImg.src} alt="sms" />
                  </li>
                  <li>
                    <Image width={50} height={50} src={whatsappImg.src} alt="whatsapp" />
                  </li>
                </ul>
              </div>
              <h5 className="f-b m-0">{user?.clientName}</h5>
              <div className="gray-color">
                {pathOr("", [locale, "Users", "memberSince"], t)} {formatDate(user?.createdAt)}
              </div>
              <ul className="mb-2 mt-1">
                <li className="mb-1">
                  <FaEnvelope />
                  <span className="gray-color mx-2">{user?.email}</span>
                </li>
                <li className="mb-1">
                  <FaPhone />
                  <span className="gray-color mx-2">{user?.phoneNumber}</span>
                </li>
              </ul>
              <div className="font-18">{pathOr("", [locale, "Users", "totalOrders"], t)}</div>
              <h3 className="f-b main-color m-0">
                {user?.totalOrdersPrice} {pathOr("", [locale, "Products", "currency"], t)}
              </h3>
            </div>
          </div>
        </Col>

        <Col lg={9} md={7} className="col-lg-9 col-md-7">
          <div className="contint_paner">
            <div>
              <div className="mb-2">
                <h6 className="f-b m-0">{pathOr("", [locale, "Orders", "client_address"], t)}</h6>
                <div className="font-18">الرياض</div>
              </div>
              <div className="map">
                <Image src={mapImg.src} width={850} height={180} alt="map" />
              </div>
            </div>
          </div>
        </Col>
      </Row>
      {/* Notification Modal*/}
      <SendNotificationModal
        openNotificationModal={openNotificationModal}
        setOpenNotificationModal={setOpenNotificationModal}
      />
      {userOrders && <Table data={userOrders && userOrders} columns={columns} pageSize={10} />}
      {userOrders?.length > 10 && <Pagination listLength={userOrders.length} pageSize={10} />}
    </div>
  )
}

export default UserDetails

import { useMemo, useState } from "react"
import { Row, Col } from "react-bootstrap"
import { useRouter } from "next/router"
import emailImg from "../../../../public/images/email.png"
import smsImg from "../../../../public/images/sms.png"
import whatsappImg from "../../../../public/images/whatsapp.png"
import mapImg from "../../../../public/images/map.png"
import Pagination from "./../../../common/pagination"
import Table from "../../../common/table"
import { formatDate } from "./../../../common/functions"
import { FaEnvelope, FaPhone } from "react-icons/fa6"
import moment from "moment"
import SendNotificationModal from "../SendNotificationModal"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import Image from "next/image"
import ResponsiveImage from "../../../common/ResponsiveImage"
import { useFetch } from "../../../hooks/useFetch"
import Link from "next/link"

const UserDetails = () => {
  const {
    locale,
    query: { id },
  } = useRouter()
  const [openNotificationModal, setOpenNotificationModal] = useState(false)
  const { data: user } = useFetch(`/ClientDetails?clientId=${id}&lang=${locale}`, true)
  const { data: userOrders } = useFetch(`/GetClientAddedOrders?userId=${id}&pageIndex=1&PageRowsCount=10`, true)

  const columns = useMemo(
    () => [
      {
        Header: pathOr("", [locale, "Orders", "order_number"], t),
        accessor: "orderInfoDtos.orderNumber",
        Cell: ({ row: { original } }) => (
          <Link href={`/orders/${original.orderMasterId}`}>
            <div className="f-b pointer">#{original?.orderMasterId}</div>
          </Link>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "client"], t),
        Cell: ({ row: { original } }) => {
          return (
            <Link href={`/orders/${original.orderMasterId}`}>
              <div className="pointer">
                <h6 className="m-0 f-b">{original?.clientName}</h6>
                <h6 className="gray-color">{original?.shippingAddress}</h6>
              </div>
            </Link>
          )
        },
      },
      {
        Header: pathOr("", [locale, "Orders", "orderHistory"], t),
        accessor: "dateOfOrder",
        Cell: ({ row: { original } }) => (
          <Link href={`/orders/${original.orderMasterId}`}>
            <h6 className="m-0 f-b pointer">{moment(original?.createdAt).format("lll")}</h6>
          </Link>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "shipping"], t),
        accessor: "shipping",
        Cell: ({ row: { original } }) => (
          <Link href={`/orders/${original.orderMasterId}`}>
            <div className="f-b pointer">
              {original?.shippingFee === 0
                ? pathOr("", [locale, "Products", "freeDelivery"], t)
                : `${original?.shippingFee} ${pathOr("", [locale, "Products", "currency"], t)}`}
            </div>
          </Link>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "payment"], t),
        accessor: "payment",
        Cell: ({ row: { original } }) => (
          <Link href={`/orders/${original.orderMasterId}`}>
            <div className="f-b pointer">{original?.paymentType}</div>
          </Link>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "order_status"], t),
        accessor: "status",
        Cell: ({ row: { original } }) => (
          <Link href={`/orders/${original.orderMasterId}`}>
            <div className="f-b main-color pointer">{original?.status}</div>
          </Link>
        ),
      },
      {
        Header: pathOr("", [locale, "Orders", "total"], t),
        accessor: "totalAfterDiscount",
        Cell: ({ row: { original } }) => (
          <Link href={`/orders/${original.orderMasterId}`}>
            <div className="f-b pointer">
              {original?.totalOrderAmountAfterDiscount} {pathOr("", [locale, "Products", "currency"], t)}
            </div>
          </Link>
        ),
      },
    ],
    [locale],
  )

  return (
    <article className="body-content">
      <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
        <p className="f-b fs-5 m-0">{user && user?.clientName}</p>
        <button className="btn-main" onClick={() => setOpenNotificationModal(!openNotificationModal)}>
          {pathOr("", [locale, "Users", "sendNotfi"], t)}
        </button>
      </div>
      <Row>
        <Col lg={3} md={5}>
          <div className="contint_paner">
            <div className="detalis-customer">
              <div className="d-flex align-items-center justify-content-between gap-2">
                {user?.clientImage && (
                  <ResponsiveImage
                    imageSrc={`${process.env.NEXT_PUBLIC_URL}/${user?.clientImage}`}
                    alt={"client"}
                    width="100px"
                    height="100px"
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
              <p className="f-b fs-5 m-0">{user?.clientName}</p>
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
              <p className="f-b fs-3 main-color m-0">
                {user?.totalOrdersPrice} {pathOr("", [locale, "Products", "currency"], t)}
              </p>
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
                <Image src={mapImg} width={900} height={190} alt="map" />
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
      {userOrders?.length > 0 && <Table data={userOrders} isCheckbox={true} columns={columns} pageSize={10} />}
      {userOrders?.length > 10 && <Pagination listLength={userOrders.length} pageSize={10} />}
    </article>
  )
}

export default UserDetails

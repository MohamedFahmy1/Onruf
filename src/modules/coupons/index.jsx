import { useCallback, useMemo, useState } from "react"
import { FiPlusCircle } from "react-icons/fi"
import { BiChart } from "react-icons/bi"
import { useRouter } from "next/router"
import { propOr, pathOr } from "ramda"
import axios from "axios"
import Table from "../../common/table"
import Pagination from "../../common/pagination"
import styles from "./coupons.module.css"
import { toast } from "react-toastify"
import { RiDeleteBin5Line } from "react-icons/ri"
import t from "../../translations.json"
import Alerto from "../../common/Alerto"
import Link from "next/link"
import moment from "moment"
import { useFetch } from "../../hooks/useFetch"
import { LoadingScreen } from "../../common/Loading"

const Coupons = () => {
  const { locale, push } = useRouter()
  const [selectedFilter, setSelectedFilter] = useState("all")
  const {
    data: coupons,
    fetchData: getCopounsList,
    isLoading,
  } = useFetch(`/ListBusinessAccountCoupons?pageIndex=1&PageRowsCount=50`)

  const couponsCount = coupons && coupons?.length
  const allCoupons = coupons && coupons
  const activeCoupons = coupons && coupons.filter(({ expiryDate }) => moment(expiryDate).isSameOrAfter(moment(), "day"))
  const expiredCoupons = coupons && coupons.filter(({ expiryDate }) => moment(expiryDate).isBefore(moment(), "day"))
  const filterCoupons =
    selectedFilter === "all" ? allCoupons : selectedFilter === "active" ? activeCoupons : expiredCoupons

  const editCoupon = useCallback(
    async (couponId) => {
      try {
        const formData = new FormData()
        formData.append("id", couponId)
        await axios.patch(`/ChangeCouponStatus?couponId=${couponId}`, null)
        toast.success(locale === "en" ? "Coupon has been updated successfully!" : "تم تعديل الكوبون بنجاح")
        getCopounsList()
      } catch (err) {
        Alerto(err)
      }
    },
    [locale],
  )

  const handleDeleteCode = useCallback(
    async (id) => {
      try {
        const isDelete = confirm(
          locale === "en" ? "Are you sure you want to delete this Coupon ?" : "هل ترغب في مسح الكوبون ؟",
        )
        if (!isDelete) return
        await axios.post(`/DeleteCoupon?couponId=${id}`, null)
        toast.success(locale === "en" ? "Coupon has been deleted successfully!" : "تم حذف الكوبون بنجاح")
        getCopounsList()
      } catch (error) {
        Alerto(error)
      }
    },
    [locale],
  )

  const columns = useMemo(
    () => [
      {
        Header: pathOr("", [locale, "Coupons", "couponName"], t),
        accessor: "coponId",
        Cell: ({ row: { original } }) => (
          <div className="d-flex align-items-center">
            <h6 className="m-0 f-b"> {propOr("-", ["title"], original)} </h6>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Coupons", "couponCode"], t),
        accessor: "couponCode",
        Cell: ({ row: { original } }) => (
          <div className="d-flex align-items-center">
            <h6 className="m-0 f-b"> {propOr("-", ["couponCode"], original)} </h6>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Coupons", "discount"], t),
        accessor: "discountValue",
        Cell: ({ row: { original } }) => (
          <div className="d-flex align-items-center">
            <h6 className="m-0 f-b"> {propOr("-", ["discountValue"], original)} </h6>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Coupons", "createdAt"], t),
        accessor: "createdAt",
        Cell: ({ row: { original } }) => (
          <div className="d-flex align-items-center">
            <h6 className="m-0 f-b">{moment(original.createdAt).format("DD-MM-YYYY")} </h6>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Coupons", "expiryDate"], t),
        accessor: "expiryDate",
        Cell: ({ row: { original } }) => (
          <div className="d-flex align-items-center">
            <h6 className="m-0 f-b"> {moment(original.expiryDate).format("DD-MM-YYYY")} </h6>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Coupons", "actions"], t),
        accessor: "isActive",
        Cell: ({
          row: {
            values: { isActive },
            original: { id },
          },
        }) => {
          return (
            <div className="d-flex align-items-center gap-2">
              <button className={`btn-main ${styles["btn-main"]}`}>
                {pathOr("", [locale, "Coupons", "statistics"], t)}
                <BiChart className="me-2" size={"1.3rem"} />
              </button>
              <div className="form-control outer-check-input w-auto">
                <div className="form-check form-switch p-0 m-0 d-flex">
                  <label htmlFor={"flexSwitchCheckChecked" + id} className="mx-2">
                    {pathOr("", [locale, "Coupons", "active"], t)}
                  </label>
                  <input
                    className="form-check-input m-0"
                    onChange={() => editCoupon(id)}
                    defaultChecked={isActive}
                    type="checkbox"
                    role="switch"
                    id={"flexSwitchCheckChecked" + id}
                  />
                </div>
              </div>
              <RiDeleteBin5Line className="btn_Measures pointer" onClick={() => handleDeleteCode(id)} />
            </div>
          )
        },
      },
    ],
    [handleDeleteCode, editCoupon, locale],
  )

  if (isLoading) return <LoadingScreen />

  return (
    <div className="body-content">
      <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
        <div className="d-flex align-items-center">
          <h6 className="f-b m-0">
            {pathOr("", [locale, "Coupons", "discountCoupons"], t)} ({couponsCount})
          </h6>
        </div>
        <Link href={"/coupons/add"}>
          <a aria-label={pathOr("", [locale, "Coupons", "addCoupon"], t)} className="btn-main">
            {pathOr("", [locale, "Coupons", "addCoupon"], t)} <FiPlusCircle />
          </a>
        </Link>
      </div>
      <div className="filtter_1">
        <button
          className={`btn-main ${selectedFilter === "all" ? "active" : ""}`}
          onClick={() => {
            setSelectedFilter("all")
            push({ query: { page: 1 } })
          }}
        >
          {pathOr("", [locale, "Coupons", "all"], t)}
        </button>
        <button
          className={`btn-main ${selectedFilter === "active" ? "active" : ""}`}
          onClick={() => {
            setSelectedFilter("active")
            push({ query: { page: 1 } })
          }}
        >
          {pathOr("", [locale, "Coupons", "active"], t)}
        </button>
        <button
          className={`btn-main ${selectedFilter === "expired" ? "active" : ""}`}
          onClick={() => {
            setSelectedFilter("expired")
            push({ query: { page: 1 } })
          }}
        >
          {pathOr("", [locale, "Coupons", "expired"], t)}
        </button>
      </div>
      <div className="contint_paner">
        <div className="outer_table">
          {filterCoupons && <Table columns={columns} data={filterCoupons} isCheckbox={false} pageSize={10} />}
        </div>
        {filterCoupons?.length > 10 && <Pagination listLength={filterCoupons?.length} pageSize={10} />}
      </div>
    </div>
  )
}
export default Coupons

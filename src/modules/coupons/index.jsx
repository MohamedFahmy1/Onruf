/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from "react"
import { FiPlusCircle } from "react-icons/fi"
import { BiChart } from "react-icons/bi"
import { useRouter } from "next/router"
import { propOr } from "ramda"
import axios from "axios"
import Table from "../../common/table"
import Pagination from "../../common/pagination"
import styles from "./coupons.module.css"
import { toast } from "react-toastify"
import { RiDeleteBin5Line } from "react-icons/ri"
import { headersJson } from "../../../token"
import t from "../../translations.json"
import { pathOr } from "ramda"

const Coupons = () => {
  const router = useRouter()
  const { locale } = useRouter()
  const [coupons, setCoupons] = useState()
  const [selectedFilter, setSelectedFilter] = useState("all")
  const couponsCount = coupons && coupons?.length
  const allCoupons = coupons && coupons
  const activeCoupons = coupons && coupons?.filter(({ isActive }) => isActive)
  const expiredCoupons = coupons && coupons?.filter(({ expiryDate }) => new Date(expiryDate) < new Date())
  const filterCoupons =
    selectedFilter === "all" ? allCoupons : selectedFilter === "active" ? activeCoupons : expiredCoupons

  const editCoupon = async (couponId) => {
    try {
      const formData = new FormData()
      formData.append("id", couponId)
      const data = await axios.patch(`${process.env.REACT_APP_API_URL}/ChangeCouponStatus?couponId=${couponId}`, null)
      toast.success(locale === "en" ? "Coupon has been updated successfully!" : "تم تعديل الكوبون بنجاح")
    } catch (err) {
      toast.error(e.response.data.message)
      console.error(err)
    }
  }

  // const editCoupon = async (couponId) => {
  //   try {
  //     const formData = new FormData()
  //     formData.append("id", couponId)
  //     const data = await axios.patch(`${process.env.REACT_APP_API_URL}/ChangeCouponStatus?couponId=${couponId}`, null)
  //     toast.success(locale === "en" ? "Coupon has been updated successfully!" : "تم تعديل الكوبون بنجاح")
  //   } catch (err) {
  //     toast.error(e.response.data.message)
  //     console.error(err)
  //   }
  // }
  const handleDeleteCode = async (id) => {
    try {
      const isDelete = confirm(
        locale === "en" ? "Are you sure you want to delete this Coupon ?" : "هل ترغب في مسح الكوبون ؟",
      )
      if (!isDelete) return
      await axios.post(process.env.REACT_APP_API_URL + `/DeleteCoupon?couponId=${id}`, null)
      toast.success(locale === "en" ? "Coupon has been deleted successfully!" : "تم حذف الكوبون بنجاح")
      getCopounsList()
    } catch (error) {
      console.error(error)
      toast.error(error.response.data.message)
    }
  }

  // const handleDeleteCode = async (id) => {
  //   try {
  //     const isDelete = confirm(
  //       locale === "en" ? "Are you sure you want to delete this Coupon ?" : "هل ترغب في مسح الكوبون ؟",
  //     )
  //     if (!isDelete) return
  //     await axios.post(process.env.REACT_APP_API_URL + `/DeleteCoupon?couponId=${id}`, null)
  //     toast.success(locale === "en" ? "Coupon has been deleted successfully!" : "تم حذف الكوبون بنجاح")
  //     getCopounsList()
  //   } catch (error) {
  //     console.error(error)
  //     toast.error(error.response.data.message)
  //   }
  // }
  const getCopounsList = async () => {
    const data = await axios.get(
      `${process.env.REACT_APP_API_URL}/ListBusinessAccountCoupons?pageIndex=1&PageRowsCount=10`,
    )
    setCoupons(data.data.data)
  }

  useEffect(() => {
    getCopounsList()
    return () => {
      setCoupons()
    }
  }, [])

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
            <h6 className="m-0 f-b"> {original.createdAt.slice(0, 10)} </h6>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Coupons", "expiryDate"], t),
        accessor: "expiryDate",
        Cell: ({ row: { original } }) => (
          <div className="d-flex align-items-center">
            <h6 className="m-0 f-b"> {propOr("-", ["expiryDate"], original)} </h6>
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
                  <span className="mx-2">{pathOr("", [locale, "Coupons", "active"], t)}</span>
                  <input
                    className="form-check-input m-0"
                    onChange={() => editCoupon(id)}
                    defaultChecked={isActive}
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckChecked"
                  />
                </div>
              </div>
              <RiDeleteBin5Line className="btn_Measures" onClick={() => handleDeleteCode(id)} />
            </div>
          )
        },
      },
    ],
    [handleDeleteCode, editCoupon],
  )
  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <div className="d-flex align-items-center">
            <h6 className="f-b m-0">
              {pathOr("", [locale, "Coupons", "discountCoupons"], t)} ({couponsCount})
            </h6>
          </div>
          <button className="btn-main" onClick={() => router.push("/coupons/add")}>
            {pathOr("", [locale, "Coupons", "addCoupon"], t)} <FiPlusCircle />
          </button>
        </div>
        <div className="filtter_1">
          <button
            className={`btn-main ${selectedFilter === "all" ? "active" : ""}`}
            onClick={() => {
              setSelectedFilter("all")
              router.push({ query: { page: 1 } })
            }}
          >
            {pathOr("", [locale, "Coupons", "all"], t)}
          </button>
          <button
            className={`btn-main ${selectedFilter === "active" ? "active" : ""}`}
            onClick={() => {
              setSelectedFilter("active")
              router.push({ query: { page: 1 } })
            }}
          >
            {pathOr("", [locale, "Coupons", "active"], t)}
          </button>
          <button
            className={`btn-main ${selectedFilter === "expired" ? "active" : ""}`}
            onClick={() => {
              setSelectedFilter("expired")
              router.push({ query: { page: 1 } })
            }}
          >
            {pathOr("", [locale, "Coupons", "expired"], t)}
          </button>
        </div>
        <div className="contint_paner">
          <div className="outer_table">
            {coupons && <Table columns={columns} data={filterCoupons} isCheckbox={false} pageSize={10} />}
          </div>
          {filterCoupons?.length > 10 && <Pagination listLength={filterCoupons?.length} pageSize={10} />}
        </div>
      </div>
    </div>
  )
}
export default Coupons

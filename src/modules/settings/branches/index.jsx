import React, { useMemo, useState, useEffect } from "react"
import Pagination from "./../../../common/pagination"
import Table from "./../../../common/table"
import { RiDeleteBin5Line } from "react-icons/ri"
import { BiEditAlt } from "react-icons/bi"
import { AiOutlinePlusCircle } from "react-icons/ai"
import Link from "next/link"
import { toast } from "react-toastify"
import axios from "axios"
import Router, { useRouter } from "next/router"
import { Modal } from "react-bootstrap"
import { pathOr } from "ramda"
import t from "../../../translations.json"

const Branches = ({ branches: b = [] }) => {
  const [allbranches, setAllBranches] = useState(b)
  const [branches, setBranches] = useState(b.filter((branch) => branch?.isActive))
  const [toggleActiveBtn, setToggleActiveBtn] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const { locale } = useRouter()

  const fetchBranches = async () => {
    try {
      const {
        data: { data },
      } = await axios(`${process.env.REACT_APP_API_URL}/GetListBranche?lang=${locale}`)
      console.log(data)
      setAllBranches(data)
      setBranches(data.filter((branch) => branch?.isActive))
    } catch (error) {
      console.error({ error }, "getBranches query")
    }
  }

  useEffect(() => {
    fetchBranches()
  }, [])

  const handleEditBranch = async (id, isActive, values) => {
    try {
      const value = {
        ...values,
        id: id,
        isActive: isActive,
        nameAr: values?.name,
        nameEn: values?.name,
        location: values?.streetName,
        regionCode: values?.regionCode,
        lng: "Test",
        lat: "Test",
        streetName: "street Name",
      }
      const formData = new FormData()
      for (const key in value) {
        formData.append(key, value[key])
      }
      if (id) {
        await axios.put(process.env.REACT_APP_API_URL + "/EditBranche", formData)
        toast.success(locale === "en" ? "Branch has been edited successfully!" : "تم تعديل الفرع بنجاح")
        const {
          data: { data },
        } = await axios(`${process.env.REACT_APP_API_URL}/GetListBranche?lang=${locale}`)
        setBranches(data.filter((branch) => branch?.isActive !== isActive))
        setAllBranches(data)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response.data.message)
    }
  }

  const handleDeleteBranch = async (id) => {
    const isDelete = confirm(
      locale === "en" ? "Are you sure you want to delete this branch ?" : "هل ترغب في مسح الفرع ؟",
    )
    if (!isDelete) return
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/RemoveBranche?id=${id}`)
      toast.success("Branch has been deleted successfully!")
      setBranches((prev) => prev.filter((branch) => branch?.id !== id))
    } catch (error) {
      console.error({ error })
      toast.error(error.response.data.message)
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: pathOr("", [locale, "Branch", "branchName"], t),
        accessor: "name",
        Cell: ({ row: { original } }) => <div className="f-b">{original?.name}</div>,
      },
      {
        Header: pathOr("", [locale, "Branch", "country"], t),
        accessor: "countryName",
        Cell: ({ row: { original } }) => (
          <div>
            <div className="f-b">{original?.country?.name}</div>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Branch", "neighbourhood"], t),
        accessor: "neighbourhoodName",
        Cell: ({ row: { original } }) => (
          <div>
            <div className="f-b">{original?.neighborhood?.name}</div>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Branch", "regionCode"], t),
        accessor: "regionCode",
        Cell: ({ row: { original } }) => <div className="f-b">{original?.regionCode}</div>,
      },
      {
        Header: pathOr("", [locale, "Branch", "actions"], t),
        accessor: "isActive",
        Cell: ({ row: { original } }) => {
          return (
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn_Measures"
                onClick={() => Router.push(`/settings/branches/add?id=${original?.id}`)}
              >
                <BiEditAlt />
              </button>
              <button type="button" className="btn_Measures" onClick={() => handleDeleteBranch(original?.id)}>
                <RiDeleteBin5Line />
              </button>
              <div className="form-check form-switch p-0 m-0">
                <input
                  className="form-check-input m-0"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                  defaultChecked={original?.isActive}
                  onChange={(e) => handleEditBranch(original?.id, e.target.checked, original)}
                />
              </div>
            </div>
          )
        },
      },
    ],
    [locale],
  )

  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">
            {pathOr("", [locale, "Branch", "branches"], t)} ({branches?.length})
          </h6>
          <Link href="branches/add">
            <a className="btn-main">
              {pathOr("", [locale, "Branch", "addBranch"], t)}
              <AiOutlinePlusCircle />
            </a>
          </Link>
        </div>
        <div className="filtter_1">
          <button
            className={`btn-main ${toggleActiveBtn ? "active" : ""}`}
            onClick={() => {
              setBranches(allbranches.filter((branch) => branch?.isActive))
              setToggleActiveBtn(true)
            }}
          >
            {pathOr("", [locale, "Branch", "activeBranches"], t)}{" "}
          </button>
          <button
            className={`btn-main ${!toggleActiveBtn ? "active" : ""}`}
            onClick={() => {
              setBranches(allbranches.filter((branch) => !branch?.isActive))
              setToggleActiveBtn(false)
            }}
          >
            {pathOr("", [locale, "Branch", "inActiveBranches"], t)}{" "}
          </button>
        </div>

        <div className="contint_paner">
          <Table columns={columns} data={branches} pageSize={10} isCheckbox={false} />
          {branches?.length > 10 && <Pagination listLength={branches.length} pageSize={10} />}
        </div>

        <Modal show={openModal} onHide={() => setOpenModal(false)}>
          <Modal.Header>
            <h5 className="modal-title m-0 f-b" id="staticBackdropLabel">
              {locale === "en" ? "Are you sure you want to delete this branch ?" : "هل تريد حذف الفرع ؟"}
            </h5>
            <button type="button" className="btn-close" onClick={() => setOpenModal(false)}></button>
          </Modal.Header>

          <Modal.Body className="modal-footer">
            <button
              className="btn-main w-auto"
              onClick={() => {
                setOpenModal(false)
              }}
            >
              {pathOr("", [locale, "Branch", "yes"], t)}
            </button>

            <button
              className="btn-main w-auto"
              onClick={() => {
                setOpenModal(false)
              }}
            >
              {pathOr("", [locale, "Branch", "no"], t)}
            </button>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  )
}

export default Branches

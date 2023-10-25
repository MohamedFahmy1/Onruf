import React, { useMemo, useState, useEffect, Fragment } from "react"
import Pagination from "../../common/pagination"
import Table from "../../common/table"
import { formatDate } from "../../common/functions"
import { AiFillFolderOpen } from "react-icons/ai"
import { RiFolder5Fill } from "react-icons/ri"
import Router, { useRouter } from "next/router"
import Modal from "react-bootstrap/Modal"
import axios from "axios"
import Link from "next/link"
import { toast } from "react-toastify"
import t from "../../translations.json"
import { pathOr } from "ramda"
import styles from "../orders/orders.module.css"
import { useRef } from "react"
import SendNotificationModal from "./SendNotificationModal"

const Users = () => {
  const [folders, setFolders] = useState()
  const [isNewFolder, setIsNewFolder] = useState()
  const [users, setUsers] = useState()
  const [regions, setRegions] = useState()
  const [openFolderModal, setOpenFolderModal] = useState(false)
  const [openNotificationModal, setOpenNotificationModal] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [folderImage, setFolderImage] = useState("")
  const [selectedRows, setSelectedRows] = useState({})
  const { locale } = useRouter()
  const [filter, setFilter] = useState({ fitlerByOrder: 0, filterByNeighborhood: 0 })
  const selectOrderValue = useRef(null)
  const selectCityValue = useRef(null)
  const rows = Object.keys(selectedRows)
  const selectedUsersIds = rows.map((row) => {
    const selectedRow = users?.filter((_, index) => index === +row)
    return selectedRow[0].id
  })

  const fetchUsers = async () => {
    const {
      data: { data: getUsers },
    } = await axios(`${process.env.REACT_APP_API_URL}/ListClientsForProvider?lang=${locale}`, {
      params: {
        filterOrder: filter.fitlerByOrder,
        filterCity: filter.filterByNeighborhood === 0 ? null : filter.filterByNeighborhood,
      },
    })
    console.log(getUsers)
    setUsers(getUsers)
  }
  const fetchRegions = async () => {
    const {
      data: { data: data },
    } = await axios(`${process.env.REACT_APP_API_URL}/ListNeighborhoodByRegionIdDDL`)
    console.log(data)
    setRegions(data)
  }

  const fetchFolders = async () => {
    try {
      const {
        data: { data },
      } = await axios(`${process.env.REACT_APP_API_URL}/ListFolder?type=2&pageIndex=1&PageRowsCount=10&lang=${locale}`)
      setFolders(data)
    } catch (error) {
      console.error("error", error)
    }
  }

  useEffect(() => {
    fetchRegions()
    fetchUsers()
    fetchFolders()
  }, [isNewFolder, filter])

  const addNewFolder = async () => {
    const formData = new FormData()
    formData.append("type", 2)
    formData.append("nameAr", folderName)
    formData.append("nameEn", folderName)
    formData.append("image", folderImage)
    try {
      await axios.post(process.env.REACT_APP_API_URL + "/AddFolder", formData)
      toast.success(locale === "en" ? "A folder has been added successfully!" : "تم اضافة الملف الجديد بنجاح")
      setOpenFolderModal(false)
      const {
        data: { data },
      } = await axios(`${process.env.REACT_APP_API_URL}/ListFolder?type=2&maxRows=10&currentPage=1&lang=${locale}`)
      setFolders(data)
      setIsNewFolder(false)
    } catch (error) {
      console.error(error)
      toast.error(error.response.data.message)
    }
  }

  const handleAddNewFolderModal = () => {
    setOpenFolderModal(false)
    setIsNewFolder(true)
    setOpenFolderModal(true)
  }

  useEffect(() => {
    folders?.fileList?.length > 0 && setIsNewFolder(false)
  }, [])

  const addUserToFolder = async (id) => {
    let msg = ""
    try {
      if (!id) return

      const { message } = await axios.post(process.env.REACT_APP_API_URL + "/AddFolderUser", {
        folderId: id,
        userId: selectedUsersIds,
      })
      msg = message
      toast.success(locale === "en" ? "Request has been made successfully!" : "تمت الاضافة الجديد بنجاح")
      setOpenFolderModal(false)
      setSelectedRows({})
    } catch (error) {
      console.error(error)
      toast.error(error.response.data.message)
    }
  }
  const filterUsers = () => {
    if (+selectOrderValue.current.value == 0 && +selectCityValue.current.value == 0) {
      return toast.error(locale === "en" ? "Please enter at least one filter!" : "!رجاء ادخل فلتر واحد علي الاقل")
    }
    setFilter({ fitlerByOrder: +selectOrderValue.current.value, filterByNeighborhood: +selectCityValue.current.value })
  }
  const deleteOrdersFilter = () => {
    setFilter((prev) => ({ ...prev, fitlerByOrder: 0 }))
    if (selectOrderValue.current) {
      selectOrderValue.current.selectedIndex = 0
    }
  }
  const deleteCityFilter = () => {
    setFilter((prev) => ({ ...prev, filterByNeighborhood: 0 }))
    if (selectCityValue.current) {
      selectCityValue.current.selectedIndex = 0
    }
  }
  const deleteAllFilters = () => {
    setFilter({ fitlerByOrder: 0, filterByNeighborhood: 0 })
    if (selectOrderValue.current || selectCityValue.current) {
      selectOrderValue.current.selectedIndex = 0
      selectCityValue.current.selectedIndex = 0
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: pathOr("", [locale, "Users", "username"], t),
        accessor: "userName",
        Cell: ({
          row: {
            original: { image, userName, id },
          },
        }) => (
          <a onClick={() => Router.push(`/users/${id}`)} className="d-flex align-items-center">
            <img src={image} className="img_table img_table2 cursor-pointer" />
            <div className="f-b">{userName}</div>
          </a>
        ),
      },
      {
        Header: pathOr("", [locale, "Users", "phone"], t),
        accessor: "phone",
        Cell: ({
          row: {
            original: { phone },
          },
        }) => <div className="f-b">{phone}</div>,
      },
      {
        Header: pathOr("", [locale, "Users", "email"], t),
        accessor: "email",
        Cell: ({
          row: {
            original: { email },
          },
        }) => <div className="f-b">{email}</div>,
      },
      {
        Header: pathOr("", [locale, "Users", "memberSince"], t),
        accessor: "memberSince",
        Cell: ({
          row: {
            original: { createdAt },
          },
        }) => <div className="f-b">{createdAt.slice(0, 10).replaceAll("-", "/")}</div>,
      },
    ],
    [locale],
  )

  return (
    <Fragment>
      <div className="body-content">
        <div>
          <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
            <div className="d-flex align-items-center">
              <h6 className="f-b m-0">
                {pathOr("", [locale, "Users", "users"], t)} ({users?.length})
              </h6>
              <Link href="/users/folders">
                <a className="btn-main btn-main-w mr-20">
                  {pathOr("", [locale, "Users", "browse"], t)} <AiFillFolderOpen />
                </a>
              </Link>
            </div>
            <div className="filtter_2">
              <select
                className="form-control form-select"
                style={{ width: "180px" }}
                ref={selectCityValue}
                defaultValue={filter.filterByNeighborhood || 0}
              >
                <option hidden disabled selected value={0}>
                  {pathOr("", [locale, "Users", "byCity"], t)}
                </option>
                {regions?.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <select
                className="form-control form-select"
                style={{ width: "140px" }}
                ref={selectOrderValue}
                defaultValue={filter.fitlerByOrder || 0}
              >
                <option hidden disabled selected value={0}>
                  {pathOr("", [locale, "Users", "byOrder"], t)}
                </option>
                <option value={1}>{pathOr("", [locale, "Users", "mostOrders"], t)}</option>
                <option value={2}>{pathOr("", [locale, "Users", "leastOrders"], t)}</option>
              </select>
              <button className="btn-main rounded-0" onClick={filterUsers}>
                {pathOr("", [locale, "Users", "filter"], t)}
              </button>
            </div>
          </div>
          {(filter.fitlerByOrder != 0 || filter.filterByNeighborhood != 0) && (
            <div className={locale === "en" ? `m-3 text-left ${styles.filter}` : `m-3 text-right ${styles.filter}`}>
              <p className="fs-5">
                {pathOr("", [locale, "Orders", "filter"], t)}{" "}
                <a href="#" className="text-decoration-underline f-b main-color" onClick={deleteAllFilters}>
                  {pathOr("", [locale, "Orders", "deleteAllFilters"], t)}
                </a>
              </p>
              <div>
                {filter && (
                  <div className="border-0 m-0 p-0">
                    {filter.fitlerByOrder != 0 && (
                      <div>
                        {filter.fitlerByOrder == 1
                          ? pathOr("", [locale, "Users", "mostOrders"], t)
                          : pathOr("", [locale, "Users", "leastOrders"], t)}
                        <button type="button" onClick={deleteOrdersFilter}>
                          X
                        </button>
                      </div>
                    )}
                    {filter.filterByNeighborhood != 0 && (
                      <div>
                        {regions?.map((item) => {
                          if (item.id == filter.filterByNeighborhood) {
                            return `${item.name}`
                          }
                        })}
                        <button type="button" onClick={deleteCityFilter}>
                          X
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="contint_paner">
            {users && (
              <Table
                columns={columns}
                data={users && users}
                pageSize={10}
                selectedRows={selectedRows}
                onSelectedRowsChange={setSelectedRows}
              />
            )}
            {users?.length > 10 && <Pagination listLength={users.length} pageSize={10} />}
          </div>
        </div>
      </div>
      {/* Notification Modal */}
      <SendNotificationModal
        openNotificationModal={openNotificationModal}
        setOpenNotificationModal={setOpenNotificationModal}
      />
      {/* Folder Modal */}
      <Modal show={openFolderModal} onHide={() => setOpenFolderModal(false)}>
        <Modal.Header>
          <h5 className="modal-title m-0 f-b" id="staticBackdropLabel">
            {isNewFolder
              ? pathOr("", [locale, "Users", "addNewFolder"], t)
              : pathOr("", [locale, "Users", "add_folder"], t)}
          </h5>
          <button type="button" className="btn-close" onClick={() => setOpenFolderModal(false)}></button>
        </Modal.Header>
        <Modal.Body>
          {isNewFolder ? (
            <div className="form-group">
              <label>{pathOr("", [locale, "Users", "folderName"], t)}</label>
              <input
                type="text"
                className="form-control"
                placeholder={pathOr("", [locale, "Users", "writeFolderName"], t)}
                onChange={(e) => setFolderName(e.target.value)}
              />
              <label className="fs-5 f-b">{pathOr("", [locale, "Users", "addPic"], t)}</label>
              <input type="file" className="form-control" onChange={(e) => setFolderImage(e.target.files[0])} />
              <button type="button" className="btn-main mt-4" onClick={addNewFolder}>
                {pathOr("", [locale, "Users", "save"], t)}
              </button>
            </div>
          ) : (
            <ul className="list_folder">
              {!isNewFolder &&
                folders?.fileList
                  // ?.filter(({ isActive }) => isActive)
                  .map(({ id, image, name, fileUser }) => (
                    <li className="item" key={id}>
                      <div>
                        <img src={image} />
                        <div>
                          <h6 className="f-b">{name}</h6>
                          <div className="gray-color">
                            <span className="main-color f-b">{fileUser?.length}</span>{" "}
                            {pathOr("", [locale, "Users", "clientsAdded"], t)}
                          </div>
                        </div>
                      </div>
                      <button className="btn-main" onClick={() => addUserToFolder(id)}>
                        {pathOr("", [locale, "Users", "save"], t)}
                      </button>
                    </li>
                  ))}
            </ul>
          )}
        </Modal.Body>
        {!isNewFolder && (
          <Modal.Footer className="modal-footer">
            <button type="button" className="btn-main" onClick={handleAddNewFolderModal}>
              {pathOr("", [locale, "Users", "addNewFolder"], t)}
            </button>
          </Modal.Footer>
        )}
      </Modal>

      <div className="btns_fixeds">
        <button className="btn-main rounded-0" onClick={() => setOpenNotificationModal(!openNotificationModal)}>
          {pathOr("", [locale, "Users", "sendNotfi"], t)}
          {/* <IoNotificationsSharp /> */}
        </button>
        <button
          onClick={() => {
            if (rows.length > 0) {
              setOpenFolderModal(!openFolderModal)
            } else toast.error(locale === "en" ? "Choose at least one client from grid!" : "!اختر عميل واحد علي الاقل")
          }}
          className="btn-main btn-main-w rounded-0"
        >
          {pathOr("", [locale, "Users", "addUser"], t)} <RiFolder5Fill />
        </button>
      </div>
    </Fragment>
  )
}

export default Users

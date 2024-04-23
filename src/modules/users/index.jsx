import { useMemo, useState, useEffect } from "react"
import Pagination from "../../common/pagination"
import Table from "../../common/table"
import { formatDate } from "../../common/functions"
import { AiFillFolderOpen } from "react-icons/ai"
import { RiFolder5Fill, RiNotification2Fill } from "react-icons/ri"
import { useRouter } from "next/router"
import Modal from "react-bootstrap/Modal"
import axios from "axios"
import Link from "next/link"
import { toast } from "react-toastify"
import t from "../../translations.json"
import { pathOr } from "ramda"
import styles from "../orders/orders.module.css"
import { useRef } from "react"
import SendNotificationModal from "./SendNotificationModal"
import { useFetch } from "../../hooks/useFetch"
import Alerto from "../../common/Alerto"
import ResponsiveImage from "../../common/ResponsiveImage"
import { IoIosCloseCircle } from "react-icons/io"
import { FaCamera } from "react-icons/fa"
import Image from "next/image"

const Users = () => {
  const { locale } = useRouter()
  const [isNewFolder, setIsNewFolder] = useState()
  const [openFolderModal, setOpenFolderModal] = useState(false)
  const [openNotificationModal, setOpenNotificationModal] = useState(false)
  const [folder, setFolder] = useState({ folderName: "", folderImage: "" })
  const [selectedRows, setSelectedRows] = useState({})
  const [filter, setFilter] = useState({ fitlerByOrder: 0, filterByNeighborhood: 0 })
  const selectOrderValue = useRef(null)
  const selectCityValue = useRef(null)
  const { data: users } = useFetch(
    `/ListClientsForProvider?lang=${locale}&filterOrder=${filter.fitlerByOrder}${
      filter.filterByNeighborhood === 0 ? "" : `&filterCity=${filter.filterByNeighborhood}`
    }`,
  )
  const { data: regions } = useFetch(`/ListNeighborhoodByRegionIdDDL`)
  const { data: folders, fetchData: fetchFolders } = useFetch(
    `/ListFolder?type=2&pageIndex=1&PageRowsCount=100&lang=${locale}`,
  )

  const { rows, selectedUsersIds } = useMemo(() => {
    const computedRows = Object.keys(selectedRows)
    const computedSelectedUserIds = computedRows.map((row) => {
      const selectedRow = users?.filter((_, index) => index === +row)
      return selectedRow[0].id
    })
    return { rows: computedRows, selectedUsersIds: computedSelectedUserIds }
  }, [selectedRows, users])

  const addNewFolder = async () => {
    if (!folder.folderName) return toast.error(locale === "en" ? "Please enter folder name!" : "من فضلك ادخل اسم الملف")
    const formData = new FormData()
    formData.append("type", 2)
    formData.append("nameAr", folder.folderName)
    formData.append("nameEn", folder.folderName)
    formData.append("image", folder.folderImage)
    try {
      await axios.post("/AddFolder", formData)
      toast.success(locale === "en" ? "A folder has been added successfully!" : "تم اضافة الملف الجديد بنجاح")
      setOpenFolderModal(false)
      fetchFolders()
      setIsNewFolder(false)
    } catch (error) {
      Alerto(error)
    }
  }

  const handleAddNewFolderModal = () => {
    setOpenFolderModal(false)
    setIsNewFolder(true)
    setOpenFolderModal(true)
  }

  useEffect(() => {
    folders?.fileList?.length > 0 && setIsNewFolder(false)
  }, [folders])

  const addUserToFolder = async (id) => {
    let msg = ""
    try {
      if (!id) return
      const { message } = await axios.post("/AddFolderUser", {
        folderId: id,
        userId: selectedUsersIds,
      })
      msg = message
      toast.success(locale === "en" ? "Request has been made successfully!" : "تمت اضافة العميل بنجاح")
      setOpenFolderModal(false)
      setSelectedRows({})
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(locale === "en" ? "User already exists in the folder!" : "العميل موجود بالفعل في المجلد")
      } else {
        Alerto(error)
      }
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
          <Link href={`/users/${id}`}>
            <a aria-label="go to client profile" className="d-flex align-items-center">
              <ResponsiveImage imageSrc={image} alt={"user"} width="75px" height="75px" />
              <div className="f-b mx-2">{userName}</div>
            </a>
          </Link>
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
        }) => <div className="f-b">{formatDate(createdAt)}</div>,
      },
    ],
    [locale],
  )

  return (
    <>
      <div className="body-content">
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <div className="d-flex align-items-center">
            <h1 className="f-b fs-6 my-0 mx-2">
              {pathOr("", [locale, "Users", "users"], t)} ({users?.length})
            </h1>
            <Link href="/users/folders">
              <button className="btn-main btn-main-w mr-20">
                {pathOr("", [locale, "Users", "browse"], t)} <AiFillFolderOpen />
              </button>
            </Link>
          </div>
          <div className="filtter_2">
            <label htmlFor="byCity" className="visually-hidden">
              {pathOr("", [locale, "Orders", "byCity"], t)}
            </label>
            <select
              id="byCity"
              className="form-control form-select"
              style={{ width: "180px" }}
              ref={selectCityValue}
              defaultValue={filter.filterByNeighborhood || 0}
            >
              <option hidden disabled value={0}>
                {pathOr("", [locale, "Users", "byCity"], t)}
              </option>
              {regions?.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <label htmlFor="byOrder" className="visually-hidden">
              {pathOr("", [locale, "Orders", "byOrder"], t)}
            </label>
            <select
              id="byOrder"
              className="form-control form-select"
              style={{ width: "140px" }}
              ref={selectOrderValue}
              defaultValue={filter.fitlerByOrder || 0}
            >
              <option hidden disabled value={0}>
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
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setOpenFolderModal(false)
              setIsNewFolder(false)
            }}
          ></button>
        </Modal.Header>
        <Modal.Body>
          {isNewFolder ? (
            <>
              <div className="m-auto" style={{ width: "fit-content", textAlign: "start" }}>
                <div className={"m-auto"} style={{ position: "relative" }}>
                  {folder.folderImage && (
                    <>
                      <IoIosCloseCircle
                        onClick={() => setFolder((prev) => ({ ...prev, folderImage: "" }))}
                        size={20}
                        role="button"
                        style={{
                          cursor: "pointer",
                          position: "absolute",
                          top: 5,
                          right: 5,
                          zIndex: 1,
                        }}
                      />
                      <Image src={URL.createObjectURL(folder.folderImage)} alt="coupon" width={160} height={160} />
                    </>
                  )}
                </div>
                {!folder.folderImage && (
                  <>
                    <div className={"btn_apload_img"}>
                      <FaCamera />
                      <input
                        id="handleUploadImages"
                        type="file"
                        onChange={(e) => setFolder((prev) => ({ ...prev, folderImage: e.target.files[0] }))}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="form-group">
                <label>{pathOr("", [locale, "Users", "folderName"], t)}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={pathOr("", [locale, "Users", "writeFolderName"], t)}
                  onChange={(e) => setFolder((prev) => ({ ...prev, folderName: e.target.value }))}
                />

                <button type="button" className="btn-main mt-4 w-100" onClick={addNewFolder}>
                  {pathOr("", [locale, "Users", "save"], t)}
                </button>
              </div>
            </>
          ) : (
            <ul className="list_folder">
              {!isNewFolder &&
                folders?.fileList
                  // ?.filter(({ isActive }) => isActive)
                  .map(({ id, image, name, fileUser }) => (
                    <li className="item" key={id}>
                      <div>
                        <ResponsiveImage imageSrc={image} alt={"folder"} />
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
        <button
          className="btn-main rounded-0"
          onClick={() => {
            if (Object.keys(selectedRows).length === 0) {
              toast.error(locale === "en" ? "Please choose 1 client at least" : "من فضلك اختر عميل واحد علي الاقل")
            } else setOpenNotificationModal(!openNotificationModal)
          }}
        >
          {pathOr("", [locale, "Users", "sendNotfi"], t)}
          <RiNotification2Fill />
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
    </>
  )
}

export default Users

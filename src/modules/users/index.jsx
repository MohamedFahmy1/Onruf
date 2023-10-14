import React, { useMemo, useState, useEffect } from "react"
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

const Users = () => {
  const [folders, setFolders] = useState();
  const [isNewFolder , setIsNewFolder] = useState();
  const [users, setUsers] = useState()
  const [openFolderModal, setOpenFolderModal] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [folderImage, setFolderImage] = useState("")
  const [selectedRows, setSelectedRows] = useState({})
  const {locale} = useRouter()

  const rows = Object.keys(selectedRows)

  const selectedUsersIds = rows.map((row) => {
    const selectedRow = users?.filter((_, index) => index === +row)
    return selectedRow[0].id
  })

  const fetchUsers = async () => {
    const {data: { data: getUsers } } = await axios(`${process.env.REACT_APP_API_URL}/ListClientsForProvider?lang=${locale}`);
    setUsers(getUsers)
  }

  const fetchFolders = async () => {
    try{
        const { data: { data } } = await axios(`${process.env.REACT_APP_API_URL}/ListFolder?type=2&pageIndex=1&PageRowsCount=10&lang=${locale}`)
        setFolders(data)
    }catch(error){
        console.error('error', error)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchFolders()
  },[isNewFolder])




  const addNewFolder = async () => {
    const formData = new FormData()
    formData.append('type', 2);
    formData.append('nameAr', folderName)
    formData.append('nameEn', folderName)
    formData.append('image', folderImage)
    try {
      await axios.post(process.env.REACT_APP_API_URL + "/AddFolder", formData)
      toast.success(locale === "en" ? "A folder has been added successfully!" : "تم اضافة الملف الجديد بنجاح")
      setOpenFolderModal(false)
      const { data: { data } } = await axios(`${process.env.REACT_APP_API_URL}/ListFolder?type=2&maxRows=10&currentPage=1&lang=${locale}`)
      setFolders(data)
      setIsNewFolder(false)
    } catch (error) {
      console.error(error)
      toast.error(error.response.data.message)
    }
  }

  const handleAddNewFolderModal =() => {
    setOpenFolderModal(false)
    setIsNewFolder(true);
    setOpenFolderModal(true)

  }

  useEffect(() => {
    folders?.fileList?.length>0 && setIsNewFolder(false)
  },[])

  const addUserToFolder = async (id) => {
    let msg = ""
    try {
      if (!id) return

      const { message } = await axios.post(process.env.REACT_APP_API_URL + "/AddFolderUser", { folderId: id, userId: selectedUsersIds })
      msg = message
      toast.success(locale === "en" ? "Request has been made successfully!" : "تمت الاضافة الجديد بنجاح")
      setOpenFolderModal(false)
      setSelectedRows({})
    } catch (error) {
      console.error(error)
      toast.error(error.response.data.message)
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
            <img
              src={image}
              className="img_table img_table2 cursor-pointer"
              
            />
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
    ],
    [],
  )

  return (
    <>
      <div className="body-content">
        <div>
          <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
            <div className="d-flex align-items-center">
              <h6 className="f-b m-0">
                {pathOr("", [locale, "Users", "users"], t)} ({users?.length})
              </h6>
              <Link href="/users/folders">
                <a className="btn-main btn-main-w mr-20">
                  {pathOr("", [locale, "Users", "browse"], t)} <AiFillFolderOpen />{" "}
                </a>
              </Link>
            </div>
            <div className="filtter_2">
              <select className="form-control form-select">
                <option hidden disabled selected>
                  {pathOr("", [locale, "Users", "byCity"], t)}
                </option>
                <option>-----</option>
                <option>-----</option>
              </select>
              <select className="form-control form-select">
                <option hidden disabled selected>
                  {pathOr("", [locale, "Users", "byOrder"], t)}
                </option>
                <option>-----</option>
                <option>-----</option>
              </select>
              <button className="btn-main rounded-0">{pathOr("", [locale, "Users", "filter"], t)}</button>
            </div>
          </div>

          <div className="contint_paner">
           {users && <Table
              columns={columns}
              data={users && users}
              pageSize={10}
              selectedRows={selectedRows}
              onSelectedRowsChange={setSelectedRows}
            />
           }
            {users?.length > 10 && <Pagination listLength={users.length} pageSize={10} />}
          </div>
        </div>
      </div>
      {/* Folder Modal */}

      <Modal show={openFolderModal} onHide={() => setOpenFolderModal(false)}>
        <Modal.Header>
          <h5 className="modal-title m-0 f-b" id="staticBackdropLabel">
            { isNewFolder  ? "اضافة مجلد  جديد" : "اختر المجلد"}
          </h5>
          <button type="button" className="btn-close" onClick={() => setOpenFolderModal(false)}></button>
        </Modal.Header>
        <Modal.Body>
          { isNewFolder ? (
            <div className="form-group">
              <label>اسم المجلد</label>
              <input
                type="text"
                className="form-control"
                placeholder="اكتب اسم المجلد"
                onChange={(e) => setFolderName(e.target.value)}
              />
              <input type='file' onChange={(e) => setFolderImage(e.target.files[0])}/>
              <button type="button" className="btn-main" onClick={ addNewFolder}>
            حفظ
          </button>
            </div>
          ) : (
            <ul className="list_folder">
              { !isNewFolder&&  folders?.fileList
                // ?.filter(({ isActive }) => isActive)
                .map(({ id, image, name, fileUser }) => (
                  <li className="item" key={id}>
                    <div>
                      <img src={image} />
                      <div>
                        <h6 className="f-b">{name}</h6>
                        <div className="gray-color">
                          <span className="main-color f-b">{fileUser?.length}</span> عميل مضاف
                        </div>
                      </div>
                    </div>
                    <button className="btn-main" onClick={() => addUserToFolder(id)}>
                      حفظ
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </Modal.Body>
        {!isNewFolder &&
        <Modal.Footer className="modal-footer">
          <button type="button" className="btn-main" onClick={ handleAddNewFolderModal}>
            اضافة مجلد جديد
          </button>
        </Modal.Footer>
}
      </Modal>

      <div className="btns_fixeds">
        <button className="btn-main rounded-0">
          {pathOr("", [locale, "Users", "sendNotfi"], t)}
          {/* <IoNotificationsSharp /> */}
        </button>
        <button onClick={() => setOpenFolderModal(!openFolderModal)} className="btn-main btn-main-w rounded-0">
          {pathOr("", [locale, "Users", "addUser"], t)} <RiFolder5Fill />
        </button>
      </div>
    </>
  )
}

export default Users

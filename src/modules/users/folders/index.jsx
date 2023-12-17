import React, { useEffect, useState } from "react"
import Modal from "react-bootstrap/Modal"
import { Row, Col } from "react-bootstrap"
// import folderImg from "../../../../public/icons/folder.svg"
// import homeImg from "../../../../public/images/home1.jpg"
import rightArrow from "../../../../public/icons/right-arrow (21).svg"
import Link from "next/link"
import axios from "axios"
import Router, { useRouter } from "next/router"
import Pagination from "../../../common/pagination"
import { propOr, pathOr } from "ramda"
import { formatDate } from "../../../common/functions"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { RiDeleteBin5Line } from "react-icons/ri"
import { MdModeEdit } from "react-icons/md"
import { Fragment } from "react"
import t from "../../../translations.json"
const UsersFolders = () => {
  const { locale } = useRouter()
  const page = useRouter()?.query?.page || 1

  // const folders = useSelector((state) => state.foldersSlice.folder)
  const [openFolderModal, setOpenFolderModal] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [editedFolderName, setEditedFolderName] = useState("")
  const [folderImage, setFolderImage] = useState("")
  const [folders, setFolders] = useState()
  const [folderId, setFolderId] = useState(false)
  const [editModal, setEditModal] = useState(false)

  const editFolder = async () => {
    const values = { id: folderId, type: 2, nameAr: editedFolderName, nameEn: editedFolderName, image: folderImage }
    const formData = new FormData()

    for (const key in values) {
      formData.append(key, values[key])
    }
    await axios.put(process.env.REACT_APP_API_URL + "/EditFolder", formData)
    toast.success(locale === "en" ? "A folder has been added successfully!" : "تم تعديل الملف بنجاح")
    setOpenFolderModal(false)
  }

  const deleteFolder = async (folderId) => {
    alert("Delete this folder")
    await axios.delete(process.env.REACT_APP_API_URL + `/RemoveFolder?id=${folderId}`)
    toast.success(locale === "en" ? "A folder has been added successfully!" : "تم مسح الملف بنجاح")
    setOpenFolderModal(false)
    getUserFolders()
  }

  const addNewFolder = async () => {
    const formData = new FormData()
    formData.append("type", 2)
    formData.append("nameAr", folderName)
    formData.append("nameEn", folderName)
    formData.append("image", folderImage)
    try {
      // const values = { type: 2, nameAr: folderName, nameEn: folderName, image: folderImage }
      await axios.post(process.env.REACT_APP_API_URL + "/AddFolder", formData).then((res) => {})
      toast.success(locale === "en" ? "A folder has been added successfully!" : "تم اضافة الملف الجديد بنجاح")
      setOpenFolderModal(false)
      await axios.get(`${process.env.REACT_APP_API_URL}/ListFolder?type=2&pageIndex=1&PageRowsCount=10&lang=${locale}`)
    } catch (error) {
      console.log({ error })
      toast.error("Something went wrong!")
    }
  }

  const getUserFolders = async () => {
    const {
      data: {
        data: { fileList: folders },
      },
    } = await axios.get(
      `${process.env.REACT_APP_API_URL}/ListFolder?type=2&pageIndex=1&PageRowsCount=10&lang=${locale}`,
    )
    setFolders(folders)
  }

  useEffect(() => {
    getUserFolders()
  }, [openFolderModal])

  const totalNumberOfUsers = folders?.fileList?.map((folder) => folder.type === "2")
  const pageSize = 6
  console.log(folders)
  return (
    <Fragment>
      <div className="body-content">
        <div>
          <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
            <div className="d-flex align-items-center">
              <h6 className="f-b m-0">
                {pathOr("", [locale, "Users", "clientsFolders"], t)} ({folders?.length})
              </h6>
              <Link href="/users">
                <a className="btn-main btn-main-w mr-20">
                  {pathOr("", [locale, "Users", "backToAllClientsPage"], t)} <img src={rightArrow.src} />
                </a>
              </Link>
            </div>
            <button
              className="btn-main"
              onClick={() => {
                setOpenFolderModal(!openFolderModal)
                setEditModal(false)
              }}
            >
              {pathOr("", [locale, "Users", "add_folder"], t)} <i className="fas fa-plus-circle font-18"></i>
            </button>
          </div>

          <div className="contint_paner">
            <div>
              <Row>
                {folders &&
                  folders?.map((folder) => (
                    <Col lg={4} md={6} key={folder?.id}>
                      <div
                        className="box_cus_Folder"
                        onClick={() => {
                          setEditedFolderName(folder.name)
                          setEditModal(true)
                          setFolderId(folder.id)
                        }}
                      >
                        <div className="folder__actions__btn">
                          <MdModeEdit className="btn_Measures" onClick={() => setOpenFolderModal(true)} />
                          <RiDeleteBin5Line className="btn_Measures" onClick={() => deleteFolder(folder.id)} />
                        </div>
                        <div onClick={() => Router.push(`/users/folders/${folder?.id}`)}>
                          <h6 className="f-b ">{folder?.name}</h6>
                          <div className="gray-color">
                            <span className="main-color f-b">{folder?.fileUser?.length}</span>{" "}
                            {pathOr("", [locale, "Users", "clientsAdded"], t)}
                          </div>
                          <div className="avatars-stack">
                            {folder.fileUser?.slice(0, 5).map((user, index) => (
                              <div className="avatar " key={index}>
                                <img src={user?.image} className="rounded-circle" />
                              </div>
                            ))}
                            {folder?.fileUser?.length - 5 > 0 && (
                              <div className="avatar">+{folder?.fileUser?.length - 5}</div>
                            )}
                          </div>
                          <div className="gray-color">{formatDate(folder?.createdAt)}</div>
                        </div>
                      </div>
                    </Col>
                  ))}
              </Row>

              {folders?.length > pageSize && <Pagination listLength={folders?.length} pageSize={pageSize} />}
            </div>
          </div>
        </div>
      </div>

      {/* Folder Modal */}

      <Modal
        show={openFolderModal}
        onHide={() => {
          setOpenFolderModal(false)
          setEditedFolderName("")
          setFolderName("")
        }}
      >
        <Modal.Header>
          <h5 className="modal-title m-0 f-b" id="staticBackdropLabel">
            {!folders?.length
              ? pathOr("", [locale, "Users", "addNewFolder"], t)
              : pathOr("", [locale, "Users", "add_folder"], t)}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setOpenFolderModal(false)
              setEditedFolderName("")
              setFolderName("")
            }}
          ></button>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>{pathOr("", [locale, "Users", "folderName"], t)}</label>
            <input
              type="text"
              className="form-control"
              onChange={editModal ? (e) => setEditedFolderName(e.target.value) : (e) => setFolderName(e.target.value)}
              value={editModal ? editedFolderName : folderName}
            />
            <input type="file" onChange={(e) => setFolderImage(e.target.files[0])} />
          </div>
        </Modal.Body>

        <Modal.Footer className="modal-footer">
          {editModal ? (
            <button type="button" className="btn-main" onClick={editFolder}>
              {pathOr("", [locale, "Users", "edit"], t)}
            </button>
          ) : (
            <button type="button" className="btn-main" onClick={addNewFolder}>
              {pathOr("", [locale, "Users", "save"], t)}
            </button>
          )}
        </Modal.Footer>
      </Modal>
    </Fragment>
  )
}

export default UsersFolders

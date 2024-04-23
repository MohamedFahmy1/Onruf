import { useEffect, useState } from "react"
import Modal from "react-bootstrap/Modal"
import { Row, Col } from "react-bootstrap"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/router"
import Pagination from "../../../common/pagination"
import { pathOr } from "ramda"
import { formatDate } from "../../../common/functions"
import { toast } from "react-toastify"
import { RiDeleteBin5Line } from "react-icons/ri"
import { MdModeEdit } from "react-icons/md"
import t from "../../../translations.json"
import Alerto from "../../../common/Alerto"
import { IoIosArrowRoundBack, IoIosCloseCircle } from "react-icons/io"
import ResponsiveImage from "../../../common/ResponsiveImage"
import { useFetch } from "../../../hooks/useFetch"
import { FaCamera } from "react-icons/fa"
import Image from "next/image"

const UsersFolders = () => {
  const { locale } = useRouter()

  const [openFolderModal, setOpenFolderModal] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [editedFolderName, setEditedFolderName] = useState("")
  const [folderImage, setFolderImage] = useState("")
  const [folderId, setFolderId] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const { data: folders, fetchData: getUserFolders } = useFetch(
    `/ListFolder?type=2&pageIndex=1&PageRowsCount=10&lang=${locale}`,
  )
  const editFolder = async () => {
    if (!editedFolderName) return toast.error(locale === "en" ? "Please enter folder name!" : "من فضلك ادخل اسم الملف")
    const values = { id: folderId, type: 2, nameAr: editedFolderName, nameEn: editedFolderName, image: folderImage }
    const formData = new FormData()
    for (const key in values) {
      formData.append(key, values[key])
    }
    await axios.put("/EditFolder", formData)
    toast.success(locale === "en" ? "A folder has been added successfully!" : "تم تعديل الملف بنجاح")
    setOpenFolderModal(false)
  }

  const deleteFolder = async (folderId) => {
    alert("Delete this folder")
    await axios.delete(`/RemoveFolder?id=${folderId}`)
    toast.success(locale === "en" ? "A folder has been added successfully!" : "تم مسح الملف بنجاح")
    setOpenFolderModal(false)
    getUserFolders()
  }

  const addNewFolder = async () => {
    if (!folderName) return toast.error(locale === "en" ? "Please enter folder name!" : "من فضلك ادخل اسم الملف")
    const formData = new FormData()
    formData.append("type", 2)
    formData.append("nameAr", folderName)
    formData.append("nameEn", folderName)
    formData.append("image", folderImage)
    try {
      await axios.post("/AddFolder", formData).then((res) => {})
      toast.success(locale === "en" ? "A folder has been added successfully!" : "تم اضافة الملف الجديد بنجاح")
      setOpenFolderModal(false)
      await axios.get(`/ListFolder?type=2&pageIndex=1&PageRowsCount=10&lang=${locale}`)
    } catch (error) {
      Alerto(error)
    }
  }

  useEffect(() => {
    getUserFolders()
  }, [openFolderModal, getUserFolders])

  const pageSize = 6
  return (
    <>
      <div className="body-content">
        <div>
          <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
            <div className="d-flex align-items-center">
              <h6 className="f-b mx-2 my-0">
                {pathOr("", [locale, "Users", "clientsFolders"], t)} ({folders?.fileList.length})
              </h6>
              <Link href="/users">
                <button className="btn-main btn-main-w mr-20">
                  {pathOr("", [locale, "Users", "backToAllClientsPage"], t)} <IoIosArrowRoundBack size={40} />
                </button>
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
                {!!folders &&
                  folders?.fileList.map((folder) => (
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
                        <Link href={`/users/folders/${folder?.id}`}>
                          <a aria-label="open folder">
                            <h6 className="f-b ">{folder?.name}</h6>
                            <div className="gray-color">
                              <span className="main-color f-b">{folder?.fileUser?.length}</span>{" "}
                              {pathOr("", [locale, "Users", "clientsAdded"], t)}
                            </div>
                            <div className="avatars-stack">
                              {folder.fileUser?.slice(0, 5).map((user, index) => (
                                <div className="avatar" key={index}>
                                  <ResponsiveImage
                                    imageSrc={
                                      user?.image.includes("http") ? user?.image.replace("http", "https") : user?.image
                                    }
                                    alt={"client"}
                                    width="25px"
                                    height="25px"
                                  />
                                </div>
                              ))}
                              {folder?.fileUser?.length - 5 > 0 && (
                                <div className="avatar">+{folder?.fileUser?.length - 5}</div>
                              )}
                            </div>
                            <div className="gray-color">{formatDate(folder?.createdAt)}</div>
                          </a>
                        </Link>
                      </div>
                    </Col>
                  ))}
              </Row>
              {folders?.fileList.length > pageSize && (
                <Pagination listLength={folders?.fileList.length} pageSize={pageSize} />
              )}
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
            {!folders?.fileList.length
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
          <>
            <div className="m-auto" style={{ width: "fit-content", textAlign: "start" }}>
              <div className={"d-flex m-auto"} style={{ position: "relative" }}>
                {folderImage && (
                  <>
                    <IoIosCloseCircle
                      onClick={() => setFolderImage("")}
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
                    <Image src={URL.createObjectURL(folderImage)} alt="coupon" width={160} height={160} />
                  </>
                )}
              </div>
              {!folderImage && (
                <div className={"btn_apload_img"}>
                  <FaCamera />
                  <label htmlFor="handleUploadImages" className="visually-hidden">
                    {"handleUploadImages"}
                  </label>
                  <input id="handleUploadImages" type="file" onChange={(e) => setFolderImage(e.target.files[0])} />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>{pathOr("", [locale, "Users", "folderName"], t)}</label>
              <input
                type="text"
                className="form-control"
                placeholder={pathOr("", [locale, "Users", "writeFolderName"], t)}
                onChange={editModal ? (e) => setEditedFolderName(e.target.value) : (e) => setFolderName(e.target.value)}
                value={editModal ? editedFolderName : folderName}
              />
            </div>
          </>
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
    </>
  )
}

export default UsersFolders

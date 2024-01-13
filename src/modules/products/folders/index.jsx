import { useState, useEffect } from "react"
import Modal from "react-bootstrap/Modal"
import { Row, Col } from "react-bootstrap"
import folderImg from "../../../../public/icons/folder.svg"
import { BsArrowLeft } from "react-icons/bs"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/router"
import Pagination from "../../../common/pagination"
import { propOr, pathOr } from "ramda"
import { formatDate } from "../../../common/functions"
import { toast } from "react-toastify"
import { getFolderList } from "../../../appState/product/productActions"
import { useSelector, useDispatch } from "react-redux"
import { RiDeleteBin5Line } from "react-icons/ri"
import { MdModeEdit } from "react-icons/md"
import t from "../../../translations.json"
import Image from "next/image"
import { textAlignStyle } from "../../../styles/stylesObjects"
import Alerto from "../../../common/Alerto"

const Folders = () => {
  const { locale } = useRouter()
  const page = useRouter()?.query?.page || 1
  const dispatch = useDispatch()
  const folders = useSelector((state) => state.foldersSlice.folder)
  const [openFolderModal, setOpenFolderModal] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [editedFolderName, setEditedFolderName] = useState("")
  const [folderImage, setFolderImage] = useState("")
  const [editModal, setEditModal] = useState(false)
  const [folderId, setFolderId] = useState(false)

  const editFolder = async () => {
    const values = { id: folderId, type: 1, nameAr: editedFolderName, nameEn: editedFolderName, image: folderImage }
    const formData = new FormData()
    for (const key in values) {
      formData.append(key, values[key])
    }
    try {
      await axios.put(process.env.NEXT_PUBLIC_API_URL + "/EditFolder", formData)
      toast.success(locale === "en" ? "A folder has been added successfully!" : "تم تعديل الملف بنجاح")
      setOpenFolderModal(false)
    } catch (error) {
      Alerto(error)
    }
  }
  const deleteFolder = async (folderId) => {
    alert("Delete this folder")
    await axios.delete(process.env.NEXT_PUBLIC_API_URL + `/RemoveFolder?id=${folderId}`)
    toast.success(locale === "en" ? "A folder has been added successfully!" : "تم مسح الملف بنجاح")
    setOpenFolderModal(false)
    dispatch(getFolderList(locale))
  }

  const addNewFolder = async () => {
    const formData = new FormData()
    formData.append("type", 1)
    formData.append("nameAr", folderName)
    formData.append("nameEn", folderName)
    formData.append("image", folderImage)
    try {
      await axios.post(process.env.NEXT_PUBLIC_API_URL + "/AddFolder", formData)
      const {
        data: { data },
      } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/ListFolder?currentPage=${page}&lang=${locale}&type=1`)
      toast.success(locale === "en" ? "A folder has been added successfully!" : "تم اضافة الملف الجديد بنجاح")
      dispatch(getFolderList(locale))
      setOpenFolderModal(false)
    } catch (error) {
      Alerto(error)
    }
  }

  useEffect(() => {
    dispatch(getFolderList(locale))
  }, [locale, openFolderModal, dispatch])
  const totalNumberOfProducts = folders?.fileList?.length
  const pageSize = 6
  return (
    <>
      <div className="body-content">
        <div>
          <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
            <div className="d-flex align-items-center ">
              <h6 className="f-b m-0">
                {pathOr("", [locale, "Products", "product_folders"], t)} ({totalNumberOfProducts})
              </h6>
              <Link href="/products">
                <button className="btn-main btn-main-w mr-20 mx-3">
                  <span>{pathOr("", [locale, "Products", "return_to_products_page"], t)} </span>
                  <BsArrowLeft size={25} />
                </button>
              </Link>
            </div>
            <button
              className="btn-main"
              onClick={() => {
                setEditModal(false)
                setOpenFolderModal(!openFolderModal)
              }}
            >
              {pathOr("", [locale, "Products", "add_folder"], t)}
              <i className="fas fa-plus-circle font-18"></i>
            </button>
          </div>
          <div className="contint_paner">
            <div>
              <Row>
                {!totalNumberOfProducts && (
                  <h4 className="text-center my-3">{locale === "en" ? "No folders found" : "لا يوجد ملفات"}</h4>
                )}
                {propOr([], ["fileList"], folders)
                  .filter(({ isActive }) => isActive)
                  .slice((page - 1) * pageSize, page * pageSize)
                  .map((folder) => (
                    <Col lg={4} md={6} key={folder?.id}>
                      <div
                        className="box_pro_Folder"
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
                        <Link href={`/products/folders/${folder?.id}`}>
                          <div>
                            <div className="img_ alot-img" style={{ width: "185px", margin: "auto" }}>
                              <Image
                                src={
                                  !folder.image || folder.image === "http://onrufwebsite6-001-site1.htempurl.com/"
                                    ? folderImg
                                    : folder.image
                                }
                                alt="folder"
                                width={185}
                                height={150}
                                priority
                                className="d-block m-auto"
                              />
                            </div>
                            <div className="text-center mt-2">
                              <h6 className="f-b m-0">{folder?.name}</h6>
                              <div className="gray-color">
                                <span className="main-color f-b">{folder?.fileProducts?.length}</span>
                                {pathOr("", [locale, "Products", "added_product"], t)}
                              </div>
                              <div className="gray-color">{formatDate(folder?.createdAt)}</div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </Col>
                  ))}
              </Row>
              {totalNumberOfProducts > pageSize && (
                <Pagination listLength={folders?.fileList?.length} pageSize={pageSize} />
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
          <h1 className="modal-title m-0 fs-5 f-b" id="staticBackdropLabel">
            {!folders?.fileList?.length
              ? pathOr("", [locale, "Products", "add_new_folder"], t)
              : pathOr("", [locale, "Products", "choose_folder"], t)}
          </h1>
          <button
            type="button"
            className="btn-close"
            aria-label="close modal"
            onClick={() => {
              setOpenFolderModal(false)
              setEditedFolderName("")
              setFolderName("")
            }}
          ></button>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group" style={textAlignStyle(locale)}>
            <label>{pathOr("", [locale, "Users", "folderName"], t)}</label>
            <input
              type="text"
              className="form-control"
              placeholder={pathOr("", [locale, "Users", "writeFolderName"], t)}
              onChange={editModal ? (e) => setEditedFolderName(e.target.value) : (e) => setFolderName(e.target.value)}
              value={editModal ? editedFolderName : folderName}
            />
            <input type="file" onChange={(e) => setFolderImage(e.target.files[0])} className="mt-3" />
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          {editModal ? (
            <button type="button" className="btn-main" onClick={editFolder}>
              {pathOr("", [locale, "Products", "editFolder"], t)}
            </button>
          ) : (
            <button type="button" className="btn-main" onClick={addNewFolder}>
              {pathOr("", [locale, "Products", "saveFolder"], t)}
            </button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Folders

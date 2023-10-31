/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react"
import ViewProducts from "./viewProducts"
import Modal from "react-bootstrap/Modal"
import { RiDeleteBin5Line, RiFolder5Fill } from "react-icons/ri"
import { useRouter } from "next/router"
import axios from "axios"
import t from "../../translations.json"
import Spinner from "react-bootstrap/Spinner"
import { toast } from "react-toastify"
import { pathOr } from "ramda"

const Products = () => {
  const [products, setProducts] = useState()
  const [folders, setFolders] = useState()
  const [openFolderModal, setOpenFolderModal] = useState(false)
  const [addProductToFolderLoading, setAddProductToFolderLoading] = useState({})
  const [folderName, setFolderName] = useState("")
  const [createNewFolder, setCreateNewFolder] = useState(folders?.fileList?.length)
  const [folderImage, setFolderImage] = useState("")
  const [productsIds, setProductsIds] = useState([])
  const [selectedRows, setSelectedRows] = useState({})
  const { locale } = useRouter()

  useEffect(() => {
    setCreateNewFolder(folders?.fileList?.length)
  }, [folders])

  const getProductsAndFolders = async () => {
    const [
      {
        data: { data: products },
      },
      {
        data: { data: folders },
      },
    ] = await Promise.all([
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ListProductByBusinessAccountId?currentPage=1&lang=${locale}`),
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/ListFolder?type=1&pageIndex=1&PageRowsCount=10&lang=${locale}`,
      ),
    ])
    setProducts(products)
    console.log(products)
    setFolders(folders)
  }

  useEffect(() => {
    getProductsAndFolders()
  }, [])

  const addNewFolder = async () => {
    try {
      if (!createNewFolder) {
        const formData = new FormData()
        formData.append("type", 1)
        formData.append("nameAr", folderName)
        formData.append("nameEn", folderName)
        formData.append("image", folderImage)
        const res = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/AddFolder", formData)
        await axios.post(process.env.NEXT_PUBLIC_API_URL + "/AddFolderProduct", {
          folderId: res?.data.data,
          productId: productsIds,
        })

        setOpenFolderModal(false)
        toast.success("A folder has been created successfully!")
        setCreateNewFolder(true)
        // setFolders([...folders, data])
      } else {
        setCreateNewFolder(false)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.response.data.message)
    }
  }

  const addProductToFolder = async (id) => {
    if (!productsIds?.length)
      return toast.warning(locale === "en" ? "No products were selected!" : "من فضلك قم بأضافة المنتجات")
    setAddProductToFolderLoading({ id, loader: true })
    try {
      await axios.post(process.env.NEXT_PUBLIC_API_URL + "/AddFolderProduct", {
        folderId: id,
        productId: productsIds,
      })

      setAddProductToFolderLoading({ loader: false })
      setOpenFolderModal(false)
      toast.success("Products has been added successfully!")
      setSelectedRows({})
    } catch (error) {
      setAddProductToFolderLoading({ loader: false })
      console.error(error)
      toast.error(error.response.data.message)
    }
  }

  const handleRemoveProduct = async () => {
    if (!productsIds?.length)
      return toast.warning(locale === "en" ? "No products were selected!" : "من فضلك قم بأضافة المنتجات")
    try {
      const isDelete = confirm(
        locale === "en" ? "Are you sure you want to delete this product ?" : "هل ترغب في مسح تلك المنتجات ؟",
      )
      if (!isDelete) return
      await axios.delete(process.env.NEXT_PUBLIC_API_URL + `/RemoveListProductByBusinessAccount`, { data: productsIds })
      setOpenFolderModal(false)
      toast.success(locale === "en" ? "Products has been deleted successfully!" : "تم حذف المنتج بنجاح")
      const {
        data: { data },
      } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/ListProductByBusinessAccountId?currentPage=1&lang=en`)
      setProducts(data)
    } catch (error) {
      console.error(error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <div>
      <ViewProducts
        products={products}
        setProductsIds={setProductsIds}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      {/* Folder Modal */}

      <Modal show={openFolderModal} onHide={() => setOpenFolderModal(false)}>
        <Modal.Header>
          <h5 className="modal-title m-0 f-b" id="staticBackdropLabel">
            {!createNewFolder
              ? pathOr("", [locale, "Products", "addNewFolder"], t)
              : pathOr("", [locale, "Products", "selectFolder"], t)}
          </h5>
          <button type="button" className="btn-close" onClick={() => setOpenFolderModal(false)}></button>
        </Modal.Header>
        <Modal.Body>
          {!createNewFolder ? (
            <div className="form-group">
              <label>{pathOr("", [locale, "Products", "folderName"], t)}</label>
              <input
                type="text"
                className="form-control"
                placeholder={locale === "en" ? "Enter folder's name" : "اكتب اسم المجلد"}
                onChange={(e) => setFolderName(e.target.value)}
              />

              <input type="file" onChange={(e) => setFolderImage(e?.target?.files[0])} />
            </div>
          ) : (
            <ul className="list_folder scroll-modal-folders">
              {folders?.fileList
                ?.filter(({ isActive }) => isActive)
                .map(({ id, image, name, fileProducts }, index) => (
                  <li className="item" key={index}>
                    <div>
                      <img src={image} />
                      <div>
                        <h6 className="f-b">{name}</h6>
                        <div className="gray-color">
                          <span className="main-color f-b">{fileProducts?.length}</span>
                          {locale === "en" ? "added products" : "منتج مضاف"}
                        </div>
                      </div>
                    </div>
                    <button className="btn-main" onClick={() => addProductToFolder(id)}>
                      {addProductToFolderLoading?.id === id && addProductToFolderLoading.loader ? (
                        <Spinner style={{ marginTop: 8 }} animation="border" />
                      ) : locale === "en" ? (
                        "Save"
                      ) : (
                        pathOr("", [locale, "Products", "save"], t)
                      )}
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </Modal.Body>

        <Modal.Footer className="modal-footer">
          <button type="button" className="btn-main" onClick={addNewFolder}>
            {!createNewFolder
              ? pathOr("", [locale, "Products", "save"], t)
              : pathOr("", [locale, "Products", "addNewFolder"], t)}
          </button>
        </Modal.Footer>
      </Modal>

      <div className="btns_fixeds">
        <button className="btn-main rounded-0" onClick={handleRemoveProduct}>
          {locale === "en" ? "Delete selected" : "حذف المحدد"}
          <RiDeleteBin5Line />
        </button>
        <button
          onClick={() => {
            if (!productsIds?.length)
              return toast.warning(locale === "en" ? "No products were selected!" : "من فضلك قم بأضافة المنتجات")
            setOpenFolderModal(!openFolderModal)
          }}
          className="btn-main btn-main-w rounded-0"
        >
          {locale === "en" ? "Add selected to folder" : "اضافة المحدد الي مجلد"}
          <RiFolder5Fill />
        </button>
      </div>
    </div>
  )
}

export default Products

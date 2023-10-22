import React, { Fragment, useState, useMemo, useEffect, useCallback } from "react"
import Table from "../../../common/table"
import Pagination from "./../../../common/pagination"
import Router, { useRouter } from "next/router"
import { propOr, pathOr, product } from "ramda"
import { MdModeEdit } from "react-icons/md"
import { formatDate } from "../../../common/functions"
import Modal from "react-bootstrap/Modal"
import axios from "axios"
import { Button } from "react-bootstrap"
import { RiDeleteBin5Line } from "react-icons/ri"
import { FaPlusCircle } from "react-icons/fa"
import Link from "next/link"
import { toast } from "react-toastify"
import t from "../../../translations.json"

const ViewProducts = ({ products: p = [], setProductsIds, selectedRows, setSelectedRows }) => {
  const router = useRouter()
  const {
    locale,
    query: { page = 1 },
  } = useRouter()

  const [products, setProducts] = useState(p)
  const [selectedFilter, setSelectedFilter] = useState("avaliableProducts")
  const [openQuantityModal, setOpenQuantityModal] = useState(false)
  const [openPriceModal, setOpenPriceModal] = useState(false)
  const [singleSelectedRow, setSingleSelectedRow] = useState({})
  // const [selectedRows, setSelectedRows] = useState({})
  const [quantityValue, setQuantityValue] = useState(0)
  const [quantityValueInfinity, setQuantityValueInfinity] = useState(undefined)
  const [priceValue, setPriceValue] = useState(0)
  const [discountDate, setDiscountDate] = useState(new Date())
  // const dispatch = useDispatch()
  // const folders = useSelector((state) => state.foldersSlice.folder)
  // const products = useSelector((state) => state.allProducts.products)
  // useEffect(()=>{
  //   dispatch(getFolderList(locale))
  //   dispatch(getProductsList())
  // })

  const productsCount = products?.length
  const avaliableProducts = (productsCount > 0 && products?.filter(({ isActive }) => isActive)) || []
  const inActiveProducts = (productsCount > 0 && products?.filter(({ isActive }) => !isActive)) || []
  const productsAlmostOut = (productsCount > 0 && products?.filter(({ qty }) => qty < 2)) || []

  const filterProducts =
    selectedFilter === "avaliableProducts"
      ? avaliableProducts
      : selectedFilter === "productsAlmostOut"
      ? productsAlmostOut
      : inActiveProducts
  const rows = Object.keys(selectedRows ? selectedRows : {})
  const selectedProductsIds = rows.map((row) => {
    const selectedRow = filterProducts.filter((_, index) => index === +row)
    return selectedRow?.[0]?.productId || selectedRow?.[0]?.id
  })

  const handleDeleteProduct = useCallback(
    async (productId) => {
      try {
        const isDelete = confirm(
          locale === "en" ? "Are you sure you want to delete this product ?" : "هل ترغب في مسح تلك المنتجات ؟",
        )
        if (!isDelete) return
        await axios.delete(process.env.NEXT_PUBLIC_API_URL + `/RemoveProduct?id=${productId}`)
        toast.success(locale === "en" ? "Products has been deleted successfully!" : "تم حذف المنتج بنجاح")
        const {
          data: { data },
        } = await axios(process.env.NEXT_PUBLIC_API_URL + `/ListProductByBusinessAccountId`)
        setProducts(data.filter(({ id }) => id !== productId))
      } catch (error) {
        console.error(error)
        toast.error(error.response.data.message)
      }
    },
    [locale],
  )

  useEffect(() => {
    setProductsIds(selectedProductsIds)
  }, [selectedRows])

  // useEffect(() => {
  //   // setSelectedRows({})
  // }, [products.length])

  useEffect(() => {
    if (singleSelectedRow?.id) {
      setDiscountDate(singleSelectedRow.disccountEndDate)
      setPriceValue(singleSelectedRow.priceDisc)
      setQuantityValue(singleSelectedRow.qty)
    }
  }, [singleSelectedRow])
  useEffect(() => {
    p && setProducts(p)
  }, [p])
  const minDate = () => {
    const dateIntoArray = formatDate(new Date()).split("/")
    return `${dateIntoArray[2]}-${dateIntoArray[1]}-${dateIntoArray[0].trim()}`
  }

  const columns = useMemo(
    () => [
      {
        Header: pathOr("", [locale, "Products", "productName"], t),
        accessor: "name",
        Cell: ({ row: { original } }) => (
          <div className="d-flex align-items-center">
            {router.pathname.includes("folders") ? (
              <img src={original.image} className="img_table" alt="" />
            ) : (
              <img
                src={pathOr(
                  "https://miro.medium.com/max/600/0*jGmQzOLaEobiNklD",
                  ["listMedia", 0, "url"] || image,
                  original,
                )}
                className="img_table"
                alt=""
              />
            )}
            <div>
              <h6 className="m-0 f-b"> {propOr("-", ["name"], original)} </h6>
              <div className="gray-color">{formatDate(propOr("-", ["createdAt"], original))}</div>
            </div>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Products", "category"], t),
        accessor: "category",
        Cell: ({ row: { values } }) => (
          <div>
            <h6 className="m-0 f-b">{propOr("-", ["category"], values)}</h6>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Products", "qty"], t),
        accessor: "qty",
        Cell: ({ row: { values, original } }) => (
          <div>
            <h6 className="m-0 f-b">{propOr("-", ["qty"], values)}</h6>
            <button
              className="info_"
              data-bs-toggle="modal"
              onClick={() => {
                setOpenQuantityModal(!openQuantityModal)
                setSingleSelectedRow(original)
              }}
              data-bs-target="#Quantity-adjustment"
            >
              {pathOr("", [locale, "Products", "adjustQty"], t)}
            </button>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Products", "price"], t),
        accessor: "price",
        Cell: ({ row: { values, original } }) => (
          <div>
            <span>
              <span>
                <h6 className="m-0 f-b" style={{ textDecoration: original?.priceDisc ? "line-through" : "unset" }}>
                  {propOr("-", ["price"], values)} {pathOr("", [locale, "Products", "currency"], t)}
                </h6>
              </span>
              {!!original?.priceDisc && (
                <span>
                  <h6 className="m-0 f-b">
                    {propOr("-", ["price"], values) - propOr("-", ["priceDisc"], original)}{" "}
                    {pathOr("", [locale, "Products", "currency"], t)}
                  </h6>
                </span>
              )}
            </span>
            <button
              className="info_"
              data-bs-toggle="modal"
              onClick={() => {
                setOpenPriceModal(!openPriceModal)
                setSingleSelectedRow(original)
              }}
              data-bs-target="#Quantity-reduction"
            >
              {pathOr("", [locale, "Products", "discount"], t)}
            </button>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Products", "productType"], t),
        accessor: "isMazad",
        Cell: ({ row: { original } }) => (
          <div>
            <h6 className="m-0 f-b">
              {original.isMazad && original.withFixedPrice
                ? `${pathOr("", [locale, "Products", "fixed"], t)}, ${pathOr("", [locale, "Products", "auction"], t)}`
                : original.isMazad && !original.withFixedPrice
                ? pathOr("", [locale, "Products", "auction"], t)
                : !original.isMazad && original.withFixedPrice
                ? pathOr("", [locale, "Products", "fixed"], t)
                : "-"}
            </h6>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Products", "actions"], t),
        accessor: "isActive",
        Cell: ({
          row: {
            values: { isActive },
            original: { productId },
            original: { id },
          },
        }) => {
          return (
            <div className="d-flex align-items-center gap-2">
              <div className="form-check form-switch p-0 m-0 d-flex">
                <MdModeEdit className="btn_Measures" onClick={() => Router.push(`/edit/${productId || id}`)} />
                <RiDeleteBin5Line className="btn_Measures" onClick={() => handleDeleteProduct(productId || id)} />
                <input
                  readOnly
                  className="form-check-input m-0 btn_Measures"
                  onChange={(e) => handleChangeStatus(productId || id)}
                  // checked={isActive}
                  defaultChecked={isActive}
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                />
              </div>
            </div>
          )
        },
      },
    ],
    [locale, openPriceModal, openQuantityModal, handleDeleteProduct],
  )
  const handleChangeStatus = async (id) => {
    try {
      await axios.post(process.env.NEXT_PUBLIC_API_URL + `/ChangeStatusProduct?id=${id}`, {})
      const {
        data: { data },
      } = await axios(process.env.NEXT_PUBLIC_API_URL + `/ListProductByBusinessAccountId`)
      setProducts(data)
    } catch (err) {
      console.error(err)
      toast.error(err.response.data.message)
    }
  }
  const handleEditProductQuantity = async () => {
    console.log(singleSelectedRow)
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/ProductAdjustQuantity?productId=${
          singleSelectedRow?.id || singleSelectedRow?.productId
        }${quantityValueInfinity ? "" : `&quantity=${quantityValue}`}`,
        {},
      )
      setOpenQuantityModal(false)
      toast.success(locale === "en" ? "Products has been updated successfully!" : "تم تعديل المنتج بنجاح")
      const {
        data: { data },
      } = await axios(process.env.NEXT_PUBLIC_API_URL + `/ListProductByBusinessAccountId`)
      setProducts(data)
    } catch (err) {
      console.error(err)
      toast.error(err.response.data.message)
    }
  }
  const handleAddDiscount = async () => {
    try {
      if (priceValue > singleSelectedRow.price) return toast.error(`Discount should be <= ${singleSelectedRow.price}`)
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/ProductDiscount?productId=${singleSelectedRow?.id}&PriceDiscount=${priceValue}&discountEndDate=${discountDate}`,
        {},
      )
      setOpenPriceModal(false)
      toast.success(locale === "en" ? "Products has been updated successfully!" : "تم تعديل المنتج بنجاح")
      const {
        data: { data },
      } = await axios(process.env.NEXT_PUBLIC_API_URL + `/ListProductByBusinessAccountId`)
      setProducts(data)
    } catch (err) {
      console.error(err)
      toast.error(err.response.data.message)
    }
  }
  return (
    <Fragment>
      <div className="body-content" style={{ padding: 30 }}>
        <div>
          <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
            <div className="d-flex align-items-center">
              <h6 className="f-b m-0">
                {locale === "en" ? "Products" : "المنتجات"} ({productsCount})
              </h6>
              <Link href="/products/folders">
                <a className="btn-main btn-main-w mr-20">
                  {locale === "en" ? "Browse through Folders" : "تصفح عن طريق المجلدات"}
                </a>
              </Link>
            </div>
            <Link href={"/products/add"}>
              <Button className="btn-main" variant={"contained"}>
                {locale === "en" ? "Add Product" : "اضافه منتج"}
                <FaPlusCircle className="me-2" />
              </Button>
            </Link>
          </div>
          <div className="filtter_1">
            <button
              className={`btn-main ${selectedFilter === "avaliableProducts" ? "active" : ""}`}
              onClick={() => {
                setSelectedFilter("avaliableProducts")
                // router.push({ query: { page: 1 } })
              }}
            >
              {pathOr("", [locale, "Products", "availableProducts"], t)} ({avaliableProducts?.length})
            </button>
            <button
              className={`btn-main ${selectedFilter === "productsAlmostOut" ? "active" : ""}`}
              onClick={() => {
                setSelectedFilter("productsAlmostOut")
                // router.push({ query: { page: 1 } })
              }}
            >
              {pathOr("", [locale, "Products", "almostOut"], t)} ({productsAlmostOut?.length})
            </button>
            <button
              className={`btn-main ${!selectedFilter ? "active" : ""}`}
              onClick={() => {
                setSelectedFilter("")
                // router.push({ query: { page: 1 } })
              }}
            >
              {pathOr("", [locale, "Products", "inActiveProducts"], t)} ({inActiveProducts?.length})
            </button>
          </div>
          <div className="contint_paner">
            <div className="outer_table">
              <Table
                columns={columns}
                data={filterProducts}
                selectedRows={selectedRows}
                onSelectedRowsChange={setSelectedRows}
                pageSize={5}
              />
            </div>
            <Modal centered show={openQuantityModal} onHide={() => setOpenQuantityModal(false)}>
              <Modal.Header>
                <h5 className="modal-title m-0 f-b" id="staticBackdropLabel">
                  {pathOr("", [locale, "Products", "adjustQty"], t)}
                </h5>
                <button type="button" className="btn-close" onClick={() => setOpenQuantityModal(false)}></button>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="f-b"> {pathOr("", [locale, "Products", "unLimited"], t)} </span>
                    <div className="form-check form-switch p-0 m-0">
                      <input
                        className="form-check-input m-0"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckChecked"
                        value={quantityValueInfinity}
                        onChange={(e) => setQuantityValueInfinity(e.target.checked)}
                      />
                    </div>
                  </div>
                  {!quantityValueInfinity && (
                    <div className="inpt_numb my-3">
                      <button className="btn_ plus" onClick={() => setQuantityValue((prev) => prev + 1)}>
                        +
                      </button>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={quantityValue}
                        onChange={(e) => setQuantityValue(e.target.value)}
                      />
                      <button
                        className="btn_ minus"
                        onClick={() => setQuantityValue((prev) => (quantityValue ? prev - 1 : 0))}
                      >
                        -
                      </button>
                    </div>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer className="modal-footer">
                <button type="button" className="btn-main" onClick={handleEditProductQuantity}>
                  {pathOr("", [locale, "Products", "save"], t)}
                </button>
              </Modal.Footer>
            </Modal>
            <Modal show={openPriceModal} onHide={() => setOpenPriceModal(false)}>
              <Modal.Header>
                <h5 className="disc-header">{pathOr("", [locale, "Products", "discount"], t)}</h5>
                <button type="button" className="btn-close" onClick={() => setOpenPriceModal(false)}></button>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <h5 className="disc-header">
                    {pathOr("", [locale, "Products", "currentPrice"], t)} : <span>{singleSelectedRow.price}</span>
                  </h5>
                  <div className="inpt_numb my-3">
                    <button className="btn_ plus" onClick={() => setPriceValue((prev) => prev + 1)}>
                      +
                    </button>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      onChange={(e) => setPriceValue(e.target.value)}
                      value={priceValue}
                      placeholder="0.00"
                    />
                    <button className="btn_ minus" onClick={() => setPriceValue((prev) => (priceValue ? prev - 1 : 0))}>
                      -
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>{pathOr("", [locale, "Products", "discountEndDate"], t)}</label>
                  <input
                    type="date"
                    className="form-control"
                    min={minDate()}
                    onChange={(e) => setDiscountDate(e.target.value)}
                    value={discountDate}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer className="modal-footer">
                <button type="button" className="btn-main" onClick={handleAddDiscount}>
                  حفظ
                </button>
              </Modal.Footer>
            </Modal>
            {productsCount > 5 && <Pagination listLength={productsCount} pageSize={5} />}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default ViewProducts

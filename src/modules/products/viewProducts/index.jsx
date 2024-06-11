import React, { useState, useMemo, useEffect, useCallback } from "react"
import Table from "../../../common/table"
import Pagination from "./../../../common/pagination"
import { useRouter } from "next/router"
import { propOr, pathOr } from "ramda"
import { MdModeEdit } from "react-icons/md"
import { formatDate, minDate } from "../../../common/functions"
import Modal from "react-bootstrap/Modal"
import axios from "axios"
import { Button } from "react-bootstrap"
import { RiDeleteBin5Line } from "react-icons/ri"
import { FaPlusCircle } from "react-icons/fa"
import Link from "next/link"
import { toast } from "react-toastify"
import t from "../../../translations.json"
import SendOfferModal from "../SendOfferModal"
import Image from "next/image"
import Alerto from "../../../common/Alerto"

const ViewProducts = ({ products: p = [], setProductsIds, selectedRows, setSelectedRows }) => {
  const router = useRouter()
  const { locale, push } = useRouter()
  const id = router.query.id

  const [products, setProducts] = useState(p)
  const [selectedFilter, setSelectedFilter] = useState("avaliableProducts")
  const [didnotSellProducts, setDidnotSellProducts] = useState()
  const [openQuantityModal, setOpenQuantityModal] = useState(false)
  const [openPriceModal, setOpenPriceModal] = useState(false)
  const [sendOfferModal, setSendOfferModal] = useState(false)
  const [singleSelectedRow, setSingleSelectedRow] = useState({})
  const [quantityValue, setQuantityValue] = useState(0)
  const [quantityValueInfinity, setQuantityValueInfinity] = useState(undefined)
  const [priceValue, setPriceValue] = useState(0)
  const [discountDate, setDiscountDate] = useState()

  const {
    productsCount,
    avaliableProducts,
    inActiveProducts,
    productsAlmostOut,
    didnotSell,
    filterProducts,
    selectedProductsIds,
  } = useMemo(() => {
    const productsCount = products?.length
    const avaliableProducts = (productsCount > 0 && products?.filter(({ isActive }) => isActive)) || []
    const inActiveProducts = (productsCount > 0 && products?.filter(({ isActive }) => !isActive)) || []
    const productsAlmostOut =
      (productsCount > 0 &&
        products?.filter(({ qty, almostSoldOutQuantity }) => qty <= almostSoldOutQuantity && qty != null)) ||
      []
    const didnotSell = didnotSellProducts
    const filterProducts =
      selectedFilter === "avaliableProducts"
        ? avaliableProducts
        : selectedFilter === "productsAlmostOut"
        ? productsAlmostOut
        : selectedFilter === "didnotSell"
        ? didnotSell
        : inActiveProducts
    const rows = Object.keys(selectedRows ? selectedRows : {})
    const selectedProductsIds = rows.map((row) => {
      const selectedRow = filterProducts.filter((_, index) => index === +row)
      return selectedRow?.[0]?.productId || selectedRow?.[0]?.id
    })
    return {
      productsCount,
      avaliableProducts,
      inActiveProducts,
      productsAlmostOut,
      didnotSell,
      filterProducts,
      selectedProductsIds,
    }
  }, [products, selectedRows, selectedFilter, didnotSellProducts])

  const fetchDidntSell = useCallback(async () => {
    if (!id) {
      const {
        data: { data: prod },
      } = await axios(`/ListDidntSellProducts`)
      setDidnotSellProducts(prod)
    }
  }, [id])

  const getProductData = useCallback(async () => {
    if (id) {
      const {
        data: { data: getSingleFolder },
      } = await axios(`/GetFolderById?id=${id}&lang=${locale}`)
      setProducts(getSingleFolder.listProduct)
    } else {
      const {
        data: { data },
      } = await axios(`/ListProductByBusinessAccountId`)
      setProducts(data)
    }
  }, [id, locale])

  const handleDeleteProduct = useCallback(
    async (productId) => {
      try {
        const isDelete = confirm(
          locale === "en" ? "Are you sure you want to delete this product ?" : "هل ترغب في مسح تلك المنتجات ؟",
        )
        if (!isDelete) return
        await axios.delete(`/RemoveProduct?id=${productId}`)
        toast.success(locale === "en" ? "Products has been deleted successfully!" : "تم حذف المنتج بنجاح")
        getProductData()
        fetchDidntSell()
      } catch (error) {
        Alerto(error)
      }
    },
    [locale, getProductData, fetchDidntSell],
  )

  useEffect(() => {
    setProductsIds(selectedProductsIds)
  }, [selectedRows, selectedProductsIds, setProductsIds])

  useEffect(() => {
    if (singleSelectedRow?.id || singleSelectedRow?.productId) {
      setDiscountDate(singleSelectedRow.disccountEndDate)
      setPriceValue(singleSelectedRow.priceDisc ? singleSelectedRow.priceDisc : singleSelectedRow.priceDiscount)
      setQuantityValue(singleSelectedRow.qty)
      setQuantityValueInfinity(singleSelectedRow.qty === null ? true : false)
    }
  }, [singleSelectedRow])

  useEffect(() => {
    p && setProducts(p)
  }, [p])

  useEffect(() => {
    if (!id) {
      fetchDidntSell()
    }
  }, [id, fetchDidntSell])

  const handleChangeStatus = useCallback(
    async (id) => {
      try {
        await axios.post(`/ChangeStatusProduct?id=${id}`)
        toast.success(locale === "en" ? "Product Status Changed Successfully!" : "تم تغيير حالة المنتج بنجاح")
        getProductData()
      } catch (err) {
        Alerto(err)
      }
    },
    [getProductData, locale],
  )

  const handleEditProductQuantity = async () => {
    try {
      const idApi = +singleSelectedRow?.id || +singleSelectedRow?.productId
      if (quantityValue < 1) {
        return toast.error(locale === "en" ? "Please put quantity more than 0" : "من فضلك ادخل كمية اكبر من 0")
      }
      const qtyApi = quantityValueInfinity ? "" : `&quantity=${quantityValue}`
      await axios.post(`/ProductAdjustQuantity?productId=${idApi}${qtyApi}`)
      setOpenQuantityModal(false)
      toast.success(locale === "en" ? "Products has been updated successfully!" : "تم تعديل المنتج بنجاح")
      getProductData()
    } catch (err) {
      Alerto(err)
    }
  }
  const handleAddDiscount = async () => {
    try {
      if (priceValue > singleSelectedRow.price) return toast.error(`Discount should be <= ${singleSelectedRow.price}`)
      if (!priceValue && !discountDate)
        return toast.error(locale === "en" ? "Please Enter Missing Data!" : "من فضلك ادخل جميع البيانات")
      await axios.post(
        `/ProductDiscount?productId=${
          singleSelectedRow?.id || singleSelectedRow?.productId
        }&PriceDiscount=${priceValue}&discountEndDate=${discountDate}`,
        {},
      )
      setOpenPriceModal(false)
      toast.success(locale === "en" ? "Products has been updated successfully!" : "تم تعديل المنتج بنجاح")
      getProductData()
    } catch (err) {
      Alerto(err)
    }
  }

  const getSaleTypes = useCallback(
    (original) => {
      const saleTypes = []
      if (original.isAuctionEnabled) {
        saleTypes.push(pathOr("", [locale, "Products", "auction"], t))
      }
      if (original.isNegotiationEnabled) {
        saleTypes.push(pathOr("", [locale, "Orders", "negotiation"], t))
      }
      if (original.isFixedPriceEnabled) {
        saleTypes.length < 1
          ? saleTypes.push(pathOr("", [locale, "Orders", "fixedPrice"], t))
          : saleTypes.push(pathOr("", [locale, "Products", "fixed"], t))
      }
      return saleTypes.length > 0 ? saleTypes.join(" - ") : "-"
    },
    [locale],
  )

  const columns = useMemo(
    () => [
      {
        Header: pathOr("", [locale, "Products", "productName"], t),
        accessor: "name",
        Cell: ({ row: { original } }) => (
          <div className="d-flex align-items-center">
            <div style={{ position: "relative", width: "106px", height: "100px" }}>
              <Image
                src={original.image || original.productImage}
                className="img_table"
                alt="product"
                priority
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div className="mx-4">
              <h6 className="m-0 f-b"> {propOr("-", ["name"], original)} </h6>
              <div className="gray-color">{formatDate(propOr("-", ["createdAt"], original))}</div>
            </div>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Products", "category"], t),
        accessor: "category",
        Cell: ({ row: { values, original } }) => (
          <div>
            <h6 className="m-0 f-b">{original.categoryName || original.category}</h6>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Products", "qty"], t),
        accessor: "qty",
        Cell: ({ row: { values, original } }) => (
          <div>
            <h6 className="m-0 f-b">{original?.qty === null ? "-" : original?.qty}</h6>
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
            {original?.isFixedPriceEnabled ? (
              <div>
                <span>
                  <span>
                    <h6
                      className="m-0 f-b"
                      style={{
                        textDecoration:
                          (original?.priceDisc || original?.priceDiscount) === original?.price
                            ? undefined
                            : "line-through",
                      }}
                    >
                      {propOr("-", ["price"], values)} {pathOr("", [locale, "Products", "currency"], t)}
                    </h6>
                  </span>
                  {(original?.priceDisc || original?.priceDiscount) !== original?.price && (
                    <span>
                      <h6 className="m-0 f-b">
                        {original?.priceDisc || original?.priceDiscount}{" "}
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
            ) : (
              "-"
            )}
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Products", "productType"], t),
        accessor: "isMazad",
        Cell: ({ row: { original } }) => (
          <div>
            <h6 className="m-0 f-b">{getSaleTypes(original)}</h6>
          </div>
        ),
      },
      {
        Header: pathOr("", [locale, "Products", "actions"], t),
        accessor: "isActive",
        Cell: ({
          row: {
            values: { isActive },
            original,
            original: { productId },
            original: { id },
          },
        }) => {
          return (
            <div className="d-flex align-items-center gap-2 flex-column">
              {selectedFilter === "didnotSell" ? (
                <div>
                  <Link href={`/products/repost/${productId || id}`}>
                    <button type="button" className="info_ mx-1">
                      {pathOr("", [locale, "Products", "repost"], t)}
                    </button>
                  </Link>
                  {original.isAuctionEnabled && new Date(original.auctionClosingTime) - new Date() < 0 && (
                    <button
                      type="button"
                      className="info_"
                      onClick={() => {
                        setSendOfferModal(true)
                        setSingleSelectedRow(original)
                      }}
                    >
                      {pathOr("", [locale, "Products", "send_offer"], t)}
                    </button>
                  )}
                </div>
              ) : (
                <div className="form-check form-switch p-0 m-0 d-flex">
                  <MdModeEdit className="btn_Measures" onClick={() => push(`/products/edit/${productId || id}`)} />
                  <RiDeleteBin5Line className="btn_Measures" onClick={() => handleDeleteProduct(productId || id)} />
                  <input
                    readOnly
                    className="form-check-input m-0 btn_Measures"
                    onChange={(e) => handleChangeStatus(productId || id)}
                    defaultChecked={isActive}
                    type="checkbox"
                    role="switch"
                    id={`flexSwitchCheckChecked ${id || productId}`}
                  />
                  <label htmlFor={`flexSwitchCheckChecked ${id || productId}`} className="opacity-0">
                    -
                  </label>
                </div>
              )}
            </div>
          )
        },
      },
    ],
    [
      locale,
      openPriceModal,
      openQuantityModal,
      selectedFilter,
      handleDeleteProduct,
      push,
      handleChangeStatus,
      getSaleTypes,
    ],
  )
  return (
    <section className="body-content p-4">
      <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
        <div className="d-flex align-items-center">
          <h6 className="f-b mx-2">
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
            {locale === "en" ? "Add Product" : "اضافه منتج"} <FaPlusCircle className="me-2" />
          </Button>
        </Link>
      </div>
      <div className="filtter_1">
        <button
          className={`btn-main ${selectedFilter === "avaliableProducts" ? "active" : ""}`}
          onClick={() => {
            setSelectedFilter("avaliableProducts")
          }}
        >
          {pathOr("", [locale, "Products", "availableProducts"], t)} ({avaliableProducts?.length})
        </button>
        <button
          className={`btn-main ${selectedFilter === "productsAlmostOut" ? "active" : ""}`}
          onClick={() => {
            setSelectedFilter("productsAlmostOut")
            push({ pathname: id ? `/products/folders/${id}` : "/products", query: { page: 1 } })
          }}
        >
          {pathOr("", [locale, "Products", "almostOut"], t)} ({productsAlmostOut?.length})
        </button>
        <button
          className={`btn-main ${!selectedFilter ? "active" : ""}`}
          onClick={() => {
            setSelectedFilter("")
            push({ pathname: id ? `/products/folders/${id}` : "/products", query: { page: 1 } })
          }}
        >
          {pathOr("", [locale, "Products", "inActiveProducts"], t)} ({inActiveProducts?.length})
        </button>
        {!id && (
          <button
            className={`btn-main ${selectedFilter === "didnotSell" ? "active" : ""}`}
            onClick={() => {
              setSelectedFilter("didnotSell")
              push({ query: { page: 1 } })
            }}
          >
            {pathOr("", [locale, "Products", "didnt_sell"], t)} ({didnotSell?.length})
          </button>
        )}
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
        {openQuantityModal && (
          <Modal centered show={openQuantityModal} onHide={() => setOpenQuantityModal(false)}>
            <Modal.Header>
              <h1 className="modal-title m-0 f-b fs-5" id="staticBackdropLabel">
                {pathOr("", [locale, "Products", "adjustQty"], t)}
              </h1>
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
                      defaultChecked={singleSelectedRow?.qty === null ? true : false}
                      onChange={(e) => setQuantityValueInfinity(e.target.checked)}
                    />
                  </div>
                </div>
                <div className="inpt_numb my-3">
                  <button
                    className="btn_ plus"
                    onClick={() => setQuantityValue((prev) => prev + 1)}
                    disabled={quantityValueInfinity}
                    aria-label="increase value by 1"
                  >
                    +
                  </button>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={quantityValueInfinity ? "" : +quantityValue}
                    onChange={(e) => setQuantityValue(+e.target.value)}
                    disabled={quantityValueInfinity}
                  />
                  <button
                    className="btn_ minus"
                    onClick={() => setQuantityValue((prev) => (quantityValue ? prev - 1 : 0))}
                    disabled={quantityValueInfinity}
                    aria-label="decrease value by 1"
                  >
                    -
                  </button>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="modal-footer">
              <button type="button" className="btn-main" onClick={handleEditProductQuantity}>
                {pathOr("", [locale, "Products", "save"], t)}
              </button>
            </Modal.Footer>
          </Modal>
        )}
        {openPriceModal && (
          <Modal show={openPriceModal} onHide={() => setOpenPriceModal(false)} centered>
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
                    placeholder="0"
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
                {pathOr("", [locale, "Products", "save"], t)}
              </button>
            </Modal.Footer>
          </Modal>
        )}
        {selectedFilter == "avaliableProducts" && avaliableProducts.length > 5 && (
          <Pagination listLength={avaliableProducts.length} pageSize={5} />
        )}
        {selectedFilter == "productsAlmostOut" && productsAlmostOut.length > 5 && (
          <Pagination listLength={productsAlmostOut.length} pageSize={5} />
        )}
        {selectedFilter == "didnotSell" && didnotSell.length > 5 && (
          <Pagination listLength={didnotSell.length} pageSize={5} />
        )}
        {selectedFilter == "" && inActiveProducts.length > 5 && (
          <Pagination listLength={inActiveProducts.length} pageSize={5} />
        )}
        {sendOfferModal && (
          <SendOfferModal
            sendOfferModal={sendOfferModal}
            setSendOfferModal={setSendOfferModal}
            id={singleSelectedRow.productId || singleSelectedRow.id}
          />
        )}
      </div>
    </section>
  )
}

export default React.memo(ViewProducts)

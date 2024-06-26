import { useState, useEffect, Fragment, useCallback } from "react"
import ViewProducts from "../../viewProducts"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import axios from "axios"
import { pathOr } from "ramda"
import t from "../../../../translations.json"
import Alerto from "../../../../common/Alerto"

const SingleFolder = () => {
  const {
    locale,
    query: { id },
  } = useRouter()
  const [products, setProducts] = useState()
  const [productsIds, setProductsIds] = useState([])
  const [selectedRows, setSelectedRows] = useState({})

  const getSingleFolder = useCallback(async () => {
    try {
      const {
        data: { data: getSingleFolder },
      } = await axios(`/GetFolderById?id=${id}&lang=${locale}`)
      setProducts(getSingleFolder.listProduct)
    } catch (error) {
      Alerto(error)
    }
  }, [id, locale])

  useEffect(() => {
    if (id) {
      id && getSingleFolder()
    }
  }, [getSingleFolder, id])

  const handleRemoveProductFromFolder = async () => {
    if (!productsIds?.length)
      return toast.warning(locale === "en" ? "No product was selected!" : "لم يتم اختيار اي منتج")
    try {
      await axios.delete(`/RemoveListProductsFolder`, {
        data: { folderId: Number(id), prductsIds: productsIds },
      })
      toast.success(locale === "en" ? "product has been deleted successfully!" : "تم حذف المنتج بنجاح")
      const { data: productData } = await axios(`/GetFolderById?id=${id}&lang=${locale}`)
      setProducts(productData.data.listProduct)
    } catch (error) {
      Alerto(error)
    }
  }

  return (
    <Fragment>
      <ViewProducts
        products={products && products}
        setProductsIds={setProductsIds}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <div className="btns_fixeds">
        <button
          className="btn-main rounded-0"
          aria-label={pathOr("", [locale, "Products", "remove_product_from_folder"], t)}
          onClick={handleRemoveProductFromFolder}
        >
          {pathOr("", [locale, "Products", "remove_product_from_folder"], t)}
        </button>
      </div>
    </Fragment>
  )
}

export default SingleFolder

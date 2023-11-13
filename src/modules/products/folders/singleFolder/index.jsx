import React, { useState, useMemo, useEffect, Fragment } from "react"
import ViewProducts from "../../viewProducts"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import axios from "axios"
import { pathOr } from "ramda"
import t from "../../../../translations.json"

const SingleFolder = ({ data }) => {
  const { locale } = useRouter()
  const [products, setProducts] = useState()
  const [productsIds, setProductsIds] = useState([])
  const [selectedRows, setSelectedRows] = useState({})
  const router = useRouter()
  const id = router.query.id

  const getSingleFolder = async () => {
    const {
      data: { data: getSingleFolder },
    } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/GetFolderById?id=${id}&lang=${locale}`)
    setProducts(getSingleFolder.listProduct)
  }

  useEffect(() => {
    if (router && router.query) {
      id && getSingleFolder()
    }
  }, [router])

  const handleRemoveProductFromFolder = async () => {
    if (!productsIds?.length)
      return toast.warning(locale === "en" ? "No product was selected!" : "لم يتم اختيار اي منتج")
    try {
      await axios.delete(process.env.NEXT_PUBLIC_API_URL + `/RemoveListProductsFolder`, {
        data: { folderId: Number(id), prductsIds: productsIds },
      })

      toast.success(locale === "en" ? "product has been deleted successfully!" : "تم حذف المنتج بنجاح")

      const { data: productData } = await axios(
        `${process.env.NEXT_PUBLIC_API_URL}/GetFolderById?id=${id}&lang=${locale}`,
      )
      setProducts(productData.data.listProduct)
    } catch (error) {
      console.error(error)
      toast.error(error.response.data.message)
    }
  }
  console.log(productsIds)
  return (
    <Fragment>
      <ViewProducts
        products={products && products}
        setProductsIds={setProductsIds}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <div className="btns_fixeds">
        <button className="btn-main rounded-0" onClick={handleRemoveProductFromFolder}>
          {pathOr("", [locale, "Products", "remove_product_from_folder"], t)}
        </button>
      </div>
    </Fragment>
  )
}

export default SingleFolder

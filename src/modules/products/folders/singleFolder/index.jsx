import React, { useState, useMemo, useEffect } from "react"
import ViewProducts from "../../viewProducts"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import axios from "axios"

const SingleFolder = ({ data }) => {
  const { locale } = useRouter()
  const [products, setProducts] = useState()
  const [productsIds, setProductsIds] = useState([])
  const router = useRouter()
  const id = router.query.id

  const getSingleFolder =async() => {
 const { data: { data: getSingleFolder }} = await axios(`${process.env.REACT_APP_API_URL}/GetFolderById?id=${id}&lang=${locale}`) 
  setProducts(getSingleFolder.listProduct)
  }

  useEffect(()=>{
    console.log(router.isReady)
    if(router&&router.query){
      id && getSingleFolder();
      }
  },[router])

  const handleRemoveProductFromFolder = async () => {
    if (!productsIds?.length)
      return toast.warning(locale === "en" ? "No product was selected!" : "من فضلك قم بأضافة المنتجات")
    try {
      await axios.delete(process.env.REACT_APP_API_URL + `/RemoveListProductsFolder`,{ 
        data: {   folderId: Number(id),
          prductsIds:productsIds },
        })

      toast.success(locale === "en" ? "product has been deleted successfully!" : "تم حذف المنتج بنجاح")

      const { data: productData } = await axios(`${process.env.REACT_APP_API_URL}/GetFolderById?id=${id}&lang=${locale}`)
      setProducts(productData.data.listProduct)
    } catch (error) {
      console.error(error)
      toast.error(error.response.data.message)
    }
  }
  return (
    <>
      <ViewProducts products={products && products} setProductsIds={setProductsIds} />
      <div className="btns_fixeds">
        <button className="btn-main rounded-0" onClick={handleRemoveProductFromFolder}>
          ازالة المنتج من المجلد
        </button>
      </div>
    </>
  )
}

export default SingleFolder

import AddProduct from "../../../modules/products/add"
import Head from "next/head"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { useRouter } from "next/router"

const AddProductPage = () => {
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "addProduct"], t)}</title>
      </Head>
      <AddProduct />
    </>
  )
}

export default AddProductPage

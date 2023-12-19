import dynamic from "next/dynamic"
import Head from "next/head"
import { pathOr } from "ramda"
import t from "../../translations.json"
import { useRouter } from "next/router"

const Products = dynamic(() => import("../../modules/products/index.jsx"), { ssr: false })

const ProductsPage = () => {
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Products"], t)}</title>
      </Head>
      <Products />
    </>
  )
}

export default ProductsPage

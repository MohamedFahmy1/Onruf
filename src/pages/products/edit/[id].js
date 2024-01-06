import EditProduct from "../../../modules/products/edit-repost"
import Head from "next/head"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { useRouter } from "next/router"

const EditPage = () => {
  const { locale } = useRouter()
  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "editProduct"], t)}</title>
      </Head>
      <EditProduct />
    </main>
  )
}

export default EditPage

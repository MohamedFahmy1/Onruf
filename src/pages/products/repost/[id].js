import EditProduct from "../../../modules/products/edit-repost"
import Head from "next/head"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { useRouter } from "next/router"

const RepostPage = () => {
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "repostProduct"], t)}</title>
      </Head>
      <EditProduct />
    </>
  )
}

export default RepostPage

import MyPoints from "../../../modules/settings/myPoints"
import Head from "next/head"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../../translations.json"

const MyPointsPage = () => {
  const { locale } = useRouter()
  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Points"], t)}</title>
      </Head>
      <MyPoints />
    </main>
  )
}

export default MyPointsPage

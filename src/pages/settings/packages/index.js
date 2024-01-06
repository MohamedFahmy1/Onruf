import Packages from "../../../modules/settings/packages"
import Head from "next/head"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../../translations.json"

const PackagesPage = () => {
  const { locale } = useRouter()
  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Packages"], t)}</title>
      </Head>
      <Packages />
    </main>
  )
}

export default PackagesPage

import Packages from "../../../modules/settings/packages"
import Head from "next/head"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../../translations.json"

const PackagesPage = (props) => {
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Packages"], t)}</title>
      </Head>
      <Packages />
    </>
  )
}

export default PackagesPage

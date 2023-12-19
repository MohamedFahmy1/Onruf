import { useRouter } from "next/router"
import t from "../../translations.json"
import Marketing from "../../modules/marketing"
import Head from "next/head"
import { pathOr } from "ramda"

const MarketingPage = () => {
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Marketing"], t)}</title>
      </Head>
      <Marketing />
    </>
  )
}

export default MarketingPage

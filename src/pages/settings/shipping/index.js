import Shipping from "../../../modules/settings/Shipping"
import Head from "next/head"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../../translations.json"

const ShippingPage = (props) => {
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Shipping"], t)}</title>
      </Head>
      <Shipping />
    </>
  )
}

export default ShippingPage

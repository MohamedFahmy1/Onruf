import NegotiationOffers from "../../modules/negotiation"
import Head from "next/head"
import { pathOr } from "ramda"
import t from "../../translations.json"
import { useRouter } from "next/router"

const NegotiationPage = () => {
  const { locale } = useRouter()
  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Negotiation"], t)}</title>
      </Head>
      <NegotiationOffers />
    </main>
  )
}

export default NegotiationPage

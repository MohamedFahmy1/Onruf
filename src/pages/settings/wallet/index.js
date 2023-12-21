import Wallet from "../../../modules/settings/wallet"
import Head from "next/head"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../../translations.json"

const WalletPage = (props) => {
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Credit"], t)}</title>
      </Head>
      <Wallet {...props} />
    </>
  )
}

export default WalletPage

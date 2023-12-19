import Home from "../modules/home"
import Head from "next/head"
import { pathOr } from "ramda"
import t from "../translations.json"
import { useRouter } from "next/router"

export default function HomePage() {
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Home"], t)}</title>
      </Head>
      <Home />
    </>
  )
}

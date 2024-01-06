import React from "react"
import Coupons from "../../modules/coupons"
import Head from "next/head"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../translations.json"

const CouponsPage = () => {
  const { locale } = useRouter()
  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Coupons"], t)}</title>
      </Head>
      <Coupons />
    </main>
  )
}

export default CouponsPage

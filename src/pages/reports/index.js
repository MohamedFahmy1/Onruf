import React from "react"
import Reports from "../../modules/reports"
import Head from "next/head"
import { pathOr } from "ramda"
import t from "../../translations.json"
import { useRouter } from "next/router"

const ReportsPage = () => {
  const { locale } = useRouter()

  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Reports"], t)}</title>
      </Head>
      <Reports />
    </main>
  )
}

export default ReportsPage

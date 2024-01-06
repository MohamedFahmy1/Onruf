import React from "react"
import Settings from "../../modules/settings"
import Head from "next/head"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../translations.json"

const SettingsPage = () => {
  const { locale } = useRouter()
  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Settings"], t)}</title>
      </Head>
      <Settings />
    </main>
  )
}

export default SettingsPage

import React from "react"
import Folders from "../../../modules/products/folders"
import Head from "next/head"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { useRouter } from "next/router"

const FoldersPage = () => {
  const { locale } = useRouter()

  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "browseFolders"], t)}</title>
      </Head>
      <Folders />
    </main>
  )
}

export default FoldersPage

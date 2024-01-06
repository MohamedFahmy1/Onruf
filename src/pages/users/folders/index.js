import React from "react"
import Folders from "../../../modules/users/folders"
import Head from "next/head"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../../translations.json"

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

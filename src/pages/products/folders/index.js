import React, { Suspense } from "react"
import Head from "next/head"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { useRouter } from "next/router"

const Folders = React.lazy(() => import("../../../modules/products/folders"))

const FoldersPage = () => {
  const { locale } = useRouter()

  return (
    <>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "browseFolders"], t)}</title>
      </Head>
      <Suspense fallback={<div>Loading...</div>}>
        <Folders />
      </Suspense>
    </>
  )
}

export default FoldersPage

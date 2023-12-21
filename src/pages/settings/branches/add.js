import React from "react"
import AddBranch from "./../../../modules/settings/branches/AddBranch"
import Head from "next/head"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../../translations.json"

const AddNewBranch = () => {
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "AddBranch"], t)}</title>
      </Head>
      <AddBranch />
    </>
  )
}

export default AddNewBranch

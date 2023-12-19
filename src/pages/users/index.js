import React from "react"
import Users from "../../modules/users"
import Head from "next/head"
import { pathOr } from "ramda"
import t from "../../translations.json"
import { useRouter } from "next/router"

const UsersPage = () => {
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Clients"], t)}</title>
      </Head>
      <Users />
    </>
  )
}

export default UsersPage

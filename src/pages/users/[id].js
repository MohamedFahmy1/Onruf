import React from "react"
import UserDetails from "../../modules/users/userDetails"
import Head from "next/head"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../translations.json"

const UserDetailsPage = () => {
  const { locale } = useRouter()
  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "ClientDetails"], t)}</title>
      </Head>
      <UserDetails />
    </main>
  )
}

export default UserDetailsPage

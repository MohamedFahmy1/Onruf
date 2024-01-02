import React from "react"
import Orders from "../../modules/orders"
import Head from "next/head"
import { pathOr } from "ramda"
import t from "../../translations.json"
import { useRouter } from "next/router"

const OrdersPage = () => {
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Orders"], t)}</title>
      </Head>
      <Orders />
    </>
  )
}

export default OrdersPage

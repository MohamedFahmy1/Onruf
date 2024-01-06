import React from "react"
import AddCoupon from "../../modules/coupons/addCoupon"
import Head from "next/head"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../translations.json"

const AddCouponPage = () => {
  const { locale } = useRouter()
  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "addCoupon"], t)}</title>
      </Head>
      <AddCoupon />
    </main>
  )
}

export default AddCouponPage

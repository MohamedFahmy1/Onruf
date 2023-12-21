import { OrderDetails } from "../../modules/orders/orderDetails/index.jsx"
import Head from "next/head"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../translations.json"

const OrderDetailsPage = () => {
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "orderDetails"], t)}</title>
      </Head>
      <OrderDetails />
    </>
  )
}

export default OrderDetailsPage

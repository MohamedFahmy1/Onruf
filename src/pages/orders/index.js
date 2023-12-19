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

// export const getServerSideProps = async ({ query, locale = "ar" }) => {
//   const payType = query?.payType || "1"
//   const statusOrder = query?.statusOrder
//   const fromDate = query?.fromDate
//   const toDate = query?.toDate

//   try {
//     const {
//       data: { data },
//     } =
//       await axios(`${process.env.REACT_APP_API_URL}/ListNewOrderForProvider?lang=${locale}`)

//     return {
//       props: {
//         orders: data,
//       },
//     }
//   } catch (e) {
//     return {
//       props: {
//         orders: [],
//         error: JSON.stringify(e),
//       },
//     }
//   }
// }

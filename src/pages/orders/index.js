import React from "react"
import Orders from "../../modules/orders"
import axios from "axios"
import Alerto from "../../common/Alerto"

const OrdersPage = () => {
  return <Orders/>
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

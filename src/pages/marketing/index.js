import axios from "axios"
import React from "react"
import Alerto from "../../common/Alerto"
import Marketing from "../../modules/marketing"


const MarketingPage = () => {
  return <Marketing />
}

export default MarketingPage

// export async function getServerSideProps() {
//   try {
//     const { data:{data:offers}  } = await axios(
//       `${process.env.REACT_APP_API_URL}/ListAdminCoupons?currentPage=${1}&maxRows=${10}`,
//        { header:{
//         Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmRyZWQiLCJ1c2VyX2lkIjoiMDI5YWNmZGMtOTQyOS00M2RhLTgzYTctNTJhYTQ5NzZjZDY2IiwidHlwZV91c2VyIjoiMiIsImV4cCI6MTcwMzgyODk1MSwiaXNzIjoiaHR0cDovL3d3dy5zZWN1cml0eS5vcmciLCJhdWQiOiJodHRwOi8vd3d3LnNlY3VyaXR5Lm9yZyJ9.7nt9Z4fc-Nf1YxS0HAqiWEagY2f3qz1EiesLos6EjBQ",
//         "Provider-Id": "029acfdc-9429-43da-83a7-52aa4976cd66",
//       }
//     }
//     )
//     return {
//       props: {
//         offers,
//       },
//     }
//   } catch (e) {
//     return {
//       props: {
//         offers,
//         error: JSON.stringify(e),
//       },
//     }
//   }
// }

import Home from "../modules/home"
import Head from "next/head"
import { pathOr } from "ramda"
import t from "../translations.json"
import { useRouter } from "next/router"
import axios from "axios"

export default function HomePage({ sales, ListProduct, ListNewOrder, GetListUser }) {
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Home"], t)}</title>
      </Head>
      <Home sales={sales} ListProduct={ListProduct} ListNewOrder={ListNewOrder} GetListUser={GetListUser} />
    </>
  )
}
export async function getServerSideProps({ req }) {
  const parseCookies = (req) => {
    const list = {}
    const rc = req.headers.cookie
    rc &&
      rc.split(";").forEach((cookie) => {
        const parts = cookie.split("=")
        list[parts.shift().trim()] = decodeURI(parts.join("="))
      })
    return list
  }
  const cookies = parseCookies(req)
  const businessId = cookies.businessAccountId
  const authToken = cookies.Token
  const providerId = cookies.ProviderId
  if (!businessId || !authToken) {
    return { redirect: { destination: "/404", permanent: false } }
  }
  try {
    const [salesResponse, listProductResponse, listNewOrderResponse, getListUserResponse] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/SalesPrice`, {
        headers: {
          "Business-Account-Id": businessId,
          "Provider-Id": providerId,
          Authorization: authToken,
          "User-Language": "en",
          "Application-Source": "BusinessAccount",
        },
      }),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ListProductForProvider`, {
        headers: {
          "Business-Account-Id": businessId,
          "Provider-Id": providerId,
          Authorization: authToken,
          "User-Language": "en",
          "Application-Source": "BusinessAccount",
        },
      }),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ListNewOrderForProvider?lang=ar`, {
        headers: {
          "Business-Account-Id": businessId,
          "Provider-Id": providerId,
          Authorization: authToken,
          "User-Language": "en",
          "Application-Source": "BusinessAccount",
        },
      }),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/GetListUserForProvider`, {
        headers: {
          "Business-Account-Id": businessId,
          "Provider-Id": providerId,
          Authorization: authToken,
          "User-Language": "en",
          "Application-Source": "BusinessAccount",
        },
      }),
    ])
    return {
      props: {
        sales: salesResponse.data.data,
        ListProduct: listProductResponse.data.data,
        ListNewOrder: listNewOrderResponse.data.data,
        GetListUser: getListUserResponse.data.data,
      },
    }
  } catch (error) {
    return { redirect: { destination: "/404", permanent: false } }
  }
}

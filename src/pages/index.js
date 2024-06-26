import Home from "../modules/home"
import Head from "next/head"
import { pathOr } from "ramda"
import t from "../translations.json"
import { useRouter } from "next/router"
import axios from "axios"

export default function HomePage({ sales, ListProduct, ListNewOrder, GetListUser }) {
  const { locale } = useRouter()
  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Home"], t)}</title>
      </Head>
      <Home sales={sales} ListProduct={ListProduct} ListNewOrder={ListNewOrder} GetListUser={GetListUser} />
    </main>
  )
}
export async function getServerSideProps({ req, locale }) {
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
    const mainHeader = {
      "Business-Account-Id": businessId,
      "Provider-Id": providerId,
      Authorization: authToken,
      "User-Language": locale,
      "Application-Source": "BusinessAccount",
    }
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL
    const [salesResponse, listProductResponse, listNewOrderResponse, getListUserResponse] = await Promise.all([
      axios.get(`/SalesPrice`, {
        headers: mainHeader,
      }),
      axios.get(`/ListProductForProvider`, {
        headers: mainHeader,
      }),
      axios.get(`/ListNewOrderForProvider?lang=ar`, {
        headers: mainHeader,
      }),
      axios.get(`/GetListUserForProvider`, {
        headers: mainHeader,
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

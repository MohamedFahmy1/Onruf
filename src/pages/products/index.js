import Head from "next/head"
import { pathOr } from "ramda"
import t from "../../translations.json"
import { useRouter } from "next/router"
import axios from "axios"
import Products from "../../modules/products/index.jsx"

const ProductsPage = ({ products }) => {
  const { locale } = useRouter()
  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Products"], t)}</title>
      </Head>
      <Products products={products} />
    </main>
  )
}

export default ProductsPage

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
    console.error("Missing businessId or authToken")
    return { redirect: { destination: "/404", permanent: false } }
  }
  try {
    const response = await axios.get(`/ListProductByBusinessAccountId?currentPage=1&lang=${locale}`, {
      headers: {
        "Business-Account-Id": businessId,
        "Provider-Id": providerId,
        Authorization: authToken,
        "User-Language": locale,
        "Application-Source": "BusinessAccount",
      },
    })

    if (response.status !== 200) {
      console.error("Non-200 response from API", response.status)
      return { redirect: { destination: "/404", permanent: false } }
    }

    const products = response.data.data
    return {
      props: {
        products,
      },
    }
  } catch (error) {
    console.error("Error fetching products", error)
    return { redirect: { destination: "/404", permanent: false } }
  }
}

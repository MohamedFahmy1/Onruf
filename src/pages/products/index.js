import dynamic from "next/dynamic"
import Head from "next/head"
import { pathOr } from "ramda"
import t from "../../translations.json"
import { useRouter } from "next/router"
import axios from "axios"

const Products = dynamic(() => import("../../modules/products/index.jsx"), { ssr: true })

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
    return { redirect: { destination: "/404", permanent: false } }
  }
  try {
    const products = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/ListProductByBusinessAccountId?currentPage=1&lang=${locale}`,
      {
        headers: {
          "Business-Account-Id": businessId,
          "Provider-Id": providerId,
          Authorization: authToken,
          "User-Language": locale,
          "Application-Source": "BusinessAccount",
        },
      },
    )
    return {
      props: {
        products: products.data.data,
      },
    }
  } catch (error) {
    return { redirect: { destination: "/404", permanent: false } }
  }
}

import { useCallback, useEffect, useState } from "react"
import Chart from "./chart"
import Notifications from "./notifications"
import { Row } from "react-bootstrap"
import Alerto from "../../common/Alerto"
import LatestOrders from "./latestOrders"
import ProductsAlmostOut from "./productsAlmostOut"
import LatestOrdersWithClients from "./latestOrdersWithClient"
import axios from "axios"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"

const Home = ({ sales: s, ListProduct, ListNewOrder, GetListUser }) => {
  const { locale } = useRouter()
  const [almostFinishedProducts, setAlmostFinishedProducts] = useState()
  const [sales, setSales] = useState(s)
  const [products, setProducts] = useState(ListProduct)
  const [orders, setOrders] = useState(ListNewOrder)
  const [clients, setClients] = useState(GetListUser)
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)
  const getSales = useCallback(async () => {
    try {
      const {
        data: { data },
      } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/SalesPrice`)
      setSales(data)
    } catch (error) {
      Alerto(error)
    }
  }, [])

  const getProduct = useCallback(async () => {
    try {
      const {
        data: { data: products },
      } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ListProductForProvider`)
      setProducts(products)
    } catch (error) {
      Alerto(error)
    }
  }, [])

  const getOrders = useCallback(async () => {
    try {
      const {
        data: { data: orders },
      } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/ListNewOrderForProvider?lang=${locale}`)
      setOrders(orders)
    } catch (error) {
      Alerto(error)
    }
  }, [locale])

  const getClients = useCallback(async () => {
    try {
      const {
        data: { data: clients },
      } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/GetListUserForProvider`)
      setClients(clients)
    } catch (error) {
      Alerto(error)
    }
  }, [])

  useEffect(() => {
    if (buisnessAccountId) {
      getSales()
      getProduct()
      getOrders()
      getClients()
    }
  }, [buisnessAccountId, locale, getSales, getProduct, getOrders, getClients])

  useEffect(() => {
    if (products?.length === 0 || !products) {
      return setAlmostFinishedProducts()
    } else {
      let almostFinishedProducts = []
      products?.map((product) => {
        if (product.qty < 4) {
          almostFinishedProducts.push(product)
        }
        setAlmostFinishedProducts(almostFinishedProducts)
      })
    }
  }, [products])

  return (
    <article className="body-content">
      <Row>
        <Chart sales={sales && sales} />
        <Notifications />
      </Row>
      <LatestOrders orders={orders && orders} />
      <Row>
        <LatestOrdersWithClients clients={clients && clients} />
        <ProductsAlmostOut products={almostFinishedProducts && almostFinishedProducts} />
      </Row>
    </article>
  )
}

export default Home

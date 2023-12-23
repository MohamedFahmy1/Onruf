import React, { useEffect, useState } from "react"
import Chart from "./chart"
import Notifications from "./notifications"
import { Row } from "react-bootstrap"
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

  const getSales = async () => {
    const {
      data: { data: data },
    } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/SalesPrice`)
    setSales(data)
  }

  const getProduct = async () => {
    const {
      data: { data: products },
    } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ListProductForProvider`)
    setProducts(products)
  }
  const getOrders = async () => {
    const {
      data: { data: orders },
    } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/ListNewOrderForProvider?lang=${locale}`)
    setOrders(orders)
  }

  const getClients = async () => {
    const {
      data: { data: clients },
    } = await axios(`${process.env.NEXT_PUBLIC_API_URL}/GetListUserForProvider`)
    setClients(clients)
  }

  useEffect(() => {
    if (buisnessAccountId) {
      getSales()
      getProduct()
      getOrders()
      getClients()
    }
  }, [buisnessAccountId])

  useEffect(() => {
    let almostFinishedProducts = []
    products?.map((product) => {
      if (product.qty < 4) {
        almostFinishedProducts.push(product)
      }
      setAlmostFinishedProducts(almostFinishedProducts)
    })
  }, [products])

  return (
    <div className="body-content">
      <div>
        <Row>
          <Chart sales={sales && sales} />
          <Notifications />
        </Row>
        <LatestOrders orders={orders && orders} />
        <Row>
          <LatestOrdersWithClients clients={clients && clients} />
          <ProductsAlmostOut products={almostFinishedProducts && almostFinishedProducts} />
        </Row>
      </div>
    </div>
  )
}

export default Home

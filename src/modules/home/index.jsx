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

const Home = () => {
  const { locale } = useRouter()
  const router = useRouter()

  const [almostFinishedProducts, setAlmostFinishedProducts] = useState()
  const [sales, setSales] = useState()
  const [products, setProducts] = useState()
  const [orders, setOrders] = useState()
  const [clients, setClients] = useState()
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
    getSales()
    getProduct()
    getOrders()
    getClients()
  }, [buisnessAccountId])

  useEffect(() => {
    let almostFinishedProducts = []
    console.log(products)
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

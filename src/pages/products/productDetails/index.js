import Head from "next/head"
import React, { Fragment } from "react"
import EditProduct from "../../../modules/products/edit"

const ProductDetailsPage = () => {
  return (
    <Fragment>
      <Head>
        <title>تعديل منتج - اونرف</title>
      </Head>
      <EditProduct />
    </Fragment>
  )
}

export default ProductDetailsPage

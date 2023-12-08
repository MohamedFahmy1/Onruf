import Head from "next/head"
import React, { Fragment } from "react"
import EditProduct from "../../../modules/products/edit"

const EditPage = () => {
  return (
    <Fragment>
      <Head>
        <title>تعديل منتج - اونرف</title>
      </Head>
      <EditProduct />
    </Fragment>
  )
}

export default EditPage

import React, { Fragment } from "react"
import EditProduct from "../../../modules/products/edit-repost"
import Head from "next/head"

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
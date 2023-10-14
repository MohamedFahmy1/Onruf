import React from 'react'
import { Col } from 'react-bootstrap'
import { useRouter } from 'next/router'
import Link from 'next/link'
import t from '../../../translations.json'
import { pathOr } from 'ramda'
import moment from "moment"
const ProductsAlmostOut = ({ products }) => {
  const { locale } = useRouter()
  
  return (
    <Col md={6}>
      <div className="contint_paner">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <h5 className="f-b m-0">{pathOr('', [locale, 'Home', 'productsAlmostOut'], t)}</h5>
          <Link href={`/${locale}/products`} >
            <a className="main-color font-18 text-decoration-none">{pathOr('', [locale, 'Home', 'viewAll'], t)}</a>
          </Link>
        </div>

        <ul className="all_pro_cus">
          {products?.map(({ name, updatedAt, id, qty ,listMedia }) => 
          <li key={id} className="item d-flex justify-content-between my-2 border-bottom">
            <div className="d-flex align-items-center">
              <img src={listMedia[0]?.url} className="img_table" />
              <div>
                <h6 className="m-0 f-b">{name}</h6>
                <div className="gray-color">{moment(updatedAt).format("YYYY-mm-dd")}</div>
              </div>
            </div>
            <div>
              <Link href={`/edit/${id}`}><a className="main-color font-18 text-decoration-none">Edit</a></Link>
            </div>
          </li>)}
          
        </ul>
      </div>
    </Col>
  )
}

export default ProductsAlmostOut
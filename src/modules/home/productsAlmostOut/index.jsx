import React from "react"
import { Col } from "react-bootstrap"
import { useRouter } from "next/router"
import Link from "next/link"
import t from "../../../translations.json"
import { pathOr } from "ramda"
import moment from "moment"
import Image from "next/image"
const ProductsAlmostOut = ({ products }) => {
  const { locale } = useRouter()

  return (
    <Col md={6}>
      <article className="contint_paner">
        <section className="d-flex align-items-center justify-content-between mb-2">
          <h5 className="f-b m-0">{pathOr("", [locale, "Home", "productsAlmostOut"], t)}</h5>
          <Link href={`/${locale}/products`}>
            <button className="main-color font-18 text-decoration-none">
              {pathOr("", [locale, "Home", "viewAll"], t)}
            </button>
          </Link>
        </section>
        <ul className="all_pro_cus">
          {products?.map(({ name, updatedAt, id, qty, image, createdAt }) => (
            <li key={id} className="item d-flex justify-content-between my-2 border-bottom">
              <section className="d-flex align-items-center">
                <figure className="img_table">
                  <Image src={image} alt="product" width={100} height={100} />
                </figure>
                <figcaption>
                  <h6 className="m-0 f-b">{name}</h6>
                  <div className="gray-color">
                    {updatedAt ? moment(updatedAt).format("L") : moment(createdAt).format("L")}
                  </div>
                </figcaption>
              </section>
              <section>
                <h6>{pathOr("", [locale, "Home", "remaining"], t)}</h6>
                <p className="text-center main-color">{qty}</p>
              </section>
            </li>
          ))}
        </ul>
      </article>
    </Col>
  )
}

export default ProductsAlmostOut

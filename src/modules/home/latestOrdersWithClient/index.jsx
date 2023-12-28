import React from "react"
import { Col } from "react-bootstrap"
import { BsArrowLeft, BsArrowRight } from "react-icons/bs"
import { userImg } from "../../../constants"
import Link from "next/link"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import Image from "next/image"

const LatestOrdersWithClients = ({ clients }) => {
  const { locale } = useRouter()

  return (
    <Col md={6}>
      <article className="contint_paner">
        <section className="d-flex align-items-center justify-content-between mb-2">
          <h5 className="f-b m-0">{pathOr("", [locale, "LastOrdersWithClients", "lastOrdersWithClients"], t)}</h5>
          <Link href={`/${locale}/users`}>
            <button className="main-color font-18 text-decoration-none">
              {pathOr("", [locale, "LastOrdersWithClients", "allClients"], t)}
            </button>
          </Link>
        </section>
        <ul className="all_pro_cus">
          {Boolean(clients && clients?.length) &&
            clients.map((client, idx) => (
              <li className="item d-flex justify-content-between my-5 border-bottom" key={idx}>
                <section className="d-flex align-items-center">
                  {/* <img src={client.imgProfile} className="img_table img_table2" /> */}
                  <figure className="img_table img_table2">
                    <Image src={client.imgProfile} alt="client" width={100} height={100} />
                  </figure>
                  <figcaption>
                    <h6 className="m-0 f-b">{client.userName}</h6>
                    <p className="gray-color">
                      {pathOr("", [locale, "LastOrdersWithClients", "clientSince"], t)} 1/1/2020
                    </p>
                  </figcaption>
                </section>
                <Link href={`/${locale}/users/${client.id}`}>
                  <button className="main-color text-decoration-none">
                    <p>{pathOr("", [locale, "LastOrdersWithClients", "clientProfile"], t)}</p>
                    {locale === "en" ? <BsArrowRight size={25} /> : <BsArrowLeft size={25} />}
                  </button>
                </Link>
              </li>
            ))}
        </ul>
      </article>
    </Col>
  )
}

export default LatestOrdersWithClients

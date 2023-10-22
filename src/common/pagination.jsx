import React from "react"
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io"
import Link from "next/link"
import Router, { useRouter } from "next/router"

const Pagination = ({ listLength, pageSize = 10 }) => {
  const route = Router?.router?.state
  const page = route?.query?.page || 1
  const length = Math.ceil(listLength / pageSize)

  const router = useRouter()
  const { locale } = useRouter()

  return (
    <nav aria-label="Page navigation example" className="mt-3">
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <Link
            aria-label="Previous"
            href={`${router.query.id || router.pathname}?page=${+page === 1 ? page : +page - 1}`}
          >
            <a className="page-link">{locale === "en" ? <IoIosArrowBack /> : <IoIosArrowForward />}</a>
          </Link>
        </li>
        {Array.from({ length }, (_, n) => n).map((p, index) => (
          <li className="page-item" key={p}>
            <Link href={`${route?.pathname}?page=${p + 1}`}>
              <a className={`page-link ${+page === index + 1 ? "active" : ""}`}>{p + 1}</a>
            </Link>
          </li>
        ))}
        <li className="page-item">
          <Link
            href={`${router.query.id || router.pathname}?page=${+page === length ? page : +page + 1}`}
            aria-label="Next"
          >
            <a className="page-link">{locale === "ar" ? <IoIosArrowBack /> : <IoIosArrowForward />}</a>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination

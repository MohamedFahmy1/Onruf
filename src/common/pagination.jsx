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
    <nav aria-label="Page navigation" className="mt-3">
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <Link href={`${router.query.id || router.pathname}?page=${+page === 1 ? page : +page - 1}`}>
            <button className="page-link" aria-label={`Go to page ${+page - 1}`}>
              {locale === "en" ? <IoIosArrowBack /> : <IoIosArrowForward />}
            </button>
          </Link>
        </li>
        {Array.from({ length }, (_, n) => n).map((p, index) => (
          <li className="page-item" key={p}>
            <Link href={`${route?.pathname}?page=${p + 1}`}>
              <button className={`page-link ${+page === index + 1 ? "active" : ""}`} aria-label={`Go to page ${p + 1}`}>
                {p + 1}
              </button>
            </Link>
          </li>
        ))}
        <li className="page-item">
          <Link href={`${router.query.id || router.pathname}?page=${+page === length ? page : +page + 1}`}>
            <button className="page-link" aria-label={`Go to page ${+page + 1}`}>
              {locale === "ar" ? <IoIosArrowBack /> : <IoIosArrowForward />}
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination

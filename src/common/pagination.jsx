import React from "react"
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io"
import Link from "next/link"
import { useRouter } from "next/router"

const Pagination = ({ listLength, pageSize = 10 }) => {
  const router = useRouter()
  const page = parseInt(router.query.page) || 1
  const length = Math.ceil(listLength / pageSize)

  const baseUrl = router.asPath.split("?")[0]

  return (
    <nav aria-label="Page navigation" className="mt-3">
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <Link href={`${baseUrl}?page=${page === 1 ? 1 : page - 1}`}>
            <a className="page-link" aria-label={`Go to page ${page - 1}`}>
              {router.locale === "en" ? <IoIosArrowBack /> : <IoIosArrowForward />}
            </a>
          </Link>
        </li>
        {Array.from({ length }, (_, n) => n + 1).map((p) => (
          <li className="page-item" key={p}>
            <Link href={`${baseUrl}?page=${p}`}>
              <a className={`page-link ${page === p ? "active" : ""}`} aria-label={`Go to page ${p}`}>
                {p}
              </a>
            </Link>
          </li>
        ))}
        <li className="page-item">
          <Link href={`${baseUrl}?page=${page === length ? length : page + 1}`}>
            <a className="page-link" aria-label={`Go to page ${page + 1}`}>
              {router.locale === "ar" ? <IoIosArrowBack /> : <IoIosArrowForward />}
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination

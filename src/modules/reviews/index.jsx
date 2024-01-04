import { useMemo, useState, useEffect } from "react"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../translations.json"
import Comment from "./comments"
import Question from "./questions"
import axios from "axios"
import { Pagination } from "@mui/material"

const Reviews = () => {
  const {
    locale,
    query: { tab },
    push,
  } = useRouter()
  const [items, setItems] = useState({ ratings: [], questions: [] })
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/ListProviderProductsRates`, {
        params: { pageIndex: 1 },
      })
      setItems((items) => ({ ...items, ratings: response.data.data }))
    }
    const fetchQuestions = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/ListQuestionsForProductOwnerToReplyQuestion`)
      setItems((items) => ({ ...items, questions: response.data.data }))
    }
    fetchReviews()
    fetchQuestions()
  }, [])

  const filteredItems = useMemo(() => {
    const data = items[tab === "ratings" ? "ratings" : "questions"]
    if (tab === "ratings") {
      switch (selectedFilter) {
        case "Positive":
          return data.filter((item) => item.rate >= 2)
        case "Negative":
          return data.filter((item) => item.rate < 2)
        default:
          return data
      }
    }
    return data
  }, [items, tab, selectedFilter])

  const totalPages = Math.ceil(filteredItems.length / pageSize)
  const currentData = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handlePageChange = (event, value) => setCurrentPage(value)

  const renderItems = () =>
    currentData.map((item) =>
      tab === "ratings" ? <Comment key={item.id} {...item} /> : <Question key={item.id} {...item} />,
    )

  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0 fs-5">
            {`${pathOr("", [locale, "questionsAndReviews", tab], t)} (${filteredItems.length})`}
          </h6>
        </div>
        <div className="d-flex mb-3">
          <ul className="nav nav-pills" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                role="tab"
                className={tab === "ratings" ? "nav-link active" : "nav-link"}
                type="button"
                aria-selected={tab === "ratings"}
                onClick={() => push({ query: { tab: "ratings" } })}
              >
                {pathOr("", [locale, "questionsAndReviews", "ratings"], t)}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                role="tab"
                className={tab === "questions" ? "nav-link active" : "nav-link"}
                type="button"
                aria-selected={tab === "questions"}
                onClick={() => push({ query: { tab: "questions" } })}
              >
                {pathOr("", [locale, "questionsAndReviews", "questions"], t)}
              </button>
            </li>
          </ul>
        </div>
        {tab === "ratings" && (
          <div className="filtter_1">
            <button
              className={selectedFilter === "All" ? "btn-main active" : "btn-main"}
              onClick={() => {
                setSelectedFilter("All")
                setCurrentPage(1)
              }}
            >
              {pathOr("", [locale, "questionsAndReviews", "all"], t)}
            </button>
            <button
              className={selectedFilter === "Positive" ? "btn-main active" : "btn-main"}
              onClick={() => {
                setSelectedFilter("Positive")
                setCurrentPage(1)
              }}
            >
              {pathOr("", [locale, "questionsAndReviews", "positive"], t)}
            </button>
            <button
              className={selectedFilter === "Negative" ? "btn-main active" : "btn-main"}
              onClick={() => {
                setSelectedFilter("Negative")
                setCurrentPage(1)
              }}
            >
              {pathOr("", [locale, "questionsAndReviews", "negative"], t)}
            </button>
          </div>
        )}
        <div className="tab-content">
          <div className="tab-pane fade show active">
            <div>{renderItems()}</div>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              sx={{ my: 2, p: 2, ".MuiPagination-ul": { justifyContent: "center" } }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Reviews

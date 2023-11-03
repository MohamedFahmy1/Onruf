import React, { useState } from "react"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../translations.json"
import Comment from "./comments"
import Question from "./questions"
import { useEffect } from "react"
import axios from "axios"
const Reviews = () => {
  const router = useRouter()
  const { locale } = useRouter()
  const [productReviews, setProductReviews] = useState()
  const [productQuestions, setProductQuestions] = useState([])
  const [selectedFilter, setSelectedFilter] = useState("All")
  const getProductReviews = async () => {
    const {
      data: { data: data },
    } = await axios.get(process.env.REACT_APP_API_URL + "/ListProviderProductsRates", {
      params: { pageIndex: 1 },
    })
    console.log(data)
    setProductReviews(data)
  }
  const getProductQuestions = async () => {
    const {
      data: { data: productQuestions },
    } = await axios.get(process.env.REACT_APP_API_URL + "/ListQuestions?pageIndex=1&PageRowsCount=50")

    setProductQuestions(productQuestions)
  }

  useEffect(() => {
    getProductReviews()
    getProductQuestions()
  }, [])

  const positiveReviews = productReviews?.filter((rev) => rev.rate >= 2)
  const negativeReviews = productReviews?.filter((rev) => rev.rate < 2)

  const handleSubModule = () => {
    switch (router.query.tab) {
      case "reviews":
        return (
          <div className="tab-content" id="pills-tabContent">
            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
              <div>
                <div className="filtter_1">
                  <button
                    className={selectedFilter === "All" ? "btn-main active" : "btn-main"}
                    onClick={() => setSelectedFilter("All")}
                  >
                    {pathOr("", [locale, "questionsAndReviews", "all"], t)}
                  </button>
                  <button
                    className={selectedFilter === "Negative" ? "btn-main active" : "btn-main"}
                    onClick={() => setSelectedFilter("Negative")}
                  >
                    {pathOr("", [locale, "questionsAndReviews", "negative"], t)}
                  </button>
                  <button
                    className={selectedFilter === "Positive" ? "btn-main active" : "btn-main"}
                    onClick={() => setSelectedFilter("Positive")}
                  >
                    {pathOr("", [locale, "questionsAndReviews", "positive"], t)}
                  </button>
                </div>
                {selectedFilter === "All" && productReviews?.map((review) => <Comment key={review.id} {...review} />)}
                {selectedFilter === "Positive" &&
                  positiveReviews?.map((review) => <Comment key={review.id} {...review} />)}
                {selectedFilter === "Negative" &&
                  negativeReviews?.map((review) => <Comment key={review.id} {...review} />)}
              </div>
            </div>
          </div>
        )
      case "questions":
        return (
          <div className="tab-content" id="pills-tabContent-2">
            <div
              className="tab-pane fade show active"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              <div>
                <div className="filtter_1">
                  <button className="btn-main active">{pathOr("", [locale, "questionsAndReviews", "all"], t)}</button>
                  <button className="btn-main">{pathOr("", [locale, "questionsAndReviews", "negative"], t)}</button>
                  <button className="btn-main">{pathOr("", [locale, "questionsAndReviews", "positive"], t)}</button>
                </div>
                {console.log(productQuestions)}
                {productQuestions?.length > 0 &&
                  productQuestions?.map((question) => <Question key={question.id} {...question} />)}
              </div>
            </div>
          </div>
        )
      default:
        break
    }
  }

  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0 fs-5">
            {pathOr("", [locale, "questionsAndReviews", "ratings"], t)} ({productReviews?.length})
          </h6>
        </div>
        <div className="d-flex mb-3">
          <ul
            className="nav nav-pills"
            id="pills-tab"
            role="tablist"
            style={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.2)" }}
          >
            <li className="nav-item" role="presentation">
              <button
                className={router.query.tab === "reviews" ? "nav-link active" : "nav-link"}
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
                onClick={() =>
                  router.push({
                    query: {
                      tab: "reviews",
                    },
                  })
                }
              >
                {pathOr("", [locale, "questionsAndReviews", "ratings"], t)}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={router.query.tab === "questions" ? "nav-link active" : "nav-link"}
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
                onClick={() =>
                  router.push({
                    query: {
                      tab: "questions",
                    },
                  })
                }
              >
                {pathOr("", [locale, "questionsAndReviews", "questions"], t)}
              </button>
            </li>
          </ul>
        </div>
        {handleSubModule()}
      </div>
    </div>
  )
}

export default Reviews

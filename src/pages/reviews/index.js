import React from "react"
import Reviews from "../../modules/reviews"
import Head from "next/head"
import { pathOr } from "ramda"
import t from "../../translations.json"
import { useRouter } from "next/router"

const EvaluationAndQuestionsPage = () => {
  const { locale } = useRouter()

  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Ratings"], t)}</title>
      </Head>
      <Reviews />
    </main>
  )
}

export default EvaluationAndQuestionsPage

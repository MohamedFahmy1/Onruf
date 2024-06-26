import React from "react"
import Branches from "../../../modules/settings/branches"
import Head from "next/head"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../../translations.json"

const BranchesPage = ({ branches }) => {
  const { locale } = useRouter()
  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Branches"], t)}</title>
      </Head>
      <Branches />
    </main>
  )
}

export default BranchesPage

// export const getServerSideProps = async ({ query, locale = "ar" }) => {
//   let getBranches = []
//   try {
//     const {
//       data: { data },
//     } = await axios(`/GetListBranche?lang=${locale}`)
//     getBranches = data
//   } catch (error) {
//     console.error({ error }, "getBranches query")
//   } finally {
//     return {
//       props: {
//         branches: getBranches,
//       },
//     }
//   }
// }

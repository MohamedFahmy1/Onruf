import EditEmployee from "./../../../../modules/settings/employees/editEmployee"
import Head from "next/head"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../../../translations.json"

const EditEmployeePage = (props) => {
  const { locale } = useRouter()
  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "EditEmployee"], t)}</title>
      </Head>
      <EditEmployee {...props} />
    </main>
  )
}

export default EditEmployeePage

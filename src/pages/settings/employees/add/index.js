import AddEmployee from "../../../../modules/settings/employees/addEmployee"
import Head from "next/head"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../../../translations.json"

const AddEmployeePage = (props) => {
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "AddEmployee"], t)}</title>
      </Head>
      <AddEmployee {...props} />
    </>
  )
}

export default AddEmployeePage

import Employees from "../../../modules/settings/employees"
import Head from "next/head"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import t from "../../../translations.json"

const EmployeesPage = () => {
  const { locale } = useRouter()
  return (
    <>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Employees"], t)}</title>
      </Head>
      <Employees />
    </>
  )
}

export default EmployeesPage

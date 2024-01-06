import { pathOr } from "ramda"
import t from "../../../translations.json"
import { useRouter } from "next/router"
import Head from "next/head"
import EditBussinessAccount from "../../../modules/settings/editAccount"
const EditBussinessAccountPage = () => {
  const { locale } = useRouter()

  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "editAccount"], t)}</title>
      </Head>
      <EditBussinessAccount />
    </main>
  )
}
export default EditBussinessAccountPage

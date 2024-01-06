import Options from "./options"
import PaymentCards from "./payment"
import ProfileCard from "./profileCard"
import { Row } from "react-bootstrap"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../translations.json"
import { useSelector } from "react-redux"
import { useFetch } from "../../hooks/useFetch"

const Settings = () => {
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)
  const { locale } = useRouter()
  const { data: bankTransfers } = useFetch("/ListBankTransfers?currentPage=1")
  const { data: userWalletState = {} } = useFetch("/GetUserWalletTransactions")
  const { data: accountData = {} } = useFetch(`/GetBusinessAccountById?businessAccountId=${buisnessAccountId}`)
  return (
    <article className="body-content">
      <section className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
        <h6 className="f-b m-0">{pathOr("", [locale, "Settings", "settings"], t)}</h6>
      </section>
      <Row>
        <ProfileCard {...accountData} />
        <PaymentCards bankTransfers={bankTransfers} />
      </Row>
      <Options userWalletState={userWalletState} />
    </article>
  )
}

export default Settings

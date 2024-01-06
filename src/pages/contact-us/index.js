import { pathOr } from "ramda"
import t from "../../translations.json"
import Head from "next/head"
import ContactUS from "../../modules/contact-us"
import { useRouter } from "next/router"

const ContactUSPage = () => {
  const { locale } = useRouter()

  return (
    <main>
      <Head>
        <title>{pathOr("", [locale, "websiteTitles", "Contact"], t)}</title>
      </Head>
      <ContactUS />
    </main>
  )
}

export default ContactUSPage

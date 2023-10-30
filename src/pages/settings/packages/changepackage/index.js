import { pathOr } from "ramda"
import { Fragment, useState, useEffect } from "react"
import t from "../../../../translations.json"
import { toast } from "react-toastify"
import axios from "axios"
import { useRouter } from "next/router"
import PaymentModal from "../../../../modules/settings/packages/PaymentModal"

const ChangePackage = () => {
  const [packages, setPackages] = useState([])
  const [paymentModal, setPaymentModal] = useState(false)
  const [selectedPaka, setSelectedPaka] = useState(null)
  const { locale } = useRouter()

  // Loop through an object and filter couple of keys ex: image, id and then remove all empty keys...
  const mapAndRenderOnObject = (object) => {
    let resultObject = {}
    Object.keys(object).map((key, idx) => {
      if (typeof object[key] !== "object" && isForbidenKey(key)) {
        resultObject[key] = object[key]
      } else {
        return null
      }
    })
    return resultObject
  }
  const fetchCurrentPakat = async () => {
    const {
      data: { data: CurrentPackages },
    } = await axios.get(process.env.REACT_APP_API_URL + "/GetAllPakatsList", {
      params: {
        isAdmin: true,
      },
    })
    const unsubscripedPackages = CurrentPackages.filter((item) => item.isBusinessAccountSubscriped === false)
    setPackages(unsubscripedPackages)
  }

  useEffect(() => {
    fetchCurrentPakat()
  }, [])

  // Check if key is from the forbiden Keys
  const isForbidenKey = (key) => {
    const keysList = [
      "image",
      "id",
      "isActive",
      "popular",
      "showHighLight",
      "showSupTitle",
      "totalRecords",
      "description",
      "pakaId",
      "startDate",
      "endDate",
    ]
    return !keysList.includes(key)
  }
  // Handle Subscribe Package
  const handleSubscribePackage = async (pakaID) => {
    try {
      const paymentTrans = await axios.post(
        process.env.REACT_APP_API_URL + `/PakatPaymentTransaction?pakatId=${pakaID}&typePay=CreditCard`,
      )

      // If payment success do subsribe
      if (paymentTrans.status === 200) {
        try {
          await axios.post(process.env.REACT_APP_API_URL + "/AddPakatSubcription", [pakaID])
          toast.success("You Subscribed Package!")
          setPaymentModal(false)
          fetchCurrentPakat()
        } catch (error) {
          toast.error(error.response.data.message)
        }
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  // Re-usable paka card
  const PackageCard = ({ paka, isCurrent }) => {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="box-Bouquet">
          <div
            className={`head`}
            style={{
              backgroundColor: paka.popular ? "var(--main)" : undefined,
            }}
          >
            <img src={paka.image} width={48} alt={`Package ${paka.name}`} />
            <div>{paka.name}</div>
            <div>
              {paka.price} {pathOr("", [locale, "Products", "currency"], t)}
            </div>
          </div>
          <ul className="info">
            {Object.keys(mapAndRenderOnObject(paka)).map((key, idx) => {
              return (
                <li key={idx} className="text-center">
                  {pathOr("", [locale, "Packages", key], t)}:{" "}
                  {typeof paka[key] === "boolean" ? JSON.stringify(paka[key]) : paka[key]}
                </li>
              )
            })}
          </ul>
          {paka.popular ? (
            <aside
              className="Tinf"
              style={{
                display: "unset",
              }}
            >
              {pathOr("", [locale, "Packages", "popular"], t)}
            </aside>
          ) : (
            <Fragment></Fragment>
          )}
          <input type="radio" name="Bouquet-SMS" checked={paka.id === selectedPaka} />
          <span className="check">
            <i className="fas fa-check-circle"></i>
          </span>
          <span className="pord"></span>
        </div>
        <button
          className={`btn-main`}
          style={{ width: "100%" }}
          onClick={() => {
            console.log(paka)
            setSelectedPaka(paka.id)
            setPaymentModal(true)
          }}
        >
          {pathOr("", [locale, "Packages", "subscribe"], t)}
        </button>
      </div>
    )
  }
  return (
    <div className="m-5">
      <div>
        <h6 className="f-b m-0 fs-5">{pathOr("", [locale, "Packages", "ChoosePaka"], t)}</h6>
      </div>
      <div className="outer_boxsBouquet">
        {packages?.map((paka, idx) => (
          <PackageCard isCurrent={true} paka={paka} key={idx} />
        ))}
      </div>
      <PaymentModal
        showModal={paymentModal}
        setShowModal={setPaymentModal}
        pakaID={selectedPaka}
        handleSubscribePackage={handleSubscribePackage}
      />
    </div>
  )
}

export default ChangePackage

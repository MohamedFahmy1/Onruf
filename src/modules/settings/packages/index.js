import React, { Fragment, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import axios from "axios"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import PaymentModal from "./PaymentModal"
import { formatDate } from "../../../common/functions"
import { AiFillCheckCircle } from "react-icons/ai"
const Packages = () => {
  const { locale, push } = useRouter()
  const [selectedPaka, setSelectedPaka] = useState(null)
  const [paymentModal, setPaymentModal] = useState(false)
  const [PublishPakat, setPublishPakat] = useState([])
  const [CurrentPakat, setCurrentPakat] = useState([])
  const [SMSPakat, setSMSPakat] = useState([])
  const providerId = useSelector((state) => state.authSlice.providerId)

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

  const fetchSMSPakat = async () => {
    const {
      data: { data: SMSPakat },
    } = await axios.get(process.env.REACT_APP_API_URL + "/GetAllPakatsList", {
      params: {
        isAdmin: false,
        PakatType: "SMS",
      },
    })

    setSMSPakat(SMSPakat)
  }

  const fetchPublishPakat = async () => {
    const {
      data: { data: PublishPakat },
    } = await axios.get(process.env.REACT_APP_API_URL + "/GetAllPakatsList", {
      params: {
        isAdmin: false,
        PakatType: "Publish",
      },
    })
    setPublishPakat(PublishPakat)
  }

  const fetchCurrentPakat = async () => {
    const {
      data: { data: CurrentPakat },
    } = await axios.get(process.env.REACT_APP_API_URL + "/GetClientSubcripePakats", {
      params: {
        clientId: providerId,
      },
    })
    setCurrentPakat(CurrentPakat)
  }

  useEffect(() => {
    fetchSMSPakat()
    fetchPublishPakat()
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
      //     const paymentTrans = await axios.post(process.env.REACT_APP_API_URL + "/PakatPaymentTransaction", {
      //       params: {
      //         pakatId: pakaID,
      //         typePay: "Cash",
      //       },
      //     })

      // If payment success do subsribe
      // if (paymentTrans.status === 200) {
      try {
        await axios.post(process.env.REACT_APP_API_URL + "/AddPakatSubcription", [pakaID])
        toast.success(locale === "en" ? "You Subscribed To Package!" : "!تم الاشتراك  بالباقة بنجاح")
        setPaymentModal(false)
        fetchCurrentPakat()
        fetchPublishPakat()
        fetchSMSPakat()
      } catch (error) {
        toast.error(error.response.data.message)
      }
      // }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  const handlePackageRenew = async (pakaID, id) => {
    try {
      const params = {
        PakatSubsriptionId: id,
        pakatId: pakaID,
      }
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/RenewPaka`, {}, { params: params })
      toast.success(locale === "en" ? "You Renewed Package!" : "!تم تجديد الباقة بنجاح")
      setPaymentModal(false)
      fetchCurrentPakat()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  // Re-usable paka card
  const PackageCard = ({ paka, isCurrent }) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: isCurrent ? "row" : "column",
        }}
      >
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
          <input type="checkbox" name="Bouquet-SMS" checked={paka.isBusinessAccountSubscriped || isCurrent} />
          <span className="check">
            <AiFillCheckCircle size={100} />
          </span>
          <span className="pord"></span>
        </div>
        {!isCurrent && (
          <button
            className={`btn-main`}
            style={{ width: "100%", backgroundColor: paka.isBusinessAccountSubscriped ? "#ccc" : undefined }}
            onClick={() => {
              !paka.isBusinessAccountSubscriped && setSelectedPaka(paka.id)
              handleSubscribePackage(selectedPaka)
            }}
          >
            {paka.isBusinessAccountSubscriped
              ? pathOr("", [locale, "Packages", "subsribed"], t)
              : pathOr("", [locale, "Packages", "subscribe"], t)}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="body-content">
      {/* Current Pakat */}
      <div className="mb-4">
        <div>
          <h6 className="f-b m-0">{pathOr("", [locale, "Packages", "currentPaka"], t)}</h6>
        </div>
        <div className="outer_boxsBouquet">
          {CurrentPakat?.map((paka, idx) => (
            <div className="d-flex" key={idx}>
              <PackageCard isCurrent={true} paka={paka} key={idx} />
              <div className="box-Bouquet p-4">
                <ul>
                  <li className="mb-4 d-flex justify-content-between">
                    <div>
                      <p>{pathOr("", [locale, "Packages", "lastPackageUpdate"], t)}</p>
                      <div className="f-b">{formatDate(paka.startDate)}</div>
                    </div>
                    <button className="btn-main">{pathOr("", [locale, "Orders", "download_invoice"], t)}</button>
                  </li>
                  <li className="mb-4 d-flex justify-content-between">
                    <div>
                      <p>{pathOr("", [locale, "Packages", "nextRenewalDate"], t)}</p>
                      <div className="f-b">{formatDate(paka.endDate)}</div>
                    </div>
                    <button className="btn-main btn-main-B" onClick={() => handlePackageRenew(paka.pakaId, paka.id)}>
                      {pathOr("", [locale, "Packages", "renewPaka"], t)}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* SMS Pakat */}
      <div className="mb-4">
        <div className="mb-4">
          <h3 className="f-b m-0">SMS {pathOr("", [locale, "Packages", "packages"], t)}</h3>
        </div>
        {SMSPakat?.length > 1 ? (
          <div className="outer_boxsBouquet">
            {SMSPakat?.map((paka) => (
              <PackageCard key={paka.id} paka={paka} />
            ))}
          </div>
        ) : (
          <h2 className="text-center">{pathOr("", [locale, "Packages", "noPakat"], t)}</h2>
        )}
      </div>
      <hr />
      <div className="mb-4">
        <div className="mb-4">
          <h3 className="f-b m-0">Publish {pathOr("", [locale, "Packages", "packages"], t)}</h3>
        </div>

        {PublishPakat?.length > 1 ? (
          <div className="outer_boxsBouquet">
            {PublishPakat?.map((paka) => (
              <PackageCard key={paka.id} paka={paka} />
            ))}
          </div>
        ) : (
          <h1>No Pakat to show</h1>
        )}
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

export default Packages

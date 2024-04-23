import { Fragment, useState } from "react"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import axios from "axios"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import PaymentModal from "./PaymentModal"
import { formatDate } from "../../../common/functions"
import { AiFillCheckCircle } from "react-icons/ai"
import ResponsiveImage from "../../../common/ResponsiveImage"
import Alerto from "../../../common/Alerto"
import { useFetch } from "../../../hooks/useFetch"
import { Skeleton } from "@mui/material"

const Packages = () => {
  const { locale } = useRouter()
  const providerId = useSelector((state) => state.authSlice.providerId)
  const [selectedPaka, setSelectedPaka] = useState(null)
  const [paymentModal, setPaymentModal] = useState(false)
  const { data: SMSPakat, fetchData: fetchSMSPakat } = useFetch(`/GetAllPakatsList?isAdmin=${false}&PakatType=SMS`)
  const { data: PublishPakat, fetchData: fetchPublishPakat } = useFetch(
    `/GetAllPakatsList?isAdmin=${false}&PakatType=Publish`,
  )
  const { data: CurrentPakat, fetchData: fetchCurrentPakat } = useFetch(
    `/GetClientSubcripePakats?clientId=${providerId}`,
  )

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

  const handleSubscribePackage = async (pakaID) => {
    try {
      //     const paymentTrans = await axios.post( "/PakatPaymentTransaction", {
      //       params: {
      //         pakatId: pakaID,
      //         typePay: "Cash",
      //       },
      //     })
      // If payment success do subsribe
      // if (paymentTrans.status === 200) {
      try {
        await axios.post("/AddPakatSubcription", [pakaID])
        toast.success(locale === "en" ? "You Subscribed To Package!" : "!تم الاشتراك  بالباقة بنجاح")
        setPaymentModal(false)
        fetchCurrentPakat()
        fetchPublishPakat()
        fetchSMSPakat()
      } catch (error) {
        Alerto(error)
      }
      // }
    } catch (error) {
      Alerto(error)
    }
  }
  const handlePackageRenew = async (pakaID, id) => {
    try {
      const params = {
        PakatSubsriptionId: id,
        pakatId: pakaID,
      }
      await axios.post(`/RenewPaka`, {}, { params: params })
      toast.success(locale === "en" ? "You Renewed Package!" : "!تم تجديد الباقة بنجاح")
      setPaymentModal(false)
      fetchCurrentPakat()
    } catch (error) {
      Alerto(error)
    }
  }
  // Re-usable PackageCard
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
            <ResponsiveImage imageSrc={paka.image} width={"48px"} height={"48px"} alt={`Package ${paka.name}`} />
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
          <label htmlFor="Bouquet-SMS" className="visually-hidden">
            Bouquet-SMS
          </label>
          <input
            id="Bouquet-SMS"
            type="checkbox"
            name="Bouquet-SMS"
            readOnly
            checked={paka.isBusinessAccountSubscriped || isCurrent}
          />
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
          {CurrentPakat !== undefined ? (
            CurrentPakat?.map((paka, idx) => (
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
            ))
          ) : (
            <>
              <Skeleton variant="rectangular" width={730} height={405} />
              <Skeleton variant="rectangular" width={730} height={405} />
              <Skeleton variant="rectangular" width={730} height={405} />
            </>
          )}
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
          <h2>{pathOr("", [locale, "Packages", "noPakat"], t)}</h2>
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

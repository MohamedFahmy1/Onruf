import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import axios from "axios"
import { headersJson } from "../../../../token"
import { toast } from "react-toastify"
import { Modal } from "@mui/material"

const Packages = () => {
  const { locale, push } = useRouter()
  const [selectedPaka, setSelectedPaka] = useState(null)
  const [paymentModal, setPaymentModal] = useState(false)
  const [PublishPakat, setPublishPakat] = useState([])
  const [CurrentPakat, setCurrentPakat] = useState([])
  const [SMSPakat, setSMSPakat] = useState([])

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
        PakatType: 3,
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
        PakatType: 2,
      },
    })
    setPublishPakat(PublishPakat)
  }

  const fetchCurrentPakat = async () => {
    const {
      data: { data: CurrentPakat },
    } = await axios.get(process.env.REACT_APP_API_URL + "/GetClientSubcripePakats", {
      params: {
        clientId: headersJson.headers["Provider-Id"],
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
      const paymentTrans = await axios.post(
        process.env.REACT_APP_API_URL + "/PakatPaymentTransaction",
        {},
        {
          params: {
            pakatId: pakaID,
            typePay: "Cash",
          },
        },
      )

      // If payment success do subsribe
      if (paymentTrans.status === 200) {
        try {
          await axios.post(process.env.REACT_APP_API_URL + "/AddPakatSubcription", [pakaID])
          toast.success("You Subscribed Package!")
          setPaymentModal(false)
          fetchCurrentPakat()
          fetchPublishPakat()
          fetchSMSPakat()
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
          <div className="head">
            <img src={paka.image} width={48} alt={`Package ${paka.name}`} />
            <div>{paka.name}</div>
            <div>{paka.price} EGP</div>
          </div>
          <ul className="info">
            {Object.keys(mapAndRenderOnObject(paka)).map((key, idx) => {
              return (
                <li key={idx}>
                  {pathOr("", [locale, "Packages", key], t)}:{" "}
                  {typeof paka[key] === "boolean" ? JSON.stringify(paka[key]) : paka[key]}
                </li>
              )
            })}
          </ul>
          {paka.popular ? (
            <aside className="Tinf" style={{ display: "unset" }}>
              {pathOr("", [locale, "Packages", "popular"], t)}
            </aside>
          ) : (
            <></>
          )}
          <input type="radio" name="Bouquet-SMS" checked={paka.id === selectedPaka} />
          <span className="check">
            <i className="fas fa-check-circle"></i>
          </span>
          <span className="pord"></span>
        </div>
        <button
          className={`btn-main ${paka.isBusinessAccountSubscriped || isCurrent ? "btn-main-active" : ""}`}
          style={{ width: "100%" }}
          onClick={() => {
            setSelectedPaka(paka.id)
            setPaymentModal(true)
          }}
        >
          {paka.isBusinessAccountSubscriped || isCurrent ? "Susribed" : "Subsribe"}
        </button>
      </div>
    )
  }

  return (
    <div className="body-content">
      {/* Current Pakat */}
      <div className="mb-4">
        <div>
          <h6 className="f-b m-0">باقتك الحالية</h6>
        </div>
        <div className="outer_boxsBouquet">
          {CurrentPakat?.map((paka, idx) => (
            <PackageCard isCurrent={true} paka={paka} key={idx} />
          ))}
          <div className="box-Bouquet p-4">
            <ul>
              <li className="mb-4 d-flex justify-content-between">
                <div>
                  <p>اخر تجديد للباقة</p>
                  <div className="f-b">20/11/2020</div>
                </div>
                <button className="btn-main">تحميل الفاتورة</button>
              </li>
              <li className="mb-4 d-flex justify-content-between">
                <div>
                  <p>موعد التجديد القادم</p>
                  <div className="f-b">20/11/2020</div>
                </div>
                <a href="" className="btn-main btn-main-B">
                  تغيير الباقة
                </a>
              </li>
            </ul>
          </div>
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
          <h1>No Pakat to show</h1>
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

// Confirm Subscribe & Payment
const PaymentModal = ({ showModal = true, setShowModal, pakaID, handleSubscribePackage }) => {
  const style = {
    margin: "auto",
    maxWidth: "1080px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }

  return (
    <Modal
      open={showModal}
      onClose={() => {
        setShowModal(false)
      }}
      sx={style}
      aria-labelledby="modal-manage-account"
      aria-describedby="modal-manage-account"
    >
      <div className="col-lg-12">
        <div className="contint_paner p-2">
          <div className="Payment-details" style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <div className="f-b mb-2">لديك كبون خصم</div>
              <div className="po_R overflow-hidden search_P mb-3">
                <input type="text" className="form-control" placeholder="ادخل الكبون" />
                <button className="btn-main">تفعيل</button>
              </div>
              <ul className="list_salary">
                <li>
                  <span>سعر رفع الاعلان</span> <span>1600 ر.س</span>
                </li>
                <li>
                  <span>كوبون الخصم</span> <span>1600 ر.س</span>
                </li>
                <li>
                  <span>تكلفة الباقة</span> <span>1600 ر.س</span>
                </li>
                <li>
                  <span>الضريبة المضافة (12%)</span> <span>1600 ر.س</span>
                </li>
                <li>
                  <span>الاجمالي</span> <span className="f-b">1600 ر.س</span>
                </li>
              </ul>
            </div>
            <div style={{ flex: 1 }}>
              <div className="f-b mb-2">طرق الدفع</div>
              <div className="payment-methods">
                <label className="method_check method_check1">
                  <input type="radio" name="payment" checked />
                  <span className="bord"></span>
                  <span>فيزا / ماستر كارد</span>
                </label>
                <div className="info-payment-methods">
                  <div className="f-b mb-1">الدفع عن طريق الفيزا</div>
                  <div className="mb-2">
                    اجمالي الطلب <span className="main-color f-b">1750 ر.س</span>
                  </div>
                  <label className="method_check rounded-pill">
                    <div>
                      <input type="radio" name="visa_num" />
                      <span className="bord rounded-pill"></span>
                      <span className="back"></span>
                      <span className="main-color">**********1410</span>
                    </div>
                    <img src="../core/imgs/MasterCard.png" width="26" />
                  </label>
                  <button className="btn-main btn-main-w border border-1 gray-color mt-2 w-100">
                    اضافة بطاقة جديدة
                  </button>
                </div>

                <label className="method_check">
                  <input checked type="radio" name="payment" />
                  <span className="bord"></span>
                  <span>Cash on delivery</span>
                </label>
              </div>
              <button
                className="btn-main mt-2 w-100"
                data-bs-toggle="modal"
                data-bs-target="#add-product_"
                onClick={() => handleSubscribePackage(pakaID)}
              >
                اشتراك{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default Packages

import { Fragment, useState } from "react"
import { Modal } from "react-bootstrap"
import t from "../../translations.json"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import { Alerto } from "../../common/Alerto"
import axios from "axios"
import { useFetch } from "../../hooks/useFetch"
import Image from "next/image"
import { formatDate } from "../../common/functions"
import { useForm } from "react-hook-form"
import { onlyNumbersInInputs } from "../../common/functions"
import { priceInputsStyle, priceSpansStyle, textAlignStyle } from "../../styles/stylesObjects"

const SendOfferModal = ({ sendOfferModal, setSendOfferModal, id }) => {
  const { locale } = useRouter()
  const [selectedUsers, setSelectedUsers] = useState([])
  const [step, setStep] = useState(1)
  const { data: offersData } = useFetch(`/GetBids?productId=${id}`)
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm()
  const selectedUsersHandler = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers((prev) => prev.filter((user) => user !== userId))
    } else setSelectedUsers((prev) => [...prev, userId])
  }
  const selectAllUsersHandler = () => {
    let allUsers = []
    offersData.map((item) => allUsers.push(item.userId))
    setSelectedUsers(allUsers)
  }
  const goToNextStep = () => {
    selectedUsers.length > 0
      ? setStep(2)
      : toast.warning(locale === "en" ? "Please select any client to proceed!" : "من فضلك اختر اي عميل للمتابعة")
  }
  const sendOffersHandler = async (values) => {
    const offerData = {
      ...values,
      productId: id,
      userIds: selectedUsers,
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/AddProductBidOffers`, offerData)
      toast.success(locale === "en" ? "Offer Sent Successfully!" : "تم ارسال العروض بنجاح")
      setSendOfferModal(false)
    } catch (error) {
      Alerto(error) || toast.error(error.response.data.message)
    }
  }

  return (
    <Modal
      show={sendOfferModal}
      onHide={() => setSendOfferModal(false)}
      centered
      className="unique-send-offer-modal"
      style={textAlignStyle(locale)}
    >
      {step === 1 && (
        <Fragment>
          <Modal.Header className="justify-content-end">
            <button type="button" className="btn-close" onClick={() => setSendOfferModal(false)}></button>
          </Modal.Header>
          <Modal.Body className="py-0">
            <h5 className="disc-header fs-4 text-center m-0 p-0">
              {pathOr("", [locale, "Products", "send_offer"], t)}
            </h5>
            <div className="d-flex justify-content-between my-1">
              <p className="fs-5">
                {offersData?.length} {pathOr("", [locale, "Products", "user"], t)}
              </p>
              <button className="fs-5" type="button" onClick={selectAllUsersHandler}>
                {pathOr("", [locale, "Products", "selectAll"], t)}
              </button>
            </div>
            {offersData?.map((item) => (
              <div className="justify-content-between d-flex align-items-center my-2" key={item.bidId}>
                <label className="d-flex align-items-center gap-2">
                  <Image src={item.userImage} className="img-fluid" alt="user" width={60} height={60} />
                  <div>
                    <p className="fs-6">{formatDate(item.createdAt)}</p>
                    <p className="f-b fs-5">{item.userName}</p>
                    <p>
                      {item.bidPrice} {pathOr("", [locale, "Products", "currency"], t)}
                    </p>
                  </div>
                </label>
                <input
                  type="checkbox"
                  id={item.bidId}
                  checked={selectedUsers.includes(item.userId)}
                  onChange={() => selectedUsersHandler(item.userId)}
                />
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer className="modal-footer">
            <button type="button" className="btn-main" onClick={goToNextStep}>
              {pathOr("", [locale, "Products", "next"], t)}
            </button>
          </Modal.Footer>
        </Fragment>
      )}
      {step === 2 && (
        <Fragment>
          <Modal.Header className="justify-content-end">
            <button type="button" className="btn-close" onClick={() => setSendOfferModal(false)}></button>
          </Modal.Header>
          <Modal.Body className="py-0">
            <h5 className="disc-header fs-4 text-center m-0 p-0">
              {pathOr("", [locale, "Products", "send_offer"], t)}
            </h5>
            <p className="text-center fs-5 text-secondary">
              {pathOr("", [locale, "Products", "please_write_price_quantity"], t)}
            </p>
            <form onSubmit={handleSubmit(sendOffersHandler)}>
              <div
                className={`input-group d-flex flex-nowrap my-3`}
                style={{ flexDirection: locale === "en" ? "row" : "row-reverse" }}
              >
                <div className="po_R flex-grow-1">
                  <input
                    type="number"
                    onKeyDown={(e) => onlyNumbersInInputs(e)}
                    placeholder={pathOr("", [locale, "Products", "write_price"], t)}
                    className={`form-control`}
                    style={{ ...priceInputsStyle(locale), ...textAlignStyle(locale) }}
                    required
                    {...register("price", { required: pathOr("", [locale, "Products", "write_price"], t) })}
                  />
                </div>
                <span className={`input-group-text main-color f-b`} style={priceSpansStyle(locale)} id="basic-addon1">
                  {pathOr("", [locale, "Products", "currency"], t)}
                </span>
              </div>
              {errors.price && <p className="errorMsg text-center">{errors.price.message}</p>}
              <input
                className="form-control my-3"
                placeholder={pathOr("", [locale, "Products", "write_quantity"], t)}
                onKeyDown={(e) => onlyNumbersInInputs(e)}
                style={textAlignStyle(locale)}
                type="number"
                required
                {...register("quantity", { required: pathOr("", [locale, "Products", "write_quantity"], t) })}
              />
              {errors.quantity && <p className="errorMsg text-center">{errors.quantity.message}</p>}
              <select
                defaultValue={""}
                className="form-control form-select my-4"
                style={textAlignStyle(locale)}
                {...register("offerExpireHours", {
                  validate: (value) =>
                    value !== "" || pathOr("", [locale, "negotiation", "please_select_expiration_hours"], t),
                })}
              >
                <option hidden disabled value={""}>
                  {pathOr("", [locale, "negotiation", "please_select_expiration_hours"], t)}
                </option>
                <option value="3">3</option>
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
              </select>
              {errors.offerExpireHours && <p className="errorMsg text-center">{errors.offerExpireHours.message}</p>}
            </form>
          </Modal.Body>
          <Modal.Footer className="modal-footer">
            <button type="submit" className="btn-main" onClick={handleSubmit(sendOffersHandler)}>
              {pathOr("", [locale, "Products", "send_offer"], t)}
            </button>
          </Modal.Footer>
        </Fragment>
      )}
    </Modal>
  )
}

export default SendOfferModal

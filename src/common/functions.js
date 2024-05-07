import axios from "axios"
import { token } from "../../token"
import t from "../translations.json"
import { pathOr } from "ramda"
import { BsEmojiAngry, BsEmojiGrin, BsEmojiSmile } from "react-icons/bs"

export const formatDate = (date) => {
  const year = new Date(date)?.getFullYear()
  // Months start from 0
  const month = new Date(date)?.getMonth()?.toString().padStart(2, "0")
  const day = new Date(date)?.getDate()?.toString().padStart(2, "0")
  return ` ${day}/${+month + 1}/${year}`
}
export const minDate = () => {
  const dateIntoArray = formatDate(new Date()).split("/")
  return `${dateIntoArray[2]}-${dateIntoArray[1]}-${dateIntoArray[0].trim()}`
}
export const onlyNumbersInInputs = (e) => {
  if (
    !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Backspace", "Delete", "ArrowRight", "ArrowLeft"].includes(
      e.key,
    )
  ) {
    e.preventDefault()
  }
}

export const fetch = (url) => {
  return axios(url, {
    headers: {
      Authorization: "Bearer " + token,
      "Access-Control-Allow-Origin": "*",
    },
  })
}

export const handleFormErrors = (errors, name) => {
  return errors[name] && errors[name].message
}

export const orderStatusTranslate = (statusFromApi, locale) => {
  switch (statusFromApi) {
    case "Waiting For Payment":
      return pathOr("", [locale, "Orders", "waiting_for_payment"], t)
    case "Waiting For Review":
      return pathOr("", [locale, "Orders", "waiting_for_review"], t)
    case "In Progress":
      return pathOr("", [locale, "Orders", "in_progress"], t)
    case "Ready For Delivery":
      return pathOr("", [locale, "Orders", "ready_for_delivery"], t)
    case "Delivery In Progress":
      return pathOr("", [locale, "Orders", "delivery_in_progress"], t)
    case "Delivered":
      return pathOr("", [locale, "Orders", "delivered"], t)
    case "Canceled":
      return pathOr("", [locale, "Orders", "canceled"], t)
    default:
      if (statusFromApi?.match(/payment/gi) || statusFromApi === "بانتظار الدفع") {
        return pathOr("", [locale, "Orders", "waiting_for_payment"], t)
      } else if (statusFromApi?.match(/review/gi) || statusFromApi === "بانتظار المراجعة") {
        return pathOr("", [locale, "Orders", "waiting_for_review"], t)
      } else if (statusFromApi?.match(/in progress/gi) || statusFromApi === "فى تقدم") {
        return pathOr("", [locale, "Orders", "in_progress"], t)
      } else if (statusFromApi?.match(/ready/gi) || statusFromApi === "جاهزة للتسليم") {
        return pathOr("", [locale, "Orders", "ready_for_delivery"], t)
      } else if (statusFromApi?.match(/delivery in/gi) || statusFromApi === "التسليم قيد التقدم") {
        return pathOr("", [locale, "Orders", "delivery_in_progress"], t)
      } else if (statusFromApi?.match(/delivered/gi) || statusFromApi === "تم تسليم الطلب") {
        return pathOr("", [locale, "Orders", "delivered"], t)
      } else if (statusFromApi?.match(/cancel/gi) || statusFromApi === "ملغية") {
        return pathOr("", [locale, "Orders", "canceled"], t)
      } else return "Unknown payment type"
  }
}

export const paymentTypesTranslation = (typeFromApi, locale) => {
  switch (typeFromApi) {
    case "1":
      return pathOr("", [locale, "Products", "cash"], t)
    case "2":
      return pathOr("", [locale, "Products", "bankTransfer"], t)
    case "3":
      return pathOr("", [locale, "Products", "creditCard"], t)
    case "4":
      return pathOr("", [locale, "Products", "mada"], t)
    default:
      if (typeFromApi?.match(/cash/gi)) {
        return pathOr("", [locale, "Products", "cash"], t)
      } else if (typeFromApi?.match(/bank/gi)) {
        return pathOr("", [locale, "Products", "bankTransfer"], t)
      } else if (typeFromApi?.match(/card/gi)) {
        return pathOr("", [locale, "Products", "creditCard"], t)
      } else if (typeFromApi?.match(/mada/gi)) {
        return pathOr("", [locale, "Products", "mada"], t)
      }
      return "Unknown payment type"
  }
}

export const orderTypesTranslation = (typeFromApi, locale) => {
  if (typeFromApi?.match(/Fixed/gi)) {
    return pathOr("", [locale, "Orders", "fixedPrice"], t)
  } else if (typeFromApi?.match(/negotiation/gi)) {
    return pathOr("", [locale, "Orders", "negotiation"], t)
  } else if (typeFromApi?.match(/auction/gi)) {
    return pathOr("", [locale, "Orders", "auction"], t)
  } else return "Unknown order type"
}
export const negotiationTypeTranslation = (dataFromApi, locale) => {
  if (dataFromApi?.match(/Expired/gi)) {
    return pathOr("", [locale, "negotiation", "expired"], t)
  } else if (dataFromApi?.match(/Canceled/gi)) {
    return pathOr("", [locale, "negotiation", "canceled"], t)
  } else if (dataFromApi?.match(/Lost/gi)) {
    return pathOr("", [locale, "negotiation", "lost"], t)
  } else if (dataFromApi?.match(/Purchased/gi)) {
    return pathOr("", [locale, "negotiation", "Purchased"], t)
  } else if (dataFromApi?.match(/New/gi)) {
    return pathOr("", [locale, "negotiation", "new"], t)
  } else if (dataFromApi?.match(/Accepted/gi)) {
    return pathOr("", [locale, "negotiation", "Accepted"], t)
  } else if (dataFromApi?.match(/Purchcased/gi)) {
    return pathOr("", [locale, "negotiation", "Purchcased"], t)
  } else if (dataFromApi?.match(/Refused/gi)) {
    return pathOr("", [locale, "negotiation", "refused"], t)
  } else return "Unknown negotiation type"
}

export const handleShowRatingEmoji = (rating) => {
  switch (rating) {
    case 1:
      return <BsEmojiAngry className="main-color mx-2" size={30} />

    case 2:
      return <BsEmojiSmile className="main-color mx-2" size={30} />

    case 3:
      return <BsEmojiGrin className="main-color mx-2" size={30} />

    default:
      return <BsEmojiSmile className="main-color mx-2" size={30} />
  }
}

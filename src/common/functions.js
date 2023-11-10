import axios from "axios"
import { token } from "../../token"
import t from "../translations.json"
import { pathOr } from "ramda"

export const formatDate = (date) => {
  const year = new Date(date)?.getFullYear()
  // Months start from 0
  const month = new Date(date)?.getMonth()?.toString().padStart(2, "0")
  const day = new Date(date)?.getDate()?.toString().padStart(2, "0")
  return ` ${day}/${+month + 1}/${year}`
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
      if (typeFromApi.match(/payment/gi)) {
        return pathOr("", [locale, "Orders", "waiting_for_payment"], t)
      } else if (typeFromApi.match(/review/gi)) {
        return pathOr("", [locale, "Orders", "waiting_for_review"], t)
      } else if (typeFromApi.match(/in progress/gi)) {
        return pathOr("", [locale, "Orders", "in_progress"], t)
      } else if (typeFromApi.match(/ready/gi)) {
        return pathOr("", [locale, "Orders", "ready_for_delivery"], t)
      } else if (typeFromApi.match(/delivery in/gi)) {
        return pathOr("", [locale, "Orders", "delivery_in_progress"], t)
      } else if (typeFromApi.match(/delivered/gi)) {
        return pathOr("", [locale, "Orders", "delivered"], t)
      } else if (typeFromApi.match(/cancel/gi)) {
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
  if (typeFromApi.match(/Fixed/gi)) {
    return pathOr("", [locale, "Orders", "fixedPrice"], t)
  } else if (typeFromApi.match(/negotiation/gi)) {
    return pathOr("", [locale, "Orders", "negotiation"], t)
  } else if (typeFromApi.match(/auction/gi)) {
    return pathOr("", [locale, "Orders", "auction"], t)
  } else return "Unknown order type"
}

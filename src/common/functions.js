import axios from "axios"
import { token } from "../../token"

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

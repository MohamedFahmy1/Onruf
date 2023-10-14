import { useEffect } from "react"
import axios from "axios"
import { UnAuthorisedPage } from "../modules/404/Unauthorised"
import Cookies from "js-cookie"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/router"
import { getTokensFromCookie } from "../appState/personalData/authActions"

export const AppWrapper = ({ children }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTokensFromCookie())
  }, [])

  const token = useSelector((state) => state.authSlice.token)
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)
  const providerId = useSelector((state) => state.authSlice.providerId)

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = token
    axios.defaults.headers.common["Provider-Id"] = providerId
    axios.defaults.headers.common["Business-Account-Id"] = buisnessAccountId

    console.log("blase", axios.defaults.headers.common)
  }, [token, providerId, buisnessAccountId])

  return <>{token && buisnessAccountId ? children : <UnAuthorisedPage />}</>
}

import { useEffect } from "react"
import axios from "axios"
import { UnAuthorisedPage } from "../modules/404/Unauthorised"
import { useSelector, useDispatch } from "react-redux"
import { getTokensFromCookie } from "../appState/personalData/authActions"
import { Fragment } from "react"

export const AppWrapper = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTokensFromCookie())
  }, [dispatch])

  const token = useSelector((state) => state.authSlice.token)
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)
  const providerId = useSelector((state) => state.authSlice.providerId)

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = token
    axios.defaults.headers.common["Provider-Id"] = providerId
    axios.defaults.headers.common["Business-Account-Id"] = buisnessAccountId
  }, [token, providerId, buisnessAccountId])

  return <Fragment>{token && buisnessAccountId ? children : <UnAuthorisedPage />}</Fragment>
}

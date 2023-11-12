import { useEffect, useState } from "react"
import axios from "axios"
import { UnAuthorisedPage } from "../modules/404/Unauthorised"
import { useSelector, useDispatch } from "react-redux"
import { getTokensFromCookie } from "../appState/personalData/authActions"
import { Fragment } from "react"
import Cookies from "js-cookie"

export const AppWrapper = ({ children }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getTokensFromCookie())
  }, [dispatch])

  const Token = useSelector((state) => state.authSlice.token)
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)
  const providerId = useSelector((state) => state.authSlice.providerId)
  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = Token
    axios.defaults.headers.common["Provider-Id"] = providerId
    axios.defaults.headers.common["Business-Account-Id"] = buisnessAccountId
  }, [Token, providerId, buisnessAccountId])

  return <Fragment>{Token && buisnessAccountId ? children : <UnAuthorisedPage />}</Fragment>
}

import axios from "axios"
import { useState, useEffect, useCallback } from "react"
import Alerto from "../common/Alerto"
import { useRouter } from "next/router"

export const useFetch = (apiPath, dynamicPage) => {
  const [data, setData] = useState()
  const {
    locale,
    query: { id },
  } = useRouter()
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${apiPath}`)
      setData(response.data.data)
    } catch (error) {
      Alerto(error)
    }
  }, [apiPath])

  useEffect(() => {
    let isMounted = true
    if (dynamicPage && isMounted) {
      id && fetchData()
    } else isMounted && fetchData()
    return () => {
      isMounted = false
    }
  }, [locale, fetchData, dynamicPage, id])

  return { data, fetchData }
}

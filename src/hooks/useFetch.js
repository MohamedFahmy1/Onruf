import axios from "axios"
import { useState, useEffect, useCallback } from "react"
import Alerto from "../common/Alerto"
import { useRouter } from "next/router"

export const useFetch = (apiPath) => {
  const [data, setData] = useState()
  const { locale } = useRouter()
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${apiPath}`)
      setData(response.data.data)
    } catch (error) {
      Alerto(error)
    }
  }, [apiPath])

  useEffect(() => {
    let isMounted = true
    isMounted && fetchData()
    return () => {
      isMounted = false
    }
  }, [locale, fetchData])

  return { data, fetchData }
}

import axios from "axios"
import { useState, useEffect, useCallback } from "react"
import Alerto from "../common/Alerto"
import { useRouter } from "next/router"
import { toast } from "react-toastify"

export const useFetch = (apiPath, dynamicPage) => {
  const [data, setData] = useState()
  const { locale, query } = useRouter()
  const id = query.id
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${apiPath}`)
      setData(response.data.data)
    } catch (error) {
      Alerto(error) || toast.error(error.response.data.message)
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

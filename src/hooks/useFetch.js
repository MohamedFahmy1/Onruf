import axios from "axios"
import { useState, useEffect } from "react"
import Alerto from "../common/Alerto"

export const useFetch = (apiPath) => {
  const [data, setData] = useState()
  const { locale } = useRouter()
  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${apiPath}`)
        if (isMounted) {
          setData(response.data.data)
        }
      } catch (error) {
        Alerto(error)
      }
    }
    fetchData()
    return () => {
      isMounted = false
    }
  }, [locale, apiPath])

  return data
}

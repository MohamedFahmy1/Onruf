import React from 'react'

const useFetch = (url = '', variables = {}, headers = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
 
  const getData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post(url, variables ,headers) 
      setData(data)
      setLoading(false)
    }catch(error){
      setLoading(false)
      setError(error)
    }
  }
  useEffect(() => {
   getData()
  }, [url])

  return [data, loading, error]
}

export default useFetch
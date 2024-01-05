import { useEffect, useState } from "react"
import { db } from "../common/firebaseConfig"

const useFirebaseData = (collectionName) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = db.collection(collectionName).onSnapshot(
      (snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setData(newData)
        setLoading(false)
      },
      (error) => {
        setError(error)
        setLoading(false)
      },
    )
    return () => unsubscribe()
  }, [collectionName])

  return { data, loading, error }
}

export default useFirebaseData

import { useEffect } from "react"
import { onMessage } from "firebase/messaging"
import { toast } from "react-toastify"
import { generateToken, messaging } from "./firebase"

const FirebaseMessaging = () => {
  useEffect(() => {
    if (messaging) {
      generateToken()
      onMessage(messaging, (payload) => {
        console.log(payload)
        showNotification(payload)
      })
    }
  }, [])

  const showNotification = (payload) => {
    console.log(payload)
    toast.info(`New message: ${payload.notification.title} - ${payload.notification.body}`)
  }

  return null
}

export default FirebaseMessaging

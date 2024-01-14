import { useCallback, useEffect } from "react"
import { getToken, onMessage } from "firebase/messaging"
import { toast } from "react-toastify"
import { messaging } from "./firebase"
import axios from "axios"
import { useSelector } from "react-redux"

const FirebaseMessaging = () => {
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)

  const generateToken = useCallback(async () => {
    const permission = await Notification.requestPermission()
    if (permission === "granted") {
      // get user token from firebase
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FCM,
      })
      if (token && buisnessAccountId) {
        // Send token to back-end
        await axios(
          `${process.env.NEXT_PUBLIC_API_URL}/ChangeAccount?businessAccountId=${buisnessAccountId}&deviceId=${token}&deviceType=BusinessAccount`,
        )
      }
    }
  }, [buisnessAccountId])

  useEffect(() => {
    if (messaging) {
      generateToken()
      onMessage(messaging, (payload) => {
        console.log(payload)
        showNotification(payload)
      })
    }
  }, [generateToken])

  const showNotification = (payload) => {
    toast.info(`New message: ${payload.notification.title} \n ${payload.notification.body}`)
  }

  return null
}

export default FirebaseMessaging

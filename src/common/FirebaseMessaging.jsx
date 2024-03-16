import { useCallback, useEffect } from "react"
import { getToken, onMessage } from "firebase/messaging"
import { toast } from "react-toastify"
import { messaging } from "./firebase"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setId } from "../appState/deviceId/reducer"

const FirebaseMessaging = () => {
  const buisnessAccountId = useSelector((state) => state.authSlice.buisnessId)
  const dispatch = useDispatch()
  const generateToken = useCallback(async () => {
    const permission = await Notification.requestPermission()
    if (permission === "granted") {
      // get user token from firebase
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FCM,
      })
      dispatch(setId(token))
      if (token && buisnessAccountId) {
        // Send token to back-end
        await axios(
          `${process.env.NEXT_PUBLIC_API_URL}/ChangeAccount?businessAccountId=${buisnessAccountId}&deviceId=${token}&deviceType=BusinessAccount`,
        )
      }
    }
  }, [buisnessAccountId, dispatch])

  const showNotification = (payload) => {
    toast.info(
      <div>
        <strong>{payload.notification.title}</strong>
        <div>{payload.notification.body}</div>
      </div>,
    )
  }

  useEffect(() => {
    if (messaging) {
      generateToken()
      onMessage(messaging, (payload) => {
        console.log(payload)
        showNotification(payload)
      })
    }
  }, [generateToken])

  return null
}

export default FirebaseMessaging

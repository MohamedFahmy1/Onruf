import { useEffect, useCallback } from "react"
import { initializeApp } from "firebase/app"
import { getMessaging, onMessage, getToken } from "firebase/messaging"
import { toast } from "react-toastify"
import axios from "axios"

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
}
const app = typeof window !== "undefined" ? initializeApp(firebaseConfig) : null
const messaging = app ? getMessaging(app) : null

const FirebaseMessaging = () => {
  useEffect(() => {
    if (messaging) {
      requestPermissionAndSubscribe()
      onMessage(messaging, (payload) => {
        showNotification(payload)
      })
    }
  }, [requestPermissionAndSubscribe])

  const requestPermissionAndSubscribe = useCallback(() => {
    Notification.requestPermission()
      .then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.")
          getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" })
            .then((currentToken) => {
              if (currentToken) {
                sendTokenToServer(currentToken)
              } else {
                console.log("No registration token available. Request permission to generate one.")
              }
            })
            .catch((err) => {
              console.log("An error occurred while retrieving token. ", err)
            })
        } else {
          console.log("Unable to get permission to notify.")
        }
      })
      .catch((err) => {
        console.error("Permission denied", err)
      })
  }, [])

  const sendTokenToServer = (token) => {
    axios
      .post(
        "/SendNotification",
        { token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .then((response) => console.log("Token saved:", response.data))
      .catch((err) => console.error("Error saving token:", err))
  }

  const showNotification = (payload) => {
    toast.info(`New message: ${payload.notification.title}`)
  }

  return null
}

export default FirebaseMessaging

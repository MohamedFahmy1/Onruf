import { useCallback, useEffect } from "react"
import firebase from "firebase/app"
import "firebase/messaging"
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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
} else {
  firebase.app()
}

const messaging = firebase.messaging.isSupported() ? firebase.messaging() : null

const FirebaseMessaging = () => {
  useEffect(() => {
    if (messaging) {
      requestPermissionAndSubscribe()
      messaging.onMessage((payload) => {
        showNotification(payload)
      })
    }
  }, [requestPermissionAndSubscribe])

  const requestPermissionAndSubscribe = useCallback(() => {
    messaging
      .requestPermission()
      .then(() => messaging.getToken())
      .then((token) => {
        sendTokenToServer(token)
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
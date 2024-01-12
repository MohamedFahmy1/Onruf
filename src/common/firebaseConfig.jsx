import { useEffect, useCallback } from "react"
import { initializeApp } from "firebase/app"
import { getMessaging, onMessage, getToken } from "firebase/messaging"
import { toast } from "react-toastify"

const firebaseConfig = {
  apiKey: "AIzaSyBskk5sKS3cdZBG3bYOCsqFaN7OIOC1KOU",
  authDomain: "onruf-8ac34.firebaseapp.com",
  projectId: "onruf-8ac34",
  storageBucket: "onruf-8ac34.appspot.com",
  messagingSenderId: "862346458200",
  appId: "1:862346458200:web:456a18d0afde627279c62d",
  measurementId: "G-NFE4E1JX6J",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

const FirebaseMessaging = () => {
  useEffect(() => {
    // Use messaging here
    requestPermissionAndSubscribe()
    onMessage(messaging, (payload) => {
      console.log(payload)
      showNotification(payload)
    })
  }, [requestPermissionAndSubscribe])

  const requestPermissionAndSubscribe = useCallback(async () => {
    Notification.requestPermission()
      .then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.")
          getToken(messaging, {
            vapidKey: "BHqMILeXcbLN1Uef8b_XamNqzWaSEUz8Ukqg6lXKIOYTkcKT7sYhJoVQhW1q4xM3YtOeELd6lq5yycvrgBUtdws",
          })
            .then((currentToken) => {
              if (currentToken) {
                console.log(currentToken)
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

  const showNotification = (payload) => {
    console.log(payload)
    toast.info(`New message: ${payload.notification}`)
  }

  return null
}

export default FirebaseMessaging

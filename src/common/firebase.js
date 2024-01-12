import { initializeApp } from "firebase/app"
import { getMessaging, getToken } from "firebase/messaging"

const firebaseConfig = {
  apiKey: "AIzaSyBskk5sKS3cdZBG3bYOCsqFaN7OIOC1KOU",
  authDomain: "onruf-8ac34.firebaseapp.com",
  projectId: "onruf-8ac34",
  storageBucket: "onruf-8ac34.appspot.com",
  messagingSenderId: "862346458200",
  appId: "1:862346458200:web:456a18d0afde627279c62d",
  measurementId: "G-NFE4E1JX6J",
}

const app = initializeApp(firebaseConfig)
let messaging
if (typeof window !== "undefined") {
  // This code will run in the browser
  messaging = getMessaging(app)
}

export { messaging }

export const generateToken = async () => {
  const permission = await Notification.requestPermission()
  console.log(permission)
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "BHqMILeXcbLN1Uef8b_XamNqzWaSEUz8Ukqg6lXKIOYTkcKT7sYhJoVQhW1q4xM3YtOeELd6lq5yycvrgBUtdws",
    })
    console.log(token)
  }
}

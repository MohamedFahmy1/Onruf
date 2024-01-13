import { initializeApp } from "firebase/app"
import { getMessaging } from "firebase/messaging"

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
  // code will run in the browser only and not ssr
  messaging = getMessaging(app)
}

export { messaging }

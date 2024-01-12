importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js")

firebase.initializeApp({
  apiKey: "AIzaSyBskk5sKS3cdZBG3bYOCsqFaN7OIOC1KOU",
  authDomain: "onruf-8ac34.firebaseapp.com",
  projectId: "onruf-8ac34",
  storageBucket: "onruf-8ac34.appspot.com",
  messagingSenderId: "862346458200",
  appId: "1:862346458200:web:456a18d0afde627279c62d",
  measurementId: "G-NFE4E1JX6J",
})

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging()

// Optional: Add background message handler
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload)
  // Customize notification here
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

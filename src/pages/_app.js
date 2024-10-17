import Head from "next/head"
import React from "react"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { CacheProvider, ThemeProvider as EmotionCacheProvider } from "@emotion/react"
import createEmotionCache from "../styles/createEmotionCache"
import Navbar from "../modules/layout/navbar"
import Sidebar from "../modules/layout/sidebar/SideBar"
import { ToastContainer } from "react-toastify"
import theme from "../styles/Theme"
import t from "../translations.json"
import "react-toastify/dist/ReactToastify.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "../styles/globals.css"
import "../modules/products/viewProducts/viewProducts.css"
import "../modules/products/folders/folders.css"
import "../modules/users/folders/folders-users.css"
import "../modules/layout/navbar/navbar.css"
import "../modules/settings/settings.css"
import "../modules/reports/reports.css"
import "../modules/reviews/reviews.css"
import "../modules/coupons/addCoupon/addCoupon.module.css"
import { Provider } from "react-redux"
import { store } from "../appState/Store"
import { AppWrapper } from "../appWrapper/index"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import FirebaseMessaging from "../common/FirebaseMessaging"

const clientSideEmotionCache = createEmotionCache()

const MyApp = ({ Component, pageProps, emotionCache = clientSideEmotionCache }) => {
  const { locale } = useRouter()

  const mLeft = locale === "en" ? "250px" : undefined
  const mRight = locale === "en" ? undefined : "250px"
  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <AppWrapper>
          <Head>
            <title>{pathOr("", [locale, "websiteTitles", "default"], t)}</title>
            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <meta name="description" content="Welcome to OnRuf Where you can sell and buy the way you want it..." />
            <meta name="viewport" content="initial-scale=1, width=device-width" />
            <meta property="og:title" content="OnRuf Business" />
            <meta
              property="og:description"
              content="Welcome to OnRuf Where you can sell and buy the way you want it..."
            />
            {/* <meta property="og:image" content="URL of the image to display" /> */}
            {/* <meta property="og:url" content="URL of the page" /> */}
            {/* <link rel="canonical" href="https://your-preferred-url.com" /> */}
            {/* <meta name="robots" content="noindex, nofollow" />  */}
          </Head>
          <ThemeProvider theme={{ ...theme, direction: locale === "en" ? "ltr" : "rtl" }}>
            <EmotionCacheProvider theme={{ ...theme, direction: locale === "en" ? "ltr" : "rtl" }}>
              <CssBaseline />
              <Sidebar />
              <div
                id="main"
                style={{
                  marginLeft: mLeft,
                  marginRight: mRight,
                  textAlign: "start",
                }}
              >
                <FirebaseMessaging />
                <Navbar />
                <Component {...pageProps} />
                <ToastContainer
                  position="top-center"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </div>
            </EmotionCacheProvider>
          </ThemeProvider>
        </AppWrapper>
      </CacheProvider>
    </Provider>
  )
}

export default MyApp

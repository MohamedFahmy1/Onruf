import Head from "next/head"
import React, { useEffect } from "react"
import { ThemeProvider } from "@mui/material/styles"
import { Hydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import CssBaseline from "@mui/material/CssBaseline"
import { CacheProvider, ThemeProvider as EmotionCacheProvider } from "@emotion/react"
import createEmotionCache from "../styles/createEmotionCache"
import Navbar from "../modules/layout/navbar"
import Sidebar from "../modules/layout/sidebar/SideBar"
import { ToastContainer } from "react-toastify"
import theme from "../styles/Theme"

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
import BlankPage from "./404"
import { AppWrapper } from "../appWrapper/index"
import { useRouter } from "next/router"
import { getTokensFromCookie } from "../appState/personalData/authActions"

const clientSideEmotionCache = createEmotionCache()

const MyApp = ({ Component, pageProps, emotionCache = clientSideEmotionCache }) => {
  const [queryClient] = React.useState(() => new QueryClient())
  const { locale } = useRouter()
  useEffect(() => {
    store.dispatch(getTokensFromCookie())
  }, [])
  const pageDir = locale === "en" ? "ltr" : "rtl"
  const mLeft = locale === "en" ? "250px" : undefined
  const mRight = locale === "en" ? undefined : "250px"
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {/* <Hydrate state={pageProps.dehydratedState}> */}
        <CacheProvider value={emotionCache}>
          <AppWrapper>
            <Head>
              <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
              <EmotionCacheProvider theme={theme}>
                <CssBaseline />
                <Sidebar />
                <div
                  id="main"
                  style={{
                    direction: pageDir,
                    marginLeft: mLeft,
                    marginRight: mRight,
                    textAlign: locale === "en" ? "left" : "right",
                  }}
                >
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
        {/* </Hydrate> */}
      </QueryClientProvider>
    </Provider>
  )
}

export default MyApp

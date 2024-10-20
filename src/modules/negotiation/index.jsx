import { useCallback, useEffect, useState } from "react"
import { Tabs, Tab, Box, Typography, Grid } from "@mui/material"
import OfferCard from "./OfferCard"
import { pathOr } from "ramda"
import t from "../../translations.json"
import { useRouter } from "next/router"
import axios from "axios"
import Alerto from "../../common/Alerto"
import Pagination from "@mui/material/Pagination"
import { LoadingScreen } from "../../common/Loading"

const tabsStyles = {
  ".MuiTabs-flexContainer": {
    padding: "20px",
  },
  ".MuiTab-root": {
    borderRadius: "20px",
    marginRight: "8px",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "1rem",
    color: "rgba(0, 0, 0, 0.6)",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    "&:hover": {
      backgroundColor: "#ee6c4d",
      color: "#fff",
    },
    "&.Mui-selected": {
      color: "#fff",
      backgroundColor: "#ee6c4d",
    },
  },
}

function NegotiationOffers() {
  const { locale } = useRouter()
  const [selectedTab, setSelectedTab] = useState(0)
  const [offersData, setOffersData] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  const [loading, setLoading] = useState(false)

  const getOffers = useCallback(async () => {
    try {
      setLoading(true)
      const {
        data: { data: offers },
      } = await axios.post(`/GetSaleProductsOffers?isSent=${selectedTab == 0 ? "false" : "true"}`)
      setOffersData(offers)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      Alerto(error)
    }
  }, [selectedTab])

  useEffect(() => {
    getOffers()
  }, [locale, getOffers])

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue)
  }
  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }
  const totalPages = Math.ceil(offersData?.length / pageSize)
  const currentData = offersData?.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Box
      sx={{ flexGrow: 1, backgroundColor: "background.paper", borderRadius: "8px", boxShadow: "none", margin: "2rem" }}
      component={"article"}
    >
      <Typography variant="h5" px={2} pt={2} fontWeight={600} color="initial" component={"h1"}>
        {pathOr("", [locale, "negotiation", "negotiationOffers"], t)}
      </Typography>
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        aria-label="Negotiation offers tabs"
        indicatorColor="transparent"
        sx={tabsStyles}
      >
        <Tab label={pathOr("", [locale, "negotiation", "recieved"], t)} />
        <Tab label={pathOr("", [locale, "negotiation", "sent"], t)} />
      </Tabs>
      {currentData?.length > 0 ? (
        <Grid container spacing={2} px={3}>
          {currentData?.map((item) => (
            <OfferCard offer={item} key={item.offerId} getOffers={getOffers} selectedTab={selectedTab} />
          ))}
        </Grid>
      ) : (
        <Typography variant="h4" py={10} textAlign={"center"} component={"h2"} color="textPrimary">
          {pathOr("", [locale, "negotiation", "noOffersFound"], t)}
        </Typography>
      )}
      {currentData?.length > 0 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{ my: 2, p: 2, ".MuiPagination-ul": { justifyContent: "center" } }}
        />
      )}
    </Box>
  )
}

export default NegotiationOffers

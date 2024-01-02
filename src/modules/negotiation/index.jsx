import { useCallback, useEffect, useState } from "react"
import { Tabs, Tab, Box, Typography, Grid } from "@mui/material"
import OfferCard from "./OfferCard"
import { pathOr } from "ramda"
import t from "../../translations.json"
import { useRouter } from "next/router"
import axios from "axios"
import Alerto from "../../common/Alerto"

function NegotiationOffers() {
  const [selectedTab, setSelectedTab] = useState(0)
  const [offersData, setOffersData] = useState()
  const { locale } = useRouter()

  const getOffers = useCallback(async () => {
    try {
      const {
        data: { data: offers },
      } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/GetSaleProductsOffers?isSent=${selectedTab == 0 ? "false" : "true"}`,
      )
      setOffersData(offers)
    } catch (error) {
      Alerto(error)
    }
  }, [selectedTab])

  useEffect(() => {
    getOffers()
  }, [locale, getOffers])

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue)
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
        sx={{
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
        }}
      >
        <Tab label={pathOr("", [locale, "negotiation", "recieved"], t)} />
        <Tab label={pathOr("", [locale, "negotiation", "sent"], t)} />
      </Tabs>
      <Grid container spacing={2} px={3}>
        {offersData?.map((item, index) => (
          <OfferCard offer={offersData[index]} key={item.offerId} getOffers={getOffers} selectedTab={selectedTab} />
        ))}
      </Grid>
    </Box>
  )
}

export default NegotiationOffers

import { useEffect, useState } from "react"
import { Tabs, Tab, Box, Typography } from "@mui/material"
import OfferCard from "./OfferCard"
import { pathOr } from "ramda"
import t from "../../translations.json"
import { useRouter } from "next/router"
import axios from "axios"

function NegotiationOffers() {
  const [selectedTab, setSelectedTab] = useState(0)
  const [offersData, setOffersData] = useState()
  const { locale } = useRouter()
  console.log(offersData)
  useEffect(() => {
    const getOffers = async () => {
      const {
        data: { data: offers },
      } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/GetPurchaseProductsOffers?isSent=${selectedTab == 0 ? "false" : "true"}`,
      )
      setOffersData(offers)
    }
    getOffers()
  }, [locale, selectedTab])

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue)
  }
  return (
    <Box
      sx={{ flexGrow: 1, backgroundColor: "background.paper", borderRadius: "8px", boxShadow: "none", margin: "2rem" }}
    >
      <Typography variant="h5" px={2} pt={2} fontWeight={600} color="initial">
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
      <Box sx={{ p: 3 }}>
        {selectedTab === 0 && (
          <OfferCard offer={{ title: "Cat1", location: "Riyadh", price: "400 S.R", status: "Expired" }} />
        )}
        {selectedTab === 1 && (
          <OfferCard
            offer={{
              title: "Women new product",
              location: "Riyadh",
              price: "120 S.R",
              status: "Waiting for Your response",
            }}
          />
        )}
      </Box>
    </Box>
  )
}

export default NegotiationOffers

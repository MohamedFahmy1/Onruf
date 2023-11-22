import { Box, CardContent, Typography, Card, CardMedia, Avatar, Grid, Button } from "@mui/material"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import React, { useEffect, useState } from "react"
import t from "../../translations.json"
import axios from "axios"
import AcceptModal from "./AcceptModal"

const OfferCard = ({ offer }) => {
  const { locale } = useRouter()
  const [acceptModal, setAcceptModal] = useState(false)

  return (
    <Grid item xs={12} sm={12} md={6} lg={4}>
      <Card
        sx={{
          maxWidth: 345,
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
          },
        }}
      >
        <Box sx={{ backgroundColor: "#ee6c4d", padding: 1, borderBottom: "1px solid #e0e0e0" }}>
          <Typography variant="subtitle1" component="h2" color={"#fff"} align="center" m={0}>
            {offer?.offerStatus}
          </Typography>
        </Box>
        <CardContent
          sx={{
            padding: 2,
            display: "flex",
            columnGap: "40px",
            "&:last-child": {
              paddingBottom: 2,
            },
          }}
        >
          <CardMedia component="img" image={offer?.productImage} alt="product" sx={{ width: 100 }} />
          <Box>
            <Typography variant="body1" component="p" fontWeight={300} color={"rgba(0, 0, 0, 0.6)"}>
              {offer?.productCategory}
            </Typography>
            <Typography variant="body1" component="p" fontWeight={600}>
              {offer?.productName}
            </Typography>
            <Typography variant="body1" component="p" color={"rgba(0, 0, 0, 0.6)"}>
              {offer?.region}
            </Typography>
            <Typography variant="body1" component="p" sx={{ fontWeight: "600", color: "#ff5722" }}>
              {offer?.offerPrice} {pathOr("", [locale, "Products", "currency"], t)}
            </Typography>
          </Box>
        </CardContent>
        <Box
          sx={{
            padding: 2,
            display: "flex",
            columnGap: "30px",
            borderTop: "1px solid #ccc",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          <Avatar alt="receiver" src={offer?.receiverImage} />
          <Box>
            <Typography variant="body1" color={"initial"} fontWeight={600}>
              {offer?.buyerName}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(0, 0, 0, 0.6)", fontSize: "0.8rem" }}>
              {offer?.offerStatus == "New"
                ? pathOr("", [locale, "negotiation", "waiting_for_your_response"], t)
                : offer?.offerStatus}
            </Typography>
          </Box>
          {offer?.offerStatus == "New" && (
            <Box>
              <Button variant="contained" color="primary" style={{ borderRadius: 50 }}>
                {pathOr("", [locale, "negotiation", "accept"], t)}
              </Button>
              <Button variant="contained" sx={{ bgcolor: "#45495e" }} style={{ borderRadius: 50 }}>
                {pathOr("", [locale, "negotiation", "reject"], t)}
              </Button>
            </Box>
          )}
          <AcceptModal
            acceptModal={acceptModal}
            setAcceptModal={setAcceptModal}
            offerId={offer?.offerId}
            productId={offer?.productId}
          />
        </Box>
      </Card>
    </Grid>
  )
}

export default OfferCard

import { Box, CardContent, Typography, Card } from "@mui/material"
import React from "react"

const OfferCard = ({ offer }) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
        margin: "1rem",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "0 3px 5px 2px rgba(0, 0, 0, .1)",
        },
      }}
    >
      <Box sx={{ backgroundColor: "#f5f5f5", padding: 2, borderBottom: "1px solid #e0e0e0" }}>
        <Typography variant="subtitle1" component="h2">
          {offer.title}
        </Typography>
      </Box>
      <CardContent
        sx={{
          padding: 2,
          "&:last-child": {
            paddingBottom: 2,
          },
        }}
      >
        <Typography variant="body1" component="p">
          {offer.location}
        </Typography>
        <Typography variant="body1" component="p" sx={{ fontWeight: "600", color: "#ff5722" }}>
          {offer.price}
        </Typography>
      </CardContent>
      <Box
        sx={{
          padding: 2,
          display: "flex",
          justifyContent: "flex-end",
          backgroundColor: "#f5f5f5",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
        }}
      >
        <Typography variant="caption" sx={{ color: "rgba(0, 0, 0, 0.6)", fontSize: "0.8rem", fontStyle: "italic" }}>
          {offer.status}
        </Typography>
      </Box>
    </Card>
  )
}

export default OfferCard

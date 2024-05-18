import { Box, CardContent, Typography, Card, Avatar, Grid, Button } from "@mui/material"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import { useState } from "react"
import t from "../../translations.json"
import AcceptModal from "./AcceptModal"
import { negotiationTypeTranslation } from "../../common/functions"
import RefuseModal from "./RefuseModal"
import ResponsiveImage from "../../common/ResponsiveImage"

const OfferCard = ({ offer, getOffers, selectedTab }) => {
  const { locale } = useRouter()
  const [acceptModal, setAcceptModal] = useState(false)
  const [refuseModal, setRefuseModal] = useState(false)

  const productImage = !offer?.productImage?.includes("https")
    ? offer?.productImage?.replace("http", "https")
    : offer?.productImage
  const receiverImage = !offer?.receiverImage?.includes("https")
    ? offer?.receiverImage?.replace("http", "https")
    : offer?.receiverImage

  return (
    <Grid item xs={12} sm={12} md={6} lg={4}>
      <Card
        component={"section"}
        sx={{
          maxWidth: 400,
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
            {negotiationTypeTranslation(offer.offerStatus, locale)}
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
          <ResponsiveImage imageSrc={productImage} alt={"product"} />
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
            flexDirection: { xs: "column", lg: "row" },
            justifyContent: "space-between",
            borderTop: "1px solid #ccc",
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        >
          <Box sx={{ display: "flex", columnGap: "20px", alignItems: "center" }}>
            <Box position={"relative"}>
              <Avatar alt="receiver" src={receiverImage} sx={{ height: 60, width: 60 }} />
              {selectedTab === 1 && (
                <Typography
                  variant="subtitle2"
                  position={"absolute"}
                  bottom={-10}
                  left={"50%"}
                  bgcolor={"primary.main"}
                  sx={{
                    color: "white",
                    padding: "2px 12px",
                    fontSize: "12px",
                    transform: "translateX(-50%)",
                    borderRadius: 50,
                  }}
                >
                  {pathOr("", [locale, "negotiation", "seller"], t)}
                </Typography>
              )}
            </Box>
            <Box>
              <Typography variant="body1" color={"initial"} fontWeight={600}>
                {offer?.buyerName}
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(0, 0, 0, 0.6)", fontSize: "0.8rem", lineHeight: 1 }}>
                {offer?.offerStatus == "New"
                  ? pathOr("", [locale, "negotiation", "waiting_for_your_response"], t)
                  : negotiationTypeTranslation(offer?.offerStatus, locale)}
              </Typography>
            </Box>
          </Box>
          {offer?.offerStatus == "New" && (
            <Box sx={{ width: { xs: "auto", lg: "min-content" } }}>
              <Button
                variant="contained"
                color="primary"
                style={{ borderRadius: 50, marginBottom: "5px", width: "100%" }}
                onClick={() => setAcceptModal(true)}
              >
                {pathOr("", [locale, "negotiation", "accept"], t)}
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#45495e", width: "100%" }}
                style={{ borderRadius: 50 }}
                onClick={() => setRefuseModal(true)}
              >
                {pathOr("", [locale, "negotiation", "reject"], t)}
              </Button>
            </Box>
          )}
          <AcceptModal
            acceptModal={acceptModal}
            setAcceptModal={setAcceptModal}
            offerId={offer?.offerId}
            productId={offer?.productId}
            getOffers={getOffers}
          />
          <RefuseModal
            refuseModal={refuseModal}
            setRefuseModal={setRefuseModal}
            offerId={offer?.offerId}
            productId={offer?.productId}
            getOffers={getOffers}
          />
        </Box>
      </Card>
    </Grid>
  )
}

export default OfferCard

import React from "react"
import { Box, Button, List, Typography } from "@mui/material"
import Logo from "../../../../public/images/Logo2x.png"
import { StyledLogo, StyledSidebar } from "./styles"
import ListItem from "./ListItem"
import Router, { useRouter } from "next/router"
import t from "../../../translations.json"
import { pathOr } from "ramda"
import {
  HomeLightIcon,
  HomeDarkIcon,
  ProductsLightIcon,
  ProductsDarkIcon,
  PersonDarkIcon,
  PersonLightIcon,
  OrdersLightIcon,
  OrdersDarkIcon,
  ReportLightIcon,
  ReportDarkIcon,
  RatsDarkIcon,
  RatsLightIcon,
  ShopDarkIcon,
  ShopLightIcon,
  SettingDarkIcon,
  SettingLightIcon,
} from "../../../../public/icons"
import "react-toastify/dist/ReactToastify.css"
import Image from "next/image"

const Sidebar = () => {
  const { locale } = useRouter()

  const navBarItems = [
    {
      name: pathOr("", [locale, "sidebar", "home"], t),
      link: "/",
      lightIcon: HomeLightIcon,
      darkIcon: HomeDarkIcon,
    },
    {
      name: pathOr("", [locale, "sidebar", "products"], t),
      link: "/products",
      lightIcon: ProductsLightIcon,
      darkIcon: ProductsDarkIcon,
    },
    {
      name: locale === "en" ? "Negotiation offers" : "عروض التفاوض",
      link: "/negotiation",
      lightIcon: RatsLightIcon,
      darkIcon: RatsDarkIcon,
    },
    {
      name: pathOr("", [locale, "sidebar", "orders"], t),
      link: "/orders",
      lightIcon: OrdersLightIcon,
      darkIcon: OrdersDarkIcon,
    },
    {
      name: pathOr("", [locale, "sidebar", "users"], t),
      link: "/users",
      lightIcon: PersonLightIcon,
      darkIcon: PersonDarkIcon,
    },
    {
      name: pathOr("", [locale, "sidebar", "reports"], t),
      link: "/reports",
      lightIcon: ReportLightIcon,
      darkIcon: ReportDarkIcon,
    },
    {
      name: pathOr("", [locale, "sidebar", "comments"], t),
      link: "/reviews?tab=reviews",
      lightIcon: RatsLightIcon,
      darkIcon: RatsDarkIcon,
    },
    {
      name: pathOr("", [locale, "sidebar", "marketing"], t),
      link: "/coupons",
      lightIcon: ShopLightIcon,
      darkIcon: ShopDarkIcon,
      subItems: [
        {
          name: pathOr("", [locale, "sidebar", "discountCoupons"], t),
          link: "/coupons",
        },
        {
          name: pathOr("", [locale, "sidebar", "marketingWithOnruf"], t),
          link: "/marketing",
        },
      ],
    },
    {
      name: pathOr("", [locale, "sidebar", "settings"], t),
      link: "/settings",
      lightIcon: SettingLightIcon,
      darkIcon: SettingDarkIcon,
    },
  ]
  return (
    <StyledSidebar variant={"permanent"} component={"aside"} anchor={locale === "en" ? "left" : "right"}>
      <StyledLogo>
        <Image src={Logo.src} width={234} height={76} alt={"Logo"} onClick={() => Router.push(`/${locale}`)} />
      </StyledLogo>
      <List component={"nav"}>
        <Box component={"ul"}>
          {navBarItems.map((listItem) => (
            <ListItem key={listItem.name} {...listItem} />
          ))}
        </Box>
        <Box
          bgcolor={"primary.main"}
          sx={{
            width: "90%",
            margin: "auto",
            borderRadius: "12px",
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="p" color={"white"}>
            {pathOr("", [locale, "sidebar", "needHelp"], t)}
          </Typography>
          <Button
            className="mr-10 mt-10 btn btn-main"
            style={{ backgroundColor: "#fff", color: "#ee6c4d" }}
            onClick={() => Router.push("/contact-us")}
          >
            {pathOr("", [locale, "sidebar", "contactus"], t)}
          </Button>
        </Box>
      </List>
    </StyledSidebar>
  )
}

export default Sidebar

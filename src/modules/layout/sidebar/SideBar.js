import React, { useState } from "react"
import { Box, Button, List, Modal, Typography } from "@mui/material"
import Logo from "../../../public/images/Logo2x.png"
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
} from "../../../public/icons"
import { useForm } from "react-hook-form"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import Image from "next/image"

const Sidebar = () => {
  const [modalOpen, setModalOpen] = useState(false)
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
      name: pathOr("", [locale, "sidebar", "coupons"], t),
      link: "/coupons",
      lightIcon: ShopLightIcon,
      darkIcon: ShopDarkIcon,
      subItems: [
        {
          name: "كوبونات الخصم",
          link: "/coupons",
        },
        {
          name: "التسويق مع اونرف",
          link: "/marketing",
        },
      ],
    },
    {
      name: pathOr("", [locale, "sidebar", "marketing"], t),
      link: "/marketing",
      lightIcon: RatsLightIcon,
      darkIcon: RatsDarkIcon,
    },
    {
      name: pathOr("", [locale, "sidebar", "settings"], t),
      link: "/settings",
      lightIcon: SettingLightIcon,
      darkIcon: SettingDarkIcon,
    },
  ]
  return (
    <StyledSidebar variant={"permanent"} anchor={locale === "en" ? "left" : "right"}>
      <StyledLogo>
        <Image src={Logo.src} width={145} height={45} alt={"Logo"} onClick={() => Router.push(`/${locale}`)} />
      </StyledLogo>
      <List>
        {navBarItems.map((listItem) => (
          <ListItem key={listItem.name} {...listItem} />
        ))}
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

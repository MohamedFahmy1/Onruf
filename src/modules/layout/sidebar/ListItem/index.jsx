import { Box, ListItem as MuiListItem, Typography } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { IconsWrapper, StyledListButton } from "./styles"
import Image from "next/image"
import { IoIosArrowDown } from "react-icons/io"
import { textAlignStyle } from "../../../../styles/stylesObjects"

const ListItem = ({ lightIcon: LightIcon, darkIcon: DarkIcon, name, link, subItems }) => {
  const { pathname, locale } = useRouter()
  const [isActive, setIsActive] = useState(false)
  const [isHoveredOn, setIsHoveredOn] = useState(false)

  useEffect(() => {
    const rootPage = `/${pathname.split("/")[1]}`
    setIsActive(false)
    if (link === rootPage || (link === "/dashboard" && rootPage === "/")) {
      setIsActive(true)
    } else if (pathname.includes("marketing") && link === "/coupons") {
      setIsActive(true)
    } else if (pathname.includes("reviews") && link.includes("reviews")) {
      setIsActive(true)
    }
  }, [pathname, link])
  return (
    <MuiListItem
      sx={{
        direction: locale === "en" ? "ltr" : "rtl",
        m: 0,
        py: 0,
      }}
    >
      {link && subItems ? (
        <Link href={link}>
          {/* This way I overrode the `a` style without losing its characteristics as a link */}
          <a
            style={{
              textDecoration: "none",
              color: "red",
            }}
          >
            <StyledListButton
              selected={isActive}
              sx={{
                ...(isActive && { pointerEvents: "none" }),
                fontSize: link.includes("reviews") ? "17px" : "18px",
                letterSpacing: link.includes("reviews") ? "-0.5px" : "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onMouseOver={() => {
                setIsHoveredOn(true)
              }}
              onMouseOut={() => {
                setIsHoveredOn(false)
              }}
            >
              <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                {(LightIcon || DarkIcon) && (
                  <IconsWrapper>
                    <Image
                      src={isHoveredOn || isActive ? LightIcon : DarkIcon}
                      alt="test"
                      layout="fixed"
                      height={25}
                      width={25}
                    />
                  </IconsWrapper>
                )}
                <Typography
                  variant="body1"
                  mx={1}
                  fontSize={"17px"}
                  fontWeight={"bold"}
                  fontFamily={"serif"}
                  sx={{
                    color: isActive || isHoveredOn ? "white" : "black",
                  }}
                >
                  {name}
                </Typography>
              </Box>
              <IoIosArrowDown />
            </StyledListButton>
            {(pathname.includes("coupons") || pathname.includes("marketing")) &&
              subItems.map((item) => (
                <Link href={item.link} key={item.name}>
                  <Typography
                    selected={isActive}
                    sx={{
                      ...textAlignStyle(locale),
                      backgroundColor: pathname.includes(item.link) && "info.main",
                      borderRight: locale === "en" && pathname.includes(item.link) ? "4px solid" : undefined,
                      borderLeft: locale === "ar" && pathname.includes(item.link) ? "4px solid" : undefined,
                      borderRightColor: locale === "en" && pathname.includes(item.link) ? "primary.main" : undefined,
                      borderLeftColor: locale === "ar" && pathname.includes(item.link) ? "primary.main" : undefined,
                    }}
                    variant="body1"
                    fontSize={"17px"}
                    fontFamily={"serif"}
                    color={"initial"}
                    px={3}
                    py={1}
                    mt={1}
                  >
                    {item.name}
                  </Typography>
                </Link>
              ))}
          </a>
        </Link>
      ) : (
        <Link href={link}>
          {/* This way I overrode the `a` style without losing its characteristics as a link */}
          <a
            style={{
              textDecoration: "none",
              color: "red",
            }}
          >
            <StyledListButton
              selected={isActive}
              sx={{
                ...(isActive && { pointerEvents: "none" }),
                fontSize: link.includes("reviews") ? "17px" : "18px",
                letterSpacing: link.includes("reviews") ? "-0.5px" : "0",
              }}
              onMouseOver={() => {
                setIsHoveredOn(true)
              }}
              onMouseOut={() => {
                setIsHoveredOn(false)
              }}
            >
              {(LightIcon || DarkIcon) && (
                <IconsWrapper>
                  <Image
                    src={isActive || isHoveredOn ? LightIcon : DarkIcon}
                    alt="test"
                    layout="fixed"
                    height={25}
                    width={25}
                  />
                </IconsWrapper>
              )}
              {name}
            </StyledListButton>
          </a>
        </Link>
      )}
      {!link && (
        <a
          style={{
            textDecoration: "none",
            color: "red",
          }}
          onClick={handleClick}
        >
          <StyledListButton
            selected={isActive}
            sx={{
              ...(isActive && { pointerEvents: "none" }),
            }}
            onMouseOver={() => {
              setIsHoveredOn(true)
            }}
            onMouseOut={() => {
              setIsHoveredOn(false)
            }}
          >
            {(LightIcon || DarkIcon) && (
              <IconsWrapper>
                <Image
                  src={isActive || isHoveredOn ? LightIcon : DarkIcon}
                  alt="test"
                  layout="fixed"
                  height={25}
                  width={25}
                />
              </IconsWrapper>
            )}
            {name}
          </StyledListButton>
        </a>
      )}
    </MuiListItem>
  )
}

export default ListItem

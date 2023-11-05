import { ListItem as MuiListItem } from "@mui/material"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { IconsWrapper, StyledListButton } from "./styles"
import Image from "next/image"

const ListItem = ({ lightIcon: LightIcon, darkIcon: DarkIcon, name, link, subItems }) => {
  const { pathname } = useRouter()
  const [isActive, setIsActive] = useState(false)
  const [isHoveredOn, setIsHoveredOn] = useState(false)

  useEffect(() => {
    const rootPage = `/${pathname.split("/")[1]}`

    setIsActive(false)
    if (link === rootPage || (link === "/dashboard" && rootPage === "/")) {
      setIsActive(true)
    }
  }, [pathname, link])
  return (
    <MuiListItem>
      {link && (
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

import { Drawer } from "@mui/material"
import { styled } from "@mui/material/styles"

const drawerWidth = 250
export const StyledSidebar = styled(Drawer)({
  minWidth: drawerWidth,
  flexShrink: 0,
  fontWeight: "bold",
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    fontWeight: "bold",
    padding: "25px 0",
    transition: "transform 0.3s ease-in-out",
  },
})

export const StyledLogo = styled("div")(({ theme }) => ({
  display: "block",
  padding: theme.spacing(0, 0, 0, 0),
  maxWidth: "145px",
  maxHeight: "45px",
  marginBottom: "15px",
  alignSelf: "center",
}))

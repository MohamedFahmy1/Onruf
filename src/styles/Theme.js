import { createTheme } from "@mui/material/styles"
import { red } from "@mui/material/colors"

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#ee6c4d",
    },
    secondary: {
      main: "#19857b",
    },
    info: {
      main: "#fff8f6",
    },
    error: {
      main: red.A400,
    },
    test: {
      default: "red",
    },
  },
  typography: {
    fontFamily: "serif",
  },
})

export default theme

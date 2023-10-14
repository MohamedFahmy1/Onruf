import * as React from "react"
import Button from "@mui/material/Button"
import Snackbar from "@mui/material/Snackbar"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import { Alert } from "@mui/material"

export default function SimpleSnackbar({
  text = "This is a demo message",
  place = {
    vertical: "bottom",
    horizontal: "center",
  },
  error = false,
  show,
  setShow,
}) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setShow(false)
  }

  const action = (
    <React.Fragment>
      <IconButton size="medium" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  )

  return (
    <div>
      <Snackbar
        anchorOrigin={place}
        autoHideDuration={3000}
        sx={{ direction: "ltr" }}
        open={show}
        onClose={handleClose}
        action={action}
      >
        <Alert onClose={handleClose} severity={error ? "error" : "success"} sx={{ width: "100%" }}>
          {text}
        </Alert>
      </Snackbar>
    </div>
  )
}

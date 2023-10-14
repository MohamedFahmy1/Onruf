import { Box, MenuItem, Select, Typography } from "@mui/material"
import React from "react"
import AccordionNextBtn from "./AccordionNextBtn"

const ShippingOptionsComponent = ({ onNextClick }) => {
  const [shippingOptions, setShippingOptions] = React.useState([])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    setShippingOptions(typeof value === "string" ? value.split(",") : value)
  }

  return (
    <Box mt={4} px={4}>
      <Box mt={4}>
        <Typography variant={"h5"} mb={1}>
          طرق الشحن
        </Typography>
        <Select sx={{ width: "600px" }} multiple value={shippingOptions} onChange={handleChange}>
          <MenuItem value={"fixed"}>طريقة شحن 1</MenuItem>
          <MenuItem value={"fixed2"}>طريقة شحن 2</MenuItem>
        </Select>
      </Box>
      <AccordionNextBtn onPress={onNextClick} />
    </Box>
  )
}

export default ShippingOptionsComponent
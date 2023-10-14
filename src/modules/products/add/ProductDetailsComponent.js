import { Box, Input, MenuItem, Select, Typography } from "@mui/material"
import AccordionNextBtn from "./AccordionNextBtn"

const ProductDetailsComponent = ({
  carTypeOptions = [],
  carModelOptions = [],
  engineTypesOptions = [],
  onNextClick,
}) => {
  return (
    <Box mt={4} px={4}>
      <Box>
        <Typography variant={"h5"}>نوع السياره</Typography>
        <Select sx={{ width: "600px" }} label={"نوع السياره"}>
          {carTypeOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box mt={4}>
        <Typography variant={"h5"}>موديل سنه</Typography>
        <Select sx={{ width: "600px" }}>
          {carModelOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box mt={4}>
        <Typography variant={"h5"}>المحرك</Typography>
        <Select sx={{ width: "600px" }}>
          {engineTypesOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box mt={4}>
        <Typography variant={"h5"}>عدد الكيلومترات</Typography>
        <Input type={"number"} sx={{ width: "600px" }} />
      </Box>
      <AccordionNextBtn onPress={onNextClick} />
    </Box>
  )
}

export default ProductDetailsComponent
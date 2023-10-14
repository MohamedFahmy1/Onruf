import { Box, Checkbox, FormControlLabel, Grid, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import React from "react"
import AccordionNextBtn from "./AccordionNextBtn"

const AdvertiseDetailsComponent = ({ onNextClick }) => {
  const [unlimitedQty, setUnlimitedQty] = React.useState(false)
  return (
    <Box mt={4} px={4}>
      <Grid container>
        <Grid item xs={6}>
          <Box mt={4}>
            <Typography variant={"h5"}>عنوان المنتج</Typography>
            <Input sx={{ width: "600px" }} placeholder={"اكتب عنوان المنتج"} />
          </Box>
          <Box mt={4}>
            <Typography variant={"h5"}>عنوان فرعي</Typography>
            <Input sx={{ width: "600px" }} placeholder={"اكتب عنوان الفرعي المنتج"} />
          </Box>
          <Box mt={4}>
            <Typography variant={"h5"}>حالة المنتج</Typography>
            <Select sx={{ width: "600px" }}>
              <MenuItem value={"new"}>جديد</MenuItem>
              <MenuItem value={"used"}>مستعمل</MenuItem>
            </Select>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box mt={4}>
            <Typography variant={"h5"}>تفاصيل المنتج</Typography>
            <Input sx={{ width: "600px" }} placeholder={"اكتب التفاصيل هنا"} multiline={true} minRows={5} />
          </Box>
          <Box mt={4}>
            <Typography variant={"h5"}>الكميه</Typography>
            <FormControlLabel
              control={<Checkbox defaultChecked value={unlimitedQty} onChange={() => setUnlimitedQty(!unlimitedQty)} />}
              label="غير محدود"
            />
            <Input type={"number"} sx={{ width: "600px" }} placeholder={"0"} disabled={!unlimitedQty} />
          </Box>
        </Grid>
      </Grid>
      <Typography variant={"h5"} mt={6}>
        العنوان
      </Typography>
      <Grid container>
        <Grid item xs={6}>
          <Box mt={4}>
            <InputLabel>البلد</InputLabel>
            <Select sx={{ width: "600px" }} label={"البلد"}>
              <MenuItem value={"new"}>السعودية</MenuItem>
            </Select>
          </Box>

          <Box mt={4}>
            <InputLabel>المحافظة</InputLabel>
            <Select sx={{ width: "600px" }} label={"المحافظة"}>
              <MenuItem value={"new"}>الرياض</MenuItem>
            </Select>
          </Box>

          <Box mt={4}>
            <InputLabel>المنطقة</InputLabel>
            <Select sx={{ width: "600px" }} label={"المنطقة"}>
              <MenuItem value={"new"}>الرياض</MenuItem>
            </Select>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box mt={4}>
            <InputLabel>اسم الحي</InputLabel>
            <Input sx={{ width: "600px" }} label={"اسم الحي"} />
          </Box>

          <Box mt={4}>
            <InputLabel>اسم الشارع</InputLabel>
            <Input sx={{ width: "600px" }} label={"اسم الشارع"} />
          </Box>

          <Box mt={4}>
            <InputLabel>كود المحافظة</InputLabel>
            <Input sx={{ width: "600px" }} label={"كود المحافظة"} />
          </Box>
        </Grid>
      </Grid>
      <AccordionNextBtn onPress={onNextClick} />
    </Box>
  )
}

export default AdvertiseDetailsComponent
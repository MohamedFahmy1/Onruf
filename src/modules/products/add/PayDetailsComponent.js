import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Input,
  InputAdornment,
  MenuItem,
  Select,
  Typography,
} from "@mui/material"
import React from "react"
import AccordionNextBtn from "./AccordionNextBtn"

const PayDetailsComponent = ({ onNextClick }) => {
  const [sendOffersChecked, setSendOffersChecked] = React.useState(false)
  const [sendInfoToWinner, setSendInfoToWinner] = React.useState(false)
  const [paymentOptions, setPaymentOptions] = React.useState([])

  const handlePaymentOptionsChange = (event) => {
    const {
      target: { value },
    } = event
    setPaymentOptions(typeof value === "string" ? value.split(",") : value)
  }

  return (
    <Box mt={4} px={4}>
      <Box>
        <Typography variant={"h5"}>نوع الاعلان</Typography>
        <Select sx={{ width: "600px" }} label={"نوع الاعلان"}>
          <MenuItem value={"fixed"}>اعلان بسعر ثابت</MenuItem>
          <MenuItem value={"fixed2"}>مزاد</MenuItem>
          <MenuItem value={"fixed3"}>عروض تفاوض</MenuItem>
        </Select>
      </Box>

      <Box mt={4}>
        <Typography variant={"h5"}>سعر المنتج</Typography>
        <Input
          type={"number"}
          sx={{ width: "600px" }}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
        />
      </Box>

      <Grid container mt={4}>
        <Grid item xs={6}>
          <Typography variant={"h5"}>سعر بدأ المزاد</Typography>
          <Input
            type={"number"}
            sx={{ width: "600px" }}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </Grid>
        <Grid item xs={6}>
          <Typography variant={"h5"}>أقل سعر</Typography>
          <Input
            type={"number"}
            sx={{ width: "600px" }}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </Grid>
      </Grid>

      <Divider sx={{ marginTop: 8 }} />
      <Box mt={4}>
        <Typography variant={"h5"}>ارسال عروض تفاوض تلقائيا بعد انتهاء المزاد</Typography>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              value={sendOffersChecked}
              onChange={() => setSendOffersChecked(!sendOffersChecked)}
            />
          }
          label=""
        />
      </Box>
      <Grid container mt={4}>
        <Grid item xs={6}>
          <Typography variant={"h5"}>أقل سعر</Typography>
          <Input
            type={"number"}
            sx={{ width: "600px" }}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </Grid>

        <Grid item xs={6}>
          <Typography variant={"h5"} mb={1}>
            حالة المنتج
          </Typography>
          <Select sx={{ width: "600px" }} label={"حالة المنتج"}>
            <MenuItem value={"fixed"}>اعلان بسعر ثابت</MenuItem>
            <MenuItem value={"fixed2"}>مزاد</MenuItem>
            <MenuItem value={"fixed3"}>عروض تفاوض</MenuItem>
          </Select>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant={"h5"} mb={1}>
          لمن تريد ارسال العرض
        </Typography>
        <Select sx={{ width: "600px" }}>
          <MenuItem value={"fixed"}>جميع المزايدين</MenuItem>
          <MenuItem value={"fixed2"}>لاعلي 3 اسعار في المزايده</MenuItem>
          <MenuItem value={"fixed3"}>للذين اضافو المنتج للمفضلة</MenuItem>
        </Select>
      </Box>

      <Divider sx={{ marginTop: 8 }} />
      <Box mt={4}>
        <Typography variant={"h5"} mb={1}>
          طرق الدفع
        </Typography>
        <Select sx={{ width: "600px" }} multiple value={paymentOptions} onChange={handlePaymentOptionsChange}>
          <MenuItem value={"fixed"}>Saudi bank Deposit</MenuItem>
          <MenuItem value={"fixed2"}>Visa / Mastercard</MenuItem>
        </Select>
      </Box>
      <Box mt={4}>
        <Typography variant={"h5"}>ارسال بيانات حسابك للفائز بالمزاد</Typography>
        <FormControlLabel
          control={
            <Checkbox defaultChecked value={sendInfoToWinner} onChange={() => setSendInfoToWinner(!sendInfoToWinner)} />
          }
          label=""
        />
      </Box>
      <AccordionNextBtn onPress={onNextClick} />
    </Box>
  )
}

export default PayDetailsComponent
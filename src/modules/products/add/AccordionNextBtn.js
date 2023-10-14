import { Button } from "@mui/material"

const AccordionNextBtn = ({ onPress }) => {
  return (
    <Button
      sx={{
        width: "150px",
        borderRadius: "30px",
        marginTop: "24px",
      }}
      size={"large"}
      variant="contained"
      onClick={onPress}
    >
      التالي
    </Button>
  )
}

export default AccordionNextBtn
import { Box, Input, InputLabel } from "@mui/material"
import Image from "next/image"
import HomeImage1 from "../../../public/images/home1.jpg"
import { AiFillCamera } from "react-icons/ai"
import AccordionNextBtn from "./AccordionNextBtn"

const ImagesComponent = ({ onNextClick }) => {
  return (
    <Box mt={4} px={4}>
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            width: "160px",
            height: "160px",
            border: "1px solid #EEE",
            borderRadius: "15px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image src={HomeImage1} alt="firstImage" width={"160px"} height={"160px"} objectFit={"cover"} />
          <InputLabel
            sx={{
              position: "absolute",
              zIndex: 2,
              left: 0,
              bottom: 0,
              width: "100%",
              textAlign: "center",
              background: "#c0c0c0d6",
              padding: "6px 0",
              margin: 0,
            }}
          >
            <span>الصورة الرئيسيه</span>
            <input type="checkbox" />
          </InputLabel>
        </Box>

        <Box
          sx={{
            width: "160px",
            height: "160px",
            border: "1px solid #FFF",
            background: "#FFF",
            borderRadius: "15px",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "35px",
            color: "#45495e",
          }}
        >
          <AiFillCamera size={"35px"} />
          <Input
            type="file"
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              zIndex: 5,
              fontSize: 0,
              transform: "scale(1.5)",
              cursor: "pointer",
            }}
          />
        </Box>
      </Box>
      <AccordionNextBtn onPress={onNextClick} />
    </Box>
  )
}

export default ImagesComponent
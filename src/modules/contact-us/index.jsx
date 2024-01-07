import { Box, Button, Typography } from "@mui/material"
import axios from "axios"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { handleFormErrors } from "../../common/functions"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../translations.json"
import { textAlignStyle } from "../../styles/stylesObjects"

const schema = yup.object({
  problemTitle: yup.string().required("Required"),
  mobileNumber: yup.string().required("Required"),
  email: yup.string().email().required("Required"),
  typeOfCommunication: yup.number().required("Required"),
  meassageDetails: yup.string().required("Required"),
})

const ContactUS = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema) })

  const { locale, push } = useRouter()

  const handleSubmitQuestion = async (values) => {
    try {
      const res = await axios.post(process.env.REACT_APP_API_URL + "/AddEditContactUs", { ...values })
      toast.success(locale === "en" ? "Your Question has been sent successfully!" : "!تم إرسال سؤالك بنجاح")
      push("/")
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Typography variant="h1" fontSize={40} sx={{ textAlign: "center" }}>
          {pathOr("", [locale, "ContactUs", "welcome"], t)}
        </Typography>
        <Typography variant="h2" fontSize={20} sx={{ textAlign: "center", m: "24px 0" }}>
          {pathOr("", [locale, "ContactUs", "ask"], t)}{" "}
        </Typography>
        <form onSubmit={handleSubmit(handleSubmitQuestion)}>
          <Box className="row">
            <Box className="form-group col-md-6">
              <Typography component={"label"} htmlFor="typeOfCommunication" variant="body2">
                {pathOr("", [locale, "ContactUs", "typeOfCumm"], t)}
              </Typography>
              <select
                id="typeOfCommunication"
                {...register("typeOfCommunication")}
                className="form-control form-select"
              >
                <option value={0}>{pathOr("", [locale, "ContactUs", "complaint"], t)}</option>
                <option value={1}>{pathOr("", [locale, "ContactUs", "question"], t)}</option>
              </select>
            </Box>
            <Box className="form-group col-md-6">
              <Typography component={"label"} htmlFor="problemTitle" variant="body2">
                {pathOr("", [locale, "ContactUs", "problemTitle"], t)}
              </Typography>
              <input
                id="problemTitle"
                {...register("problemTitle")}
                className="form-control"
                placeholder={locale === "en" ? "ex: Technical Issue" : "مثال: مشكلة تقنية"}
              />
              <p className="errorMsg">{handleFormErrors(errors, "problemTitle")}</p>
            </Box>
          </Box>
          <Box className="row">
            <Box className="col-md-6">
              <Box className="form-group col-md-12">
                <Typography component={"label"} htmlFor="mobileNumber" variant="body2">
                  {pathOr("", [locale, "ContactUs", "phoneNumber"], t)}
                </Typography>
                <input
                  id="mobileNumber"
                  {...register("mobileNumber")}
                  style={{ ...textAlignStyle(locale) }}
                  type={"tel"}
                  className="form-control"
                  placeholder={locale === "en" ? "Example: +20123456789" : "مثال: +2012456789"}
                />
                <p className="errorMsg">{handleFormErrors(errors, "mobileNumber")}</p>
              </Box>
              <Box className="form-group col-md-12">
                <Typography component={"label"} htmlFor="email" variant="body2">
                  {pathOr("", [locale, "ContactUs", "email"], t)}
                </Typography>
                <input
                  id="email"
                  {...register("email")}
                  className="form-control"
                  placeholder={locale === "en" ? "ex: test@example.com" : "مثال: text@example.com"}
                />
                <p className="errorMsg">{handleFormErrors(errors, "email")}</p>
              </Box>
            </Box>
            <Box className="form-group col-md-6">
              <Typography component={"label"} htmlFor="message" variant="body2">
                {pathOr("", [locale, "ContactUs", "message"], t)}
              </Typography>
              <textarea
                id="message"
                {...register("meassageDetails")}
                className="form-control"
                placeholder={locale === "en" ? "Descripe your question or problem" : "أذكر مشكلتك أو استفسارك"}
              />
              <p className="errorMsg">{handleFormErrors(errors, "meassageDetails")}</p>
            </Box>
            <Button type="submit" variant="contained" sx={{ borderRadius: "20px" }}>
              {pathOr("", [locale, "ContactUs", "send"], t)}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default ContactUS

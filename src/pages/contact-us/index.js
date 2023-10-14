import { Box, Button, Typography } from "@mui/material"
import axios from "axios"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { handleFormErrors } from "../../common/functions"
import Router, { useRouter } from "next/router"
import { headersJson } from "../../../token"
import { pathOr } from "ramda"
import t from "../../translations.json"

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
      const res = await axios.post(process.env.REACT_APP_API_URL + "/AddEditContactUs", { ...values }, headersJson)
      toast.success("Question recieved!")
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
        padding: "24px",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          {pathOr("", [locale, "ContactUs", "welcome"], t)}
        </Typography>
        <Typography variant="h5" sx={{ textAlign: "center", m: "24px 0" }}>
          {pathOr("", [locale, "ContactUs", "ask"], t)}{" "}
        </Typography>
        <form onSubmit={handleSubmit(handleSubmitQuestion)}>
          <Box className="row">
            <Box className="form-group col-md-6">
              <Typography variant="body2"> {pathOr("", [locale, "ContactUs", "typeOfCumm"], t)}</Typography>
              <select {...register("typeOfCommunication")} className="form-control form-select">
                <option value={0}>{pathOr("", [locale, "ContactUs", "complaint"], t)}</option>
                <option value={1}>{pathOr("", [locale, "ContactUs", "question"], t)}</option>
              </select>
            </Box>
            <Box className="form-group col-md-6">
              <Typography variant="body2">{pathOr("", [locale, "ContactUs", "problemTitle"], t)}</Typography>
              <input {...register("problemTitle")} className="form-control" placeholder="ex: Technical Issue" />
              <p className="errorMsg">{handleFormErrors(errors, "problemTitle")}</p>
            </Box>
          </Box>
          <Box className="row">
            <Box className="col-md-6">
              <Box className="form-group col-md-12">
                <Typography variant="body2">{pathOr("", [locale, "ContactUs", "phoneNumber"], t)}</Typography>
                <input
                  {...register("mobileNumber")}
                  type={"tel"}
                  className="form-control"
                  placeholder="ex: +201200000000"
                />
                <p className="errorMsg">{handleFormErrors(errors, "mobileNumber")}</p>
              </Box>
              <Box className="form-group col-md-12">
                <Typography variant="body2"> {pathOr("", [locale, "ContactUs", "email"], t)}</Typography>
                <input {...register("email")} className="form-control" placeholder="ex: me@example.com" />
                <p className="errorMsg">{handleFormErrors(errors, "email")}</p>
              </Box>
            </Box>
            <Box className="form-group col-md-6">
              <Typography variant="body2"> {pathOr("", [locale, "ContactUs", "message"], t)}</Typography>
              <textarea
                {...register("meassageDetails")}
                className="form-control"
                placeholder="Descripe your question"
              />
              <p className="errorMsg">{handleFormErrors(errors, "meassageDetails")}</p>
            </Box>
            <Button type="submit" className="btn btn-main">
              {pathOr("", [locale, "ContactUs", "send"], t)}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default ContactUS

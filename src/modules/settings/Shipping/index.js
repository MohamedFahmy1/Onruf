import React, { useEffect, useState } from "react"
import aramex from "../../../../public/images/aramex.png"
import Router, { useRouter } from "next/router"
import AddShippingOption from "./add"
import { Box, Button, Modal } from "@mui/material"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import axios from "axios"
import { useSelector } from "react-redux"

const Shipping = () => {
  const { locale } = useRouter()
  const [addConditionModal, setAddConditionModal] = useState(false)
  const [shippingOptions, setShippingOptions] = useState([])
  const { buisnessId } = useSelector((state) => state.authSlice)

  const fetchShippingOptions = async () => {
    const {
      data: { data: shippingOptions },
    } = await axios.get("/GetAllShippingOptions", {
      params: { businessAccountId: buisnessId, lang: "ar" },
    })

    setShippingOptions(shippingOptions)
  }

  useEffect(() => {
    fetchShippingOptions()
  }, [])

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: 720,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    overflow: "scroll",
  }

  if (!shippingOptions.length) return "Loading"
  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <div className="d-flex align-items-center">
            <h6 className="f-b m-0">{pathOr("", [locale, "Shipping", "shippingCompanies"], t)}</h6>
          </div>
          <Button className="btn-main" onClick={() => setAddConditionModal(true)}>
            {pathOr("", [locale, "Shipping", "addShippingOpt"], t)}
          </Button>
        </div>
        <div className="row">
          {shippingOptions?.map((option) => (
            <div className="col-lg-3 col-md-6" key={option.id}>
              <a onClick={() => Router.push(`/settings/shipping/${option.id}`)} className="box_company active">
                <img
                  src={option.shippingOptionImage ? option.shippingOptionImage : aramex.src}
                  width={200}
                  height={200}
                />
                <h6 className="f-b">
                  {option.shippingOptionName} <br />
                  <span style={{ fontSize: 12, color: "gray" }}>{option.shippingOptionDescription}</span>
                </h6>
                <button className="btn-main">{option.isActive ? "active" : "in-active"}</button>
                <span className="agree">
                  <i className="fas fa-check-circle"></i>
                </span>
              </a>
            </div>
          ))}
        </div>

        <Modal
          open={addConditionModal}
          onClose={() => {
            setAddConditionModal(false)
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <AddShippingOption
              setAddConditionModal={setAddConditionModal}
              fetchShippingOptions={fetchShippingOptions}
            />
          </Box>
        </Modal>
      </div>
    </div>
  )
}

export default Shipping

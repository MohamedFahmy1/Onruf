import { Row, Col, Modal } from "react-bootstrap"
import React from "react"
import t from "../../translations.json"
import { pathOr } from "ramda"
import { useRouter } from "next/router"
import { toast } from "react-toastify"
import axios from "axios"

const ChangeBranchModal = ({
  openBranchModal,
  setOpenBranchModal,
  branchesData,
  ordersId,
  orderBranch,
  getOrderData,
}) => {
  const {
    locale,
    query: { id },
  } = useRouter()
  const changeOrderBranch = async (branchId) => {
    try {
      await axios.post(`/ChangeMultiOrderBranch?branchId=${branchId}`, ordersId, {
        headers: {
          "content-type": "application/json",
        },
      })
      setOpenBranchModal(false)
      if (id) {
        getOrderData(ordersId[0])
      }
      toast.success(locale === "en" ? "Branch Updated Successfully!" : "!تم تحديد الفرع بنجاح")
    } catch (error) {
      toast.error("Error")
    }
  }
  return (
    <Modal show={openBranchModal} onHide={() => setOpenBranchModal(false)} className="mt-5">
      <Modal.Header>
        <h5 className="modal-title f-b main-color text-center" id="staticBackdropLabel">
          {pathOr("", [locale, "Orders", "select_branch"], t)}
        </h5>
        <button type="button" className="btn-close" onClick={() => setOpenBranchModal(false)} />
      </Modal.Header>
      <Modal.Body>
        <Row>
          {branchesData?.map((item, index) => (
            <Col md={12} key={index}>
              <div className="mb-2 text-center">
                <button
                  className={`fs-5 f-b ${item?.branchId == orderBranch ? `main-color` : ``}`}
                  onClick={() => changeOrderBranch(item.branchId)}
                >
                  {item.branchName}
                </button>
              </div>
            </Col>
          ))}
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default ChangeBranchModal

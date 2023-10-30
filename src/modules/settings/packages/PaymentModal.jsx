import { Modal } from "@mui/material"
import React from "react"

// Confirm Subscribe & Payment
const PaymentModal = ({ showModal = true, setShowModal, pakaID, handleSubscribePackage }) => {
  const style = {
    margin: "auto",
    maxWidth: "1080px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
  return (
    <Modal
      open={showModal}
      onClose={() => {
        setShowModal(false)
      }}
      sx={style}
      aria-labelledby="modal-manage-account"
      aria-describedby="modal-manage-account"
    >
      <div className="col-lg-12">
        <div className="contint_paner p-2">
          <div className="Payment-details" style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <div className="f-b mb-2">لديك كبون خصم</div>
              <div className="po_R overflow-hidden search_P mb-3">
                <input type="text" className="form-control" placeholder="ادخل الكبون" />
                <button className="btn-main">تفعيل</button>
              </div>
              <ul className="list_salary">
                <li>
                  <span>سعر رفع الاعلان</span> <span>1600 ر.س</span>
                </li>
                <li>
                  <span>كوبون الخصم</span> <span>1600 ر.س</span>
                </li>
                <li>
                  <span>تكلفة الباقة</span> <span>1600 ر.س</span>
                </li>
                <li>
                  <span>الضريبة المضافة (12%)</span> <span>1600 ر.س</span>
                </li>
                <li>
                  <span>الاجمالي</span> <span className="f-b">1600 ر.س</span>
                </li>
              </ul>
            </div>
            <div style={{ flex: 1 }}>
              <div className="f-b mb-2">طرق الدفع</div>
              <div className="payment-methods">
                <label className="method_check method_check1">
                  <input type="radio" name="payment" checked />
                  <span className="bord"></span>
                  <span>فيزا / ماستر كارد</span>
                </label>
                <div className="info-payment-methods">
                  <div className="f-b mb-1">الدفع عن طريق الفيزا</div>
                  <div className="mb-2">
                    اجمالي الطلب <span className="main-color f-b">1750 ر.س</span>
                  </div>
                  <label className="method_check rounded-pill">
                    <div>
                      <input type="radio" name="visa_num" />
                      <span className="bord rounded-pill"></span>
                      <span className="back"></span>
                      <span className="main-color">**********1410</span>
                    </div>
                    <img src="../core/imgs/MasterCard.png" width="26" />
                  </label>
                  <button className="btn-main btn-main-w border border-1 gray-color mt-2 w-100">
                    اضافة بطاقة جديدة
                  </button>
                </div>

                <label className="method_check">
                  <input checked type="radio" name="payment" />
                  <span className="bord"></span>
                  <span>Cash on delivery</span>
                </label>
              </div>
              <button
                className="btn-main mt-2 w-100"
                data-bs-toggle="modal"
                data-bs-target="#add-product_"
                onClick={() => handleSubscribePackage(pakaID)}
              >
                اشتراك{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PaymentModal

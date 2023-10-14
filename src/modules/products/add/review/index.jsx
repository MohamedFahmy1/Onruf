import React, { useEffect, useState } from "react"
import styles from "./productReview.module.css"
import Router, { useRouter } from "next/router"
import { Row, Col } from "react-bootstrap"
import Link from "next/link"
import masterCardImg from "../../../../public/images/MasterCard.png"
import { FaCheckCircle } from "react-icons/fa"
import axios from "axios"
import { toast } from "react-toastify"
import { useSelector, useDispatch } from "react-redux"
import { getProductById, getProductPack, getProductCategory } from "../../../../appState/product/productActions"

const AddProductReview = () => {
  const router = useRouter()
  const { locale } = useRouter()
  const productId = router.query.id

  const product = useSelector((state) => state?.product?.data)
  const pack = useSelector((state) => state?.productPack)
  const category = useSelector((state) => state?.productCategory)
  const dispatch = useDispatch()

  const [couponCode, setCouponCode] = useState("")
  const [additionalPakat, setAdditionalPakat] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("Cash")

  const getAdditionalPakat = async () => {
    try {
      const data = await axios.get(
        process.env.REACT_APP_API_URL +
          `/CheckOutAdditionalPakat?pakatId=${product.pakatId}&categoryId=${product.categoryId}`,
      )
      setAdditionalPakat(data?.data?.data)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const applyCoupon = async () => {
    try {
      const res = await axios.post(
        process.env.REACT_APP_API_URL + `/CheckOutAdditionalPakatApplyCoupon?couponCode=${couponCode}`,
        additionalPakat,
      )
      setAdditionalPakat(res?.data?.data)
      setCouponCode("")
    } catch (err) {
      console.error("error", err)
      toast.error(err.response.data.message)
    }
  }
  useEffect(() => {
    productId && dispatch(getProductById(productId, locale))
    product.pakatId && dispatch(getProductPack(product.pakatId))
    product.categoryId && dispatch(getProductCategory(product.categoryId, locale))
    product.pakatId && product.categoryId && getAdditionalPakat()
  }, [productId, product.pakatId, product.categoryId])

  const handleBack = (e) => {
    e.preventDefault()
    router.push("/products")
  }

  const totalPrice = +product?.price + +pack?.users?.data?.data?.price

  const handlePayProduct = async () => {
    await axios.post(
      process.env.REACT_APP_API_URL +
        `/PakatPaymentTransaction?pakatId=${additionalPakat.pakatId}&typePay=${paymentMethod}`,
    )
    try {
      const data = new FormData()
      data.append("productId", product?.id)
      // data.append('coponId', )
      data.append("publishPrice", category?.users.data.data.productPublishPrice)
      data.append("packagePrice", pack?.users.data.data.price)
      // data.append('vat', )
      data.append("total", totalPrice)

      await axios.post(process.env.REACT_APP_API_URL + `/PayForProduct?lang=${locale}&currentPage=1`, data)
      toast.success(locale === "en" ? "Products has been created successfully!" : "تم اضافة المنتج بنجاح")
      Router.push(`/${locale}/products`)
    } catch (err) {
      console.error("error", err)
      toast.error(err.response.data.message)
    }
  }

  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">مراجعة المنتج قبل اضافتة</h6>
          <a onClick={handleBack} className="btn-main btn-main-o">
            الغاء
          </a>
        </div>
        <Row>
          <Col lg={9}>
            <div className="contint_paner">
              <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
                <h6 className="f-b m-0">تفاصيل المنتج</h6>
                <Link href={`/${locale}/edit/${product?.id}`}>
                  <a className="main-color f-b">تعديل</a>
                </Link>
              </div>
              <Row className="align-items-center">
                <Col lg={6}>
                  <div className="d-flex align-items-center gap-1">
                    <img
                      src={
                        (product && product.listMedia?.find((media) => media?.isMainMadia)?.url) ||
                        "https://miro.medium.com/max/600/0*jGmQzOLaEobiNklD"
                      }
                      className="img_table"
                    />
                    <div>
                      <div className="gray-color">{product?.category}</div>
                      <div className="f-b">{product?.name}</div>
                      <div className="gray-color">{product?.subTitle}</div>
                    </div>
                  </div>
                </Col>
                <Col lg={6}>
                  <div>
                    <div className={styles["info_boxo_"]}>
                      <span>حالة السلعة</span>
                      <span>{product && product && product.status === 1 ? "مستعمل" : "جديد"}</span>
                    </div>
                    <div className={styles["info_boxo_"]}>
                      <span>الكمية</span>
                      <span>{product && product.qty === 1 ? "قطعة واحدة" : `${product && product.qty} قطع`}</span>
                    </div>
                  </div>
                </Col>
              </Row>
              <p className="mt-4">{product && product.description}</p>
            </div>
            <div className="contint_paner">
              <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
                <h6 className="f-b m-0">تفاصيل المنتج</h6>
                <Link href={`/${locale}/edit/${product?.id}`}>
                  <a className="main-color f-b">تعديل</a>
                </Link>
              </div>
              <Row>
                <Col md={6}>
                  <div className={styles["info_boxo_"]}>
                    <span>نوع البيع</span>
                    <div className="d-flex gap-2">
                      {Boolean(product && product.isNegotiationOffers) && (
                        <span>
                          تفاوض
                          <span className="font-18 main-color mx-1">
                            <FaCheckCircle />
                          </span>
                        </span>
                      )}
                      {Boolean(product && product.withFixedPrice) && (
                        <span>
                          سعر ثابت
                          <span className="font-18 main-color mx-1">
                            <FaCheckCircle />
                          </span>
                        </span>
                      )}
                      {Boolean(product && product.isMazad) && (
                        <span>
                          مزاد
                          <span className="font-18 main-color mx-1">
                            <FaCheckCircle />
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className={styles["info_boxo_"]}>
                    <span>سعر الشراء</span>
                    <span>{product && product.price} S.R</span>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="contint_paner">
              <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
                <h6 className="f-b m-0">الباقة المختارة</h6>
                <Link href={`/${locale}edit/${product?.id}`}>
                  <a className="main-color f-b">تعديل</a>
                </Link>
              </div>
              <div className={styles["info_boxo_"]}>
                <span>{product && product.pakatId}</span>
                <span className="font-18 main-color">
                  <FaCheckCircle />
                </span>
              </div>
            </div>
          </Col>
          <Col lg={3}>
            <div className="contint_paner p-2">
              <div className={styles["Payment-details"]}>
                <div className="f-b mb-2">لديك كبون خصم</div>
                <div className={`po_R overflow-hidden mb-3 ${styles["search_P"]}`}>
                  <input
                    type="text"
                    className={`form-control ${styles["form-control"]}`}
                    placeholder="ادخل الكبون"
                    onChange={(e) => setCouponCode(e.target.value)}
                    value={couponCode}
                  />
                  <button onClick={applyCoupon} className={`btn-main ${styles["btn-main"]}`}>
                    تفعيل
                  </button>
                </div>
                <ul className={styles["list_salary"]}>
                  <li>
                    <span>سعر رفع الاعلان</span> <span>{additionalPakat.productPublishPrice} ر.س</span>
                  </li>
                  {couponCode ? (
                    <li>
                      <span>كوبون الخصم</span> <span>{couponCode}</span>
                    </li>
                  ) : null}
                  <li>
                    <span>تكلفة الباقة</span> <span>{additionalPakat.pakatPrice} ر.س</span>
                  </li>
                  <li>
                    <span>السعر قبل الكوبون</span> <span>{additionalPakat.totalPriceBeforeCoupon} ر.س</span>
                  </li>
                  <li>
                    <span>السعر بعد الكوبون</span> <span>{additionalPakat.totalPriceAfterCoupon} ر.س</span>
                  </li>
                </ul>
                <hr />
                <div className="f-b mb-2">طرق الدفع</div>
                <div className="payment-methods">
                  <label className={`${styles["method_check"]}, ${styles["method_check1"]}`}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "Cash" ? true : false}
                      onClick={() => setPaymentMethod("Cash")}
                    />
                    <span className={styles["bord"]} />
                    <span>Cash </span>
                  </label>
                  <label className="method_check">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "Online" ? true : false}
                      onClick={() => setPaymentMethod("Online")}
                    />
                    <span className={styles["bord"]} />
                    <span className="mx-2">Online</span>
                  </label>
                  <label className="method_check">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "Banking Transfer" ? true : false}
                      onClick={() => setPaymentMethod("Banking Transfer")}
                    />
                    <span className={styles["bord"]} />
                    <span className="mx-2">Banking Transfer</span>
                  </label>

                  <button
                    className={`${styles["btn-main"]} btn-main mt-2 w-100`}
                    data-bs-toggle="modal"
                    data-bs-target="#add-product_"
                    onClick={handlePayProduct}
                  >
                    اضافة المنتج
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default AddProductReview




import {OrderDetails} from "../../modules/orders/orderDetails/index"
import Head from "next/head"



const OrderDetailsPage = () => {
    return (
        <>
            <Head>
                <title>تعديل المنتج - اونرف</title>
            </Head>
            <OrderDetails />
        </>
    );
}


 
export default OrderDetailsPage

// import axios from "axios"
// import { useRouter } from "next/router"
// import { pathOr } from "ramda"
// import React, { useEffect, useState } from "react"
// import { headersJson } from "../../../token"
// import t from '../../translations.json'

// const OrderDetails = () => {

//   const { locale } = useRouter()
//   const router = useRouter()
//   const [orderData , setOrderData]= useState()
//   // Loading
  
// const getOrderData =async (id) => {
//   const {
//     data: { data: orderData },
//   } = await axios.get(`${process.env.REACT_APP_API_URL}/GetOrderDetailsByOrderId`, {
//     params: {
//       orderId: id,
//     },
//   })
//   setOrderData(orderData)
// }
// useEffect(() => {
// router.query.id && getOrderData(router.query.id)
// console.log("orderData",orderData)
// },[router.query.id])
// if (!orderData) return ""

//   // Render Order Data
//   const { quantity, providerName, productName, price, iamge: image } = orderData
//   return (
//     <div style={{ padding: "24px" }}>
//       <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
//         <h6 className="f-b m-0">{pathOr("", [locale, "Orders", "orderDetails"], t)}</h6>
//         <a href="#" className="btn-main">
//           تحميل الفاتوره
//         </a>
//       </div>
//       <div className="row">
//         <div className="col-lg-4">
//           <div className="d-flex gap-3">
//             <div className="form-group flex-grow-1 mb-1">
//               <div className="po_R">
//                 <label>حالة الطلب</label>
//                 <select className="form-control form-select border-0 rounded">
//                   <option>مستلمة</option>
//                   <option>-----</option>
//                   <option>-----</option>
//                 </select>
//               </div>
//             </div>
//             <div className="form-group flex-grow-1 mb-1">
//               <div className="po_R">
//                 <label>حدد الفرع</label>
//                 <select className="form-control form-select border-0 rounded">
//                   <option>حائل</option>
//                   <option>-----</option>
//                   <option>-----</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//           <div className="contint_paner p-0">
//             <ul className="info_box_order d-flex flex-wrap">
//               <li>
//                 <span className="gray-color">رقم الطلب</span>
//                 <div className="f-b">#2525</div>
//               </li>
//               <li>
//                 <span className="gray-color">نوع الطلب</span>
//                 <div className="f-b">مزاد رابح</div>
//               </li>
//               <li>
//                 <span className="gray-color">وقت الطلب</span>
//                 <div className="f-b">12:00PM 20/2/2020</div>
//               </li>
//               <li>
//                 <span className="gray-color">عدد الشحنات</span>
//                 <div className="f-b">{quantity}</div>
//               </li>
//               <li>
//                 <span className="gray-color">مجموع الطلب</span>
//                 <div className="f-b">350 ريال</div>
//               </li>
//               <li>
//                 <span className="gray-color">حالة الطلب</span>
//                 <div className="f-b main-color">مستلمة</div>
//               </li>
//             </ul>
//           </div>
//         </div>

//         <div className="col-lg-4">
//           <div className="contint_paner mt-0 p-0">
//             <div className="detalis-customer">
//               <div className="d-flex gap-2 mb-2 p-3">
//                 <image src="../core/imgs/user.png" className="img img_table2" alt="" />
//                 <div>
//                   <div className="mb-2">
//                     <h6 className="f-b m-0">{providerName}</h6>
//                     <div className="gray-color">ali.reda1995@yahoo.com</div>
//                   </div>
//                   {/* <ul className="d-flex gap-1 contuct">
//                     <li>
//                       <a href="">
//                         <image src="../core/imgs/email.png"  alt=""/>
//                       </a>
//                     </li>
//                     <li>
//                       <a href="">
//                         <image src="../core/imgs/sms.png" alt="" />
//                       </a>
//                     </li>
//                     <li>
//                       <a href="">
//                         <image src="../core/imgs/whatsapp.png" alt="" />
//                       </a>
//                     </li>
//                   </ul> */}
//                 </div>
//               </div>
//               <hr className="m-0" />
//               <div className="d-flex align-items-end justify-content-between gap-3 p-3">
//                 <div>
//                   <h6 className="f-b">عنوان العميل</h6>
//                   <p>اول مكرم - مدينة نصر - القاهرة B123589 - عماره 22 - الدور الرابع</p>
//                   <p>01013151410</p>
//                 </div>
//                 <button className="btn-main btn-main-o">بوليصة الشحن</button>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-lg-4">
//           <div className="contint_paner mt-0 p-0">
//             <div className="info_elomola">
//               <ul>
//                 <li>
//                   <span>المجموع الفرعي</span> <span className="font-18">{price} ر.س</span>
//                 </li>
//                 <li>
//                   <span>تكلفة التوصيل</span> <span className="font-18">{price} ر.س</span>
//                 </li>
//                 <li>
//                   <span>الضريبة المضافة (12%)</span> <span className="font-18">{price} ر.س</span>
//                 </li>
//               </ul>
//               <aside>
//                 <span>الاجمالي</span> <span className="font-18 f-b">{price} ر.س</span>
//               </aside>
//             </div>
//           </div>
//         </div>

//         <div className="col-12">
//           <div className="contint_paner">
//             <h5 className="f-b">المنتجات</h5>
//             <div className="all_list_producto mb-3">
//               <div className="head">
//                 <h6 className="m-0 f-b">عدد المنتجات</h6> <div>{quantity}</div>
//               </div>
//               <ul>
//                 <li className="item">
//                   <div className="d-flex align-items-center gap-1">
//                     <image src={image} className="img_table" alt="" />
//                     <div>
//                       <div className="gray-color">الكترونيات - هواتف</div>
//                       <div className="f-b">{productName}</div>
//                       <div className="gray-color">لا يوجد به اي خدوش</div>
//                     </div>
//                   </div>
//                   <div className="text-center">
//                     <h5 className="f-b main-color m-0">{price} S.R</h5>
//                     <div className="num">{quantity}</div>
//                   </div>
//                 </li>
//               </ul>
//             </div>
//             <div className="all_list_producto p-3">
//               <div className="info_shan">
//                 <span>الشحن</span> <span className="f-b">شحن مجاني في السعودية</span>
//               </div>
//               <div className="info_shan">
//                 <span>وسيلة الدفع</span> <span className="f-b">عن طريق البنك</span>
//               </div>
//               <div className="po_R upload_filo my-3">
//                 <input type="text" className="form-control" readOnly value="تم ارفاق الفاتورة" />
//                 <div className="btn_file">
//                   <input type="file" />
//                   تحميل الفاتورة
//                 </div>
//               </div>
//               <div className="info_shan">
//                 <span>اجمالي الشحن</span> <span className="f-b main-color">155 S.R</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="col-12">
//           <div className="contint_paner p-0">
//             <h5 className="f-b p-4 m-0">سجل الطلب</h5>
//             <ul className="all-order-record">
//               <li className="item">
//                 <div className="d-flex align-items-center">
//                   <image src="../core/imgs/delivery-truck.png" alt="" />
//                   <div>
//                     <div className="gray-color">Ali reda</div>
//                     <div className="f-b main-color">تغيير حالة المنتج الي مرحلة التوصيل</div>
//                   </div>
//                 </div>
//                 <div className="gray-color">منذ 6 ساعات</div>
//               </li>
//               <li className="item">
//                 <div className="d-flex align-items-center">
//                   <image src="../core/imgs/shopping.png" alt="" />
//                   <div>
//                     <div className="gray-color">Ali reda</div>
//                     <div className="f-b main-color">تغيير حالة المنتج الي تم التسليم</div>
//                   </div>
//                 </div>
//                 <div className="gray-color">منذ 6 ساعات</div>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export async function getServerSideProps({ query: { id = 548 } }) {
//   const {
//     data: { data: orderData },
//   } = await axios.get(`${process.env.REACT_APP_API_URL}/GetOrderDetailsByOrderId`, {
//     ...headersJson,
//     params: {
//       orderId: 548,
//     },
//   })
//   return {
//     props: {
//       orderData: orderData[0],
//     },
//   }
// }

// export default OrderDetails

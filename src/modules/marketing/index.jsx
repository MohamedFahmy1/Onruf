import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './marketing.module.css'
import { useSelector } from 'react-redux';
import axios from 'axios';


const Marketing = () => {


    const token = useSelector((state) => state.authSlice.token);
    const providerId = useSelector((state) => state.authSlice.providerId);
    const [offers,setOffers] =useState()
    const getOffers =async() => {
            const { data:{data:offers}  } = await axios(
              `${process.env.REACT_APP_API_URL}/ListAdminCoupons?currentPage=${1}&maxRows=${10}`,
               { header:{
                Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmRyZWQiLCJ1c2VyX2lkIjoiMDI5YWNmZGMtOTQyOS00M2RhLTgzYTctNTJhYTQ5NzZjZDY2IiwidHlwZV91c2VyIjoiMiIsImV4cCI6MTcwMzgyODk1MSwiaXNzIjoiaHR0cDovL3d3dy5zZWN1cml0eS5vcmciLCJhdWQiOiJodHRwOi8vd3d3LnNlY3VyaXR5Lm9yZyJ9.7nt9Z4fc-Nf1YxS0HAqiWEagY2f3qz1EiesLos6EjBQ",
                "Provider-Id": "029acfdc-9429-43da-83a7-52aa4976cd66",
              }
            }
            );
            setOffers(offers)
    }

    useEffect(() => {
        getOffers()
    },[token])
 

    return (
        <div className="body-content">
            <div>
                <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
                    <div className="d-flex align-items-center">
                        <h6 className="f-b m-0">التسويق مع اونرف ({offers && offers.length})</h6>
                    </div>
                </div>
                <div className="row">
                    {Boolean(offers && offers?.length) && offers.map(offer =>
                        <div className="col-lg-4" key={offer.id}>
                            <div className={styles["box_shopping"]}>
                                <img src={offer.image} />
                                <h6 className="f-b">{offer.couponCode}</h6>
                                <p className="mb-2">{offer.description}</p>
                                {offer.discountTypeID === "FixedAmount" &&
                                    <>
                                        <div className="font-18">قيمة التخفيض</div>
                                        <h4 className="f-b main-color">{offer.discountValue}%</h4>
                                    </>
                                }
                                {offer.discountTypeID === 2 &&
                                    <>
                                        <div className="font-18">نسبة التخفيض</div>
                                        <h4 className="f-b main-color">{offer.discountPercentage}%</h4>
                                    </>
                                }
                                <Link href={`marketing/join-campaign/${offer.id}`}>
                                    <a className="btn-main d-block">الانضمام للقسيمة</a>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Marketing

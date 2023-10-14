import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import t from "../../../translations.json"
import { pathOr } from "ramda"
import { formatDate } from "../../../common/functions"
import axios from "axios"
import { toast } from "react-toastify"

// Assets
import PointsIcon from "../../../assets/images/point_icon.svg"
import Image from "next/image"

const MyPoints = () => {
  const { locale, push } = useRouter()
  const [points, setPoints] = useState(0)
  const [myPointsData, setPointsData] = useState({})
  const { newInvitationCode, pointsTransactionslist, invitationCodePoints, monyOfPointsTransfered, pointsBalance } =
    myPointsData

  const handleTransferPointsToMoney = async () => {
    try {
      await axios.post(
        process.env.REACT_APP_API_URL + "/TransferPointsToMoney",
        {},
        {
          params: { transactionPointsAmount: parseInt(points) },
        },
      )
      toast.success("Transaction Successfull")
      fetchMyPointsData()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchMyPointsData = async () => {
    const {
      data: { data: myPointsData },
    } = await axios.get(process.env.REACT_APP_API_URL + "/GetUserPointsTransactions")
    setPointsData(myPointsData)
  }

  useEffect(() => {
    fetchMyPointsData()
  }, [])

  return (
    <div className="body-content">
      <div>
        <div className="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
          <h6 className="f-b m-0">{pathOr("", [locale, "Points", "myPoints"], t)}</h6>
        </div>
        <div className="contint_paner">
          <div className="row">
            <div className="col-lg-4">
              <div className="info_sec_">
                <div className="icon">
                  <Image src={PointsIcon} width={32} height={32} />
                </div>
                <h4 className="gray-color m-0">{pathOr("", [locale, "Points", "myPoints"], t)}</h4>
                <h5 className="f-b m-0">{pointsBalance}</h5>
                <div className="font-11">
                  <a href="" className="under-line">
                    {pathOr("", [locale, "Points", "myPointsDetails"], t)}
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="info_sec_">
                <Image
                  src={require("../../../assets/images/Outline.svg")}
                  width={32}
                  height={32}
                  className="img-fluid"
                />
                <h5 className="gray-color m-0">{pathOr("", [locale, "Points", "shareInviteCode"], t)}</h5>
                <div className="font-11">واحصل علي {invitationCodePoints} نقطة علي كل متجر جديد</div>
                <div className="shared d-flex gap-2 align-items-center">
                  <div className="num">{newInvitationCode}</div>
                  <div className="img_">
                    <Image src={require("../../../assets/images/share.svg")} className="img-fluid" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div>
                <div>
                  <h5>{pathOr("", [locale, "Points", "changePointsToCredit"], t)}</h5>
                  <div className="main-color">
                    كل {invitationCodePoints} نقطة ب {monyOfPointsTransfered} ريال
                  </div>
                </div>
                <div className="my-2 po_R">
                  <input
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    type="number"
                    className="form-control"
                  />
                  <span className="icon_fa main-color">SAR</span>
                </div>
                <button className="btn-main d-block w-100" onClick={handleTransferPointsToMoney}>
                  {pathOr("", [locale, "Points", "send"], t)}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="mb-4">{pathOr("", [locale, "Points", "lastProcesses"], t)}</h5>
            {pointsTransactionslist?.map((transaction) => (
              <div key={transaction.id} className="item_Processes">
                <div className="f-b">
                  <div>{transaction.transactionSource}</div>
                  <div className="gray-color">{formatDate(transaction.transactionDate)}</div>
                </div>
                <h5 className="m-0 main-color f-b text-center">
                  <span className="d-block">{transaction.transactionAmount}</span>
                  Points
                </h5>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPoints

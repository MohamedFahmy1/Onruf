import { useState } from "react"
import { useRouter } from "next/router"
import t from "../../../translations.json"
import { pathOr } from "ramda"
import { formatDate, onlyNumbersInInputs } from "../../../common/functions"
import axios from "axios"
import { toast } from "react-toastify"
import PointsIcon from "../../../assets/images/point_icon.svg"
import Image from "next/image"
import ShareModal from "./ShareModal"
import { multiFormData } from "../../../common/axiosHeaders"
import { useFetch } from "../../../hooks/useFetch"
import Alerto from "../../../common/Alerto"

const MyPoints = () => {
  const { locale } = useRouter()
  const [points, setPoints] = useState(0)
  const { data: myPointsData = {}, fetchData: fetchMyPointsData } = useFetch(`/GetUserPointsTransactions`)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { newInvitationCode, pointsTransactionslist, invitationCodePoints, monyOfPointsTransfered, pointsBalance } =
    myPointsData

  const handleTransferPointsToMoney = async () => {
    try {
      await axios.post(
        "/TransferPointsToMoney",
        {
          params: { transactionPointsAmount: parseInt(points) },
        },
        multiFormData,
      )
      toast.success(locale === "en" ? "Transaction Successfull" : "تمت العملية بنجاح")
      fetchMyPointsData()
    } catch (error) {
      Alerto(error)
    }
  }

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
                  <Image src={PointsIcon} width={32} height={32} alt="points" />
                </div>
                <h4 className="gray-color m-0">{pathOr("", [locale, "Points", "myPoints"], t)}</h4>
                <h5 className="f-b m-0">{pointsBalance}</h5>
                <div className="font-11">
                  <p className="under-line">{pathOr("", [locale, "Points", "myPointsDetails"], t)}</p>
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
                  alt="outline"
                />
                <h5 className="gray-color m-0">{pathOr("", [locale, "Points", "shareInviteCode"], t)}</h5>
                <div className="font-11">
                  {pathOr("", [locale, "Points", "and_get"], t)} {invitationCodePoints}{" "}
                  {pathOr("", [locale, "Points", "for_every_new_store"], t)}
                </div>
                <div className="shared d-flex gap-2 align-items-center">
                  <div className="num">{newInvitationCode}</div>
                  <div className="img_" onClick={() => setIsModalOpen(true)}>
                    <Image src={require("../../../assets/images/share.svg")} className="img-fluid" alt="share" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div>
                <div>
                  <h5>{pathOr("", [locale, "Points", "changePointsToCredit"], t)}</h5>
                  <div className="main-color">
                    {locale === "en"
                      ? `Every ${invitationCodePoints} points for ${monyOfPointsTransfered} Riyals`
                      : `كل ${invitationCodePoints} نقطة ب ${monyOfPointsTransfered} ريال`}
                  </div>
                </div>
                <div className="my-2 po_R">
                  <label htmlFor="points" className="visually-hidden">
                    {"points"}
                  </label>
                  <input
                    id="points"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    type="number"
                    onKeyDown={onlyNumbersInInputs}
                    className="form-control"
                  />
                  <span
                    className="icon_fa main-color"
                    style={{
                      right: locale === "en" ? "25px" : undefined,
                      width: "fit-content",
                      left: locale === "en" ? "inherit" : "25px",
                    }}
                  >
                    {pathOr("", [locale, "Products", "currency"], t)}
                  </span>
                </div>
                <button className="btn-main d-block w-100" onClick={handleTransferPointsToMoney}>
                  {pathOr("", [locale, "Points", "send"], t)}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h5 className="mb-4">{pathOr("", [locale, "Points", "lastProcesses"], t)}</h5>
            {console.log(pointsTransactionslist)}
            {pointsTransactionslist?.length > 0 ? (
              pointsTransactionslist?.map((transaction) => (
                <div key={transaction.id} className="item_Processes">
                  <div className="f-b">
                    <div>{transaction.transactionSource}</div>
                    <div className="gray-color">{formatDate(transaction.transactionDate)}</div>
                  </div>
                  <h5 className="m-0 main-color f-b text-center">
                    <span className="d-block">{transaction.transactionAmount}</span>
                    {pathOr("", [locale, "Points", "points"], t)}
                  </h5>
                </div>
              ))
            ) : (
              <p>{locale === "en" ? "No Data to Show !" : "لا يوجد بيانات"}</p>
            )}
          </div>
          <ShareModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} registrationCode={newInvitationCode} />
        </div>
      </div>
    </div>
  )
}

export default MyPoints

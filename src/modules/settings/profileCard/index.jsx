import React from "react"
import { Col } from "react-bootstrap"
import Avatar from "../../../public/images/user.png"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { formatDate } from "../../../common/functions"

const ProfileCard = ({ id, businessAccountNameEn, commercialRegisterFile, rate, createdAt, BusinessAccountImage, ...props }) => {
  const { locale, push } = useRouter()
  return (
    <Col lg={4}>
      <div className="contint_paner">
        <div className="text-center">
          <img src={BusinessAccountImage ? BusinessAccountImage : Avatar} className="img_table m-0 rounded-circle mb-2" />
          <h6 className="f-b">{businessAccountNameEn}</h6>
          <div className="gray-color font-11 f-b mb-2">
            <div className="mb-1">
              {pathOr("", [locale, "Settings", "userFrom"], t)} : {formatDate(createdAt)}
            </div>
          </div>
          <div>حساب خاص</div>
          <div className="imogy">
            <span>4.5</span>
          </div>
          <a className="btn-main d-block mt-3" onClick={() => push({ pathname: (`/settings/editAccount/${id}`) })}>
            {pathOr("", [locale, "Settings", "editAccount"], t)}
          </a>
        </div>
      </div>
    </Col>
  )
}

export default ProfileCard

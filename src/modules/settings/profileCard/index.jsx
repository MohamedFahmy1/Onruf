import React from "react"
import { Col } from "react-bootstrap"
import Avatar from "../../../../public/images/user.png"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { formatDate } from "../../../common/functions"
import rating from "../../../../public/images/rating.png"
import Image from "next/image"
const ProfileCard = ({
  id,
  businessAccountNameEn,
  commercialRegisterFile,
  rate,
  createdAt,
  businessAccountImage,
  ...props
}) => {
  const { locale, push } = useRouter()
  return (
    <Col lg={4}>
      <div className="contint_paner">
        <div className="text-center">
          <img
            src={businessAccountImage ? businessAccountImage : Avatar}
            className="img_table m-0 rounded-circle mb-2"
            alt="user"
          />
          <h6 className="f-b">{businessAccountNameEn}</h6>
          <div className="gray-color font-11 f-b mb-2">
            <div className="mb-1">
              {pathOr("", [locale, "Settings", "userFrom"], t)} : {formatDate(createdAt)}
            </div>
          </div>
          <div className="imogy">
            <span>{rate?.toFixed(1)}</span>
            <Image src={rating} alt="rating" width={30} height={30} />
          </div>
          <a className="btn-main d-block mt-3" onClick={() => push({ pathname: `/settings/editAccount/${id}` })}>
            {pathOr("", [locale, "Settings", "editAccount"], t)}
          </a>
        </div>
      </div>
    </Col>
  )
}

export default ProfileCard

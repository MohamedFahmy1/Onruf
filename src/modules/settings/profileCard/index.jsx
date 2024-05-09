import React from "react"
import { Col } from "react-bootstrap"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import t from "../../../translations.json"
import { formatDate, handleShowRatingEmoji } from "../../../common/functions"
import ResponsiveImage from "../../../common/ResponsiveImage"
import Link from "next/link"
import { Skeleton } from "@mui/material"

const ProfileCard = ({ id, businessAccountNameEn, rate, createdAt, businessAccountImage }) => {
  const { locale } = useRouter()

  return (
    <Col lg={4}>
      <section className="contint_paner">
        <div className="text-center">
          <div className="img_table mx-auto rounded-circle mb-2">
            {businessAccountImage ? (
              <ResponsiveImage imageSrc={businessAccountImage} alt="user" width="100px" height="100px" />
            ) : (
              <Skeleton variant="circular" width={100} height={100} />
            )}
          </div>
          <h6 className="f-b">
            {businessAccountNameEn ? businessAccountNameEn : <Skeleton variant="text" sx={{ fontSize: "16px" }} />}
          </h6>
          <div className="gray-color font-11 f-b mb-2">
            <div className="mb-1 d-flex justify-content-center">
              {pathOr("", [locale, "Settings", "userFrom"], t)} :
              {createdAt !== undefined ? (
                formatDate(createdAt)
              ) : (
                <Skeleton variant="text" sx={{ fontSize: "11px" }} width={70} />
              )}
            </div>
          </div>
          <div className="imogy">
            {handleShowRatingEmoji(rate)}
            <span className="mx-2">
              {rate ? rate?.toFixed(1) : <Skeleton variant="text" width={20} sx={{ fontSize: "15px" }} />}
            </span>
          </div>
          <Link href={`/settings/editAccount/${id}`}>
            <span className="btn-main d-block mt-3">{pathOr("", [locale, "Settings", "editAccount"], t)}</span>
          </Link>
        </div>
      </section>
    </Col>
  )
}

export default ProfileCard

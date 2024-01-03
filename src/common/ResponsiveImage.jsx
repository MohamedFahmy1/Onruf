import Image from "next/image"
import React, { useState } from "react"
import noImage from "../../public/images/noImae.png"

const ResponsiveImage = ({ imageSrc, alt, width = "106px", height = "100px" }) => {
  const [image, setImage] = useState(imageSrc)
  const handleError = () => {
    setImage(noImage.src)
  }
  return (
    <div style={{ position: "relative", width: width, height: height }}>
      <Image
        src={image}
        className="img_table"
        alt={alt}
        priority
        layout="fill"
        objectFit="contain"
        onError={handleError}
      />
    </div>
  )
}

export default ResponsiveImage

import Image from "next/image"
import { useRouter } from "next/router"
import { pathOr } from "ramda"
import React, { Fragment, useId, useState } from "react"
import { Accordion } from "react-bootstrap"
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"
import { FaCamera } from "react-icons/fa"
import { IoIosClose } from "react-icons/io"
import t from "../../../../translations.json"
import styles from "./stepTwo.module.css"
import { toast } from "react-toastify"

const ProductImages = ({ productPayload, setProductPayload, validateProductImages, setEventKey }) => {
  const { locale, pathname } = useRouter()
  const [mainImgId, setMainImgId] = useState(null)
  const id = useId()

  const handleUploadImages = (e) => {
    const files = Array.from(e.target.files)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
    const newFiles = []

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        return toast.error(locale === "en" ? "Only image files are allowed!" : "مسموح برفع الصور")
      }
      file.id = Math.random() * (Number.MAX_SAFE_INTEGER - Number.MIN_SAFE_INTEGER) + Number.MIN_SAFE_INTEGER
      newFiles.push(file)
    })
    // if first time upload images
    if (!mainImgId) {
      setProductPayload((prev) => ({ ...prev, MainImageIndex: 0 }))
    }
    if (newFiles.length > 0) {
      setProductPayload((prev) => ({
        ...prev,
        listImageFile: [...(prev.listImageFile || []), ...newFiles],
      }))
    }

    e.target.value = null
  }

  const handleUrlChange = (index, event) => {
    const newVideoUrls = [...productPayload.videoUrl]
    newVideoUrls[index] = event.target.value
    setProductPayload({ ...productPayload, videoUrl: newVideoUrls })
  }

  const addUrlField = () => {
    const newVideoUrls = [...productPayload.videoUrl, ""]
    if (productPayload.videoUrl.every((url) => url.trim() !== "")) {
      setProductPayload((prev) => ({ ...prev, videoUrl: newVideoUrls }))
    }
  }

  const removeUrlField = (index) => {
    const newVideoUrls = [...productPayload.videoUrl]
    if (newVideoUrls.length > 1) {
      newVideoUrls.splice(index, 1)
      setProductPayload((prev) => ({ ...prev, videoUrl: newVideoUrls }))
    }
  }

  const removeUrlFieldFromListmedia = (id) => {
    setProductPayload((prev) => ({
      ...prev,
      listMedia: productPayload.listMedia?.filter((item) => item.id !== id),
      DeletedMedias: [...productPayload.DeletedMedias, id],
    }))
  }

  const handleRemoveImage = (index) => {
    let updatedIndex
    pathname.includes("add")
      ? (updatedIndex = index)
      : (updatedIndex = index + productPayload?.listMedia?.filter((item) => item.type === 1).length)
    if (updatedIndex === productPayload.MainImageIndex) {
      setProductPayload({
        ...productPayload,
        MainImageIndex: null,
        listImageFile: productPayload.listImageFile?.filter((_, i) => i !== index),
      })
    } else if (updatedIndex > productPayload.MainImageIndex) {
      setProductPayload({
        ...productPayload,
        listImageFile: productPayload.listImageFile?.filter((_, i) => i !== index),
      })
    } else {
      setProductPayload({
        ...productPayload,
        MainImageIndex: productPayload.MainImageIndex - 1,
        listImageFile: productPayload.listImageFile?.filter((_, i) => i !== index),
      })
    }
  }

  const handleRemoveImageFromListmedia = (id, index) => {
    let updatedImages = productPayload.listMedia?.filter((item) => item.type === 1)
    if (index === productPayload.MainImageIndex) {
      setProductPayload({
        ...productPayload,
        MainImageIndex: null,
        listMedia: updatedImages.filter((_, i) => i !== index),
        DeletedMedias: [...productPayload.DeletedMedias, id],
      })
    } else {
      setProductPayload({
        ...productPayload,
        listMedia: updatedImages.filter((_, i) => i !== index),
        DeletedMedias: [...productPayload.DeletedMedias, id],
      })
    }
  }

  const handleMainImage = (id, index) => {
    if (id !== mainImgId) {
      const targetId = productPayload.listImageFile.find((ele) => ele.id === id)?.id
      setMainImgId(targetId)
    } else {
      setMainImgId(null)
    }
    setProductPayload((prev) => ({
      ...prev,
      MainImageIndex: index,
    }))
  }
  return (
    <Accordion.Body className={`${styles["accordion-body"]} accordion-body`}>
      {pathname.includes("add") ? (
        <div className={styles["all_upload_Image"]}>
          {productPayload?.listImageFile?.map((img, index) => (
            <div key={id + index} className={styles["the_img_upo"]}>
              <IoIosClose
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  top: 5,
                  right: 5,
                  zIndex: 1,
                  background: "white",
                  borderRadius: "50%",
                }}
                size={20}
                onClick={() => handleRemoveImage(index)}
              />
              <Image src={URL.createObjectURL(img)} alt="product" width={200} height={200} />
              <label htmlFor={img.id}>
                <span className="mx-1"> {pathOr("", [locale, "Products", "mainImage"], t)}</span>
                <input
                  id={img.id}
                  type="radio"
                  name="isMain"
                  checked={mainImgId ? img?.id === mainImgId : index === productPayload.MainImageIndex}
                  onChange={() => handleMainImage(img.id, index)}
                />
              </label>
            </div>
          ))}
          <div className={"btn_apload_img"}>
            <FaCamera />
            <input
              type="file"
              accept="image/jpeg, image/png, image/gif"
              multiple
              onChange={(e) => handleUploadImages(e)}
            />
          </div>
        </div>
      ) : (
        <div className={styles["all_upload_Image"]}>
          {productPayload?.listMedia
            ?.filter((item) => item.type === 1)
            .map((img, index) => (
              <div key={id + index} className={styles["the_img_upo"]}>
                <IoIosClose
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: 5,
                    right: 5,
                    zIndex: 1,
                    background: "white",
                    borderRadius: "50%",
                  }}
                  size={20}
                  onClick={() => handleRemoveImageFromListmedia(img.id, index)}
                />
                <Image src={img?.url} alt="product" width={200} height={200} />
                <label htmlFor={img.id}>
                  <span className="mx-1"> {pathOr("", [locale, "Products", "mainImage"], t)}</span>
                  <input
                    id={img.id}
                    name="isMain"
                    type="radio"
                    checked={index === productPayload.MainImageIndex}
                    onChange={() => setProductPayload((prev) => ({ ...prev, MainImageIndex: index }))}
                  />
                </label>
              </div>
            ))}
          {productPayload?.listImageFile?.map((img, index) => {
            let updatedIndex = productPayload?.listMedia?.filter((item) => item.type === 1).length + index
            return (
              <div key={id + updatedIndex} className={styles["the_img_upo"]}>
                <IoIosClose
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: 5,
                    right: 5,
                    zIndex: 1,
                    background: "white",
                    borderRadius: "50%",
                  }}
                  size={20}
                  onClick={() => handleRemoveImage(index)}
                />
                <Image src={URL.createObjectURL(img)} alt="product" width={200} height={200} />
                <label htmlFor={img.id}>
                  <span className="mx-1"> {pathOr("", [locale, "Products", "mainImage"], t)}</span>
                  <input
                    id={img.id}
                    type="radio"
                    name="isMain"
                    checked={updatedIndex === productPayload.MainImageIndex}
                    onChange={() => handleMainImage(img.id, updatedIndex)}
                  />
                </label>
              </div>
            )
          })}
          <div className={"btn_apload_img"}>
            <FaCamera />
            <input type="file" accept="image/jpeg, image/png, image/gif" onChange={(e) => handleUploadImages(e)} />
          </div>
        </div>
      )}
      <div className={styles.container}>
        {pathname.includes("add") ? (
          productPayload?.videoUrl?.map((url, index) => (
            <div key={index} className={styles.urlInputContainer}>
              <input
                type="text"
                value={url}
                onChange={(e) => handleUrlChange(index, e)}
                placeholder={locale === "en" ? "Please enter a video link" : "ادخل رابط الفيديو"}
                className={styles.urlInput}
              />
              {productPayload.videoUrl.length > 1 && (
                <button onClick={() => removeUrlField(index)} className={styles.button}>
                  <AiOutlineMinus />
                </button>
              )}
              <button onClick={addUrlField} className={styles.button}>
                <AiOutlinePlus />
              </button>
            </div>
          ))
        ) : (
          <Fragment>
            {productPayload?.listMedia
              ?.filter((item) => item.type === 2)
              .map((item, index) => (
                <div key={index + id} className={styles.urlInputContainer}>
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) => handleUrlChange(index, e)}
                    placeholder={locale === "en" ? "Please enter a video link" : "ادخل رابط الفيديو"}
                    className={styles.urlInput}
                    disabled
                  />
                  <button onClick={() => removeUrlFieldFromListmedia(item.id)} className={styles.button}>
                    <AiOutlineMinus />
                  </button>
                </div>
              ))}
            {productPayload?.videoUrl?.map((url, index) => (
              <div key={index + id} className={styles.urlInputContainer}>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e)}
                  placeholder={locale === "en" ? "Please enter a video link" : "ادخل رابط الفيديو"}
                  className={styles.urlInput}
                />
                {productPayload.videoUrl.length > 1 && (
                  <button onClick={() => removeUrlField(index)} className={styles.button}>
                    <AiOutlineMinus />
                  </button>
                )}
                <button onClick={addUrlField} className={styles.button}>
                  <AiOutlinePlus />
                </button>
              </div>
            ))}
          </Fragment>
        )}
      </div>
      <button
        className="btn-main mt-3 btn-disabled"
        type="button"
        onClick={() => {
          validateProductImages() === true && setEventKey("1")
        }}
      >
        {pathOr("", [locale, "Products", "next"], t)}
      </button>
    </Accordion.Body>
  )
}

export default ProductImages

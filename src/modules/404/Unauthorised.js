import style from "./Unauth.module.css"
import Logo from "../../public/images/Logo.png"
import Image from "next/image"
import { useEffect, useState } from "react"

export const UnAuthorisedPage = () => {
  const [message, setMessage] = useState("Loading ........")

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("Unauthorized")
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={style.container}>
      <div className={style.content}>
        <Image src={Logo} alt="logo" height={150} width={300} />
        <span className={style.text}>{message}</span>
      </div>
    </div>
  )
}

import style from "./Unauth.module.css"
import Logo from "../../public/images/Logo2x.png"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export const UnAuthorisedPage = () => {
  const [message, setMessage] = useState("Loading ........")
  const router = useRouter()
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("Unauthorized")
      router.push("http://onrufwebsite4-001-site1.htempurl.com")
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

import style from "./Unauth.module.css"
import Logo from "../../../public/images/Logo2x.png"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export const UnAuthorisedPage = () => {
  const [message, setMessage] = useState("Loading ........")
  const { push } = useRouter()
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("Unauthorized")
      push(process.env.NEXT_PUBLIC_WEBSITE)
    }, 3000)
    return () => clearTimeout(timer)
  }, [push])

  return (
    <main className={style.container}>
      <article className={style.content}>
        <Image src={Logo} alt="logo" height={150} width={300} />
        <span className={style.text}>{message}</span>
      </article>
    </main>
  )
}

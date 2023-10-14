import style from "./Unauth.module.css"
import Logo from "../../public/images/Logo.png"
import Image from "next/image"


export const UnAuthorisedPage = () => {
    return(
        <div className={style.container}>
            <div className={style.content}>
            <Image src={Logo} className={style.Img}/>
            <span className={style.text}>Un authorised</span>
            </div>
            </div>
    )
}
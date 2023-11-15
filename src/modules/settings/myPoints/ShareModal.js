import React, { useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import EmailIcon from "@mui/icons-material/Email"
import FacebookIcon from "@mui/icons-material/Facebook"
import TwitterIcon from "@mui/icons-material/Twitter"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"
import FileCopyIcon from "@mui/icons-material/FileCopy"
import { List, ListItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material"
import { useRouter } from "next/router"

const ShareModal = ({ isModalOpen, setIsModalOpen, registrationCode }) => {
  const { locale } = useRouter()
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const shareViaEmail = () => {
    const mailtoLink = `mailto:?subject=Registration Code&body=You can register using this code: ${registrationCode}`
    window.location.href = mailtoLink
  }

  const shareOnFacebook = () => {
    const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=YourRegistrationPageURL&quote=Use this code to register: ${registrationCode}`
    window.open(facebookLink, "_blank")
  }

  const shareOnTwitter = () => {
    const twitterLink = `https://twitter.com/intent/tweet?text=Use this code to register: ${registrationCode}`
    window.open(twitterLink, "_blank")
  }

  const shareOnWhatsapp = () => {
    const whatsappLink = `https://wa.me/?text=Use this code to register: ${registrationCode}`
    window.open(whatsappLink, "_blank")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`Use this code to register: ${registrationCode}`).then(() => {
      alert("Code copied to clipboard")
    })
  }

  // Translations object
  const translations = {
    en: {
      shareRegistrationCode: "Share Registration Code",
      email: "Email",
      facebook: "Facebook",
      twitter: "Twitter",
      whatsapp: "WhatsApp",
      copyLink: "Copy Link",
    },
    ar: {
      shareRegistrationCode: "شارك كود التسجيل",
      email: "البريد الإلكتروني",
      facebook: "فيسبوك",
      twitter: "تويتر",
      whatsapp: "واتساب",
      copyLink: "نسخ الرابط",
    },
  }

  const t = (key) => translations[locale][key] || translations["en"][key]

  return (
    <div>
      <button onClick={toggleModal}>{t("shareRegistrationCode")}</button>
      <Dialog onClose={toggleModal} open={isModalOpen} sx={{ "& .MuiDialog-paper": { minWidth: "350px" } }}>
        <DialogTitle sx={{ textAlign: "left" }}>{t("shareRegistrationCode")}</DialogTitle>
        <IconButton aria-label="close" onClick={toggleModal} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
        <List>
          <ListItem button onClick={shareViaEmail}>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText primary={t("email")} />
          </ListItem>
          <ListItem button onClick={copyToClipboard}>
            <ListItemIcon>
              <FileCopyIcon />
            </ListItemIcon>
            <ListItemText primary={t("copyLink")} />
          </ListItem>
          <ListItem button onClick={shareOnFacebook}>
            <ListItemIcon>
              <FacebookIcon />
            </ListItemIcon>
            <ListItemText primary={t("facebook")} />
          </ListItem>
          <ListItem button onClick={shareOnTwitter}>
            <ListItemIcon>
              <TwitterIcon />
            </ListItemIcon>
            <ListItemText primary={t("twitter")} />
          </ListItem>
          <ListItem button onClick={shareOnWhatsapp}>
            <ListItemIcon>
              <WhatsAppIcon />
            </ListItemIcon>
            <ListItemText primary={t("whatsapp")} />
          </ListItem>
        </List>
      </Dialog>
    </div>
  )
}

export default ShareModal

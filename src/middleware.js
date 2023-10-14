import { NextResponse } from "next/server"

export default function middleware(req) {
  let url = req.url
  if (url.includes("businessAccountId") && url.includes("ProviderId") && url.includes("Token")) {
    let parsedUrl = new URL(url, "http://localhost:3002")
    let params = new URLSearchParams(parsedUrl.search)
    let businessAccountId = params.get("businessAccountId")
    let providerId = params.get("ProviderId")
    let token = params.get("Token")

    let cookies = []
    if (businessAccountId) {
      cookies.push(`businessAccountId=${businessAccountId}; Path=/; HttpOnly`)
    }
    if (providerId) {
      cookies.push(`ProviderId=${providerId}; Path=/; HttpOnly`)
    }
    if (token) {
      cookies.push(`Token=${token}; Path=/; HttpOnly`)
    }

    const response = NextResponse.redirect("http://localhost:3002/en")
    for (let cookie of cookies) {
      response.headers.append("Set-Cookie", cookie)
    }

    return response
  }

  return NextResponse.next()
}

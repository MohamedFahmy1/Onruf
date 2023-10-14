/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
}

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // distDir: "build",
  nextConfig,
  i18n: {
    locales: ["ar", "en"],
    defaultLocale: "ar",
  },
  env: {
    REACT_APP_API_URL: "https://devadvertleap-001-site1.gtempurl.com/api/v1",
    MAP_API_KEY: "AIzaSyBB0w_4kUGHr54kvjKNBK_eaUo1tFuLoPU",
  },
}

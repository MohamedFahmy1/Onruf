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
    REACT_APP_API_URL: "https://onrufwebsite2-001-site1.btempurl.com/api/v1",
    MAP_API_KEY: "AIzaSyBB0w_4kUGHr54kvjKNBK_eaUo1tFuLoPU",
  },
}

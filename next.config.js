/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["onrufwebsite6-001-site1.htempurl.com", "onruf.vercel.app"],
  },
  // distDir: "build",
  i18n: {
    locales: ["ar", "en"],
    defaultLocale: "ar",
  },
  env: {
    REACT_APP_API_URL: "https://onrufwebsite6-001-site1.htempurl.com/api/v1",
    MAP_API_KEY: "AIzaSyBB0w_4kUGHr54kvjKNBK_eaUo1tFuLoPU",
  },
  compress: true,
}
module.exports = nextConfig

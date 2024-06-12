/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:id*",
        destination: "/:id*",
      },
    ]
  },
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
}
module.exports = nextConfig

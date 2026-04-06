/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.seferkodesh.co.il',
      },
    ],
  },
}

module.exports = nextConfig

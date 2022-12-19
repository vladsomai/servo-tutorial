/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tutorial/100',
        permanent: true,
      },
    ]
  },
  reactStrictMode: false,
  swcMinify: true,
}

module.exports = nextConfig

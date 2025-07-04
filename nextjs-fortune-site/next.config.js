/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/kei-kato-0702' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/kei-kato-0702/' : '',
}

module.exports = nextConfig
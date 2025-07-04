/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/nextjs-fortune-site' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/nextjs-fortune-site/' : '',
}

module.exports = nextConfig
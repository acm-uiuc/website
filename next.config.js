/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  output: 'export',
  distDir: 'build',
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig

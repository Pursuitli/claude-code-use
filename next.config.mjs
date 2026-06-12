/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // static export — deployable on any static host
  trailingSlash: true,       // keeps /songyun/ and /chinese-painting/ URLs working
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;

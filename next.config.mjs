/** @type {import('next').NextConfig} */
const nextConfig = {
  // No `output: 'export'` — the /bus app uses Vercel server Route Handlers
  // (app/api/kmb/*) to edge-cache the heavy KMB route/stop data. Static pages
  // are still pre-rendered; only the API routes run on the server.
  trailingSlash: true,       // keeps /songyun/ and /chinese-painting/ URLs working
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;

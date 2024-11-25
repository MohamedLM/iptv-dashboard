/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  assetPrefix: isProd && process.env.STATIC_HOST ? process.env.STATIC_HOST : undefined,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: isProd ? {
    removeConsole: {
      exclude: ['error'],
    },
  } : undefined,
};

export default nextConfig;

// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence the "workspace root inferred" warning by pinning the root here
  turbopack: {
    root: __dirname,
    // Use the browser build of tronweb on the client
    resolveAlias: {
      tronweb: "tronweb/dist/TronWeb.js",
    },
  },
  images: {
    domains: ["cdn.brandfetch.io", "logo.clearbit.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
      },
      {
        protocol: "https",
        hostname: "cdn.brandfetch.io",
      },
    ],
  },
  // Temporarily ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // No webpack hook needed for Turbopack
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Exclude functions directory from Next.js build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/functions/**", "**/node_modules/**"],
    };
    return config;
  },
  // Exclude functions directory from page routing
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  transpilePackages: [],
};

export default nextConfig;

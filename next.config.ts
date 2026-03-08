import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
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

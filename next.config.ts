import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ad-intelligence",
  images: { unoptimized: true },
};

export default nextConfig;

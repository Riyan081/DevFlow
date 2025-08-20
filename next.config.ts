import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages:["pino","pino-pretty"],
  images: {
    domains: ['encrypted-tbn0.gstatic.com'],
  },
  /* other config options here */
};

export default nextConfig;

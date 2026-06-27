import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export estático para deploy no Firebase Hosting
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

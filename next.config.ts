import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thesvg.org",
      },
    ],
  },
};

export default nextConfig;

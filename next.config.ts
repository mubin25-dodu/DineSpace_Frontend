import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["dinespace.mu-bin.dev"],
  images: {
    dangerouslyAllowLocalIP: true,
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api-dinespace.mu-bin.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

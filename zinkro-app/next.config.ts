import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root — zinkro-app is a nested project inside the outer
  // repo, so two lockfiles exist and Next otherwise infers the wrong root.
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

export default nextConfig;

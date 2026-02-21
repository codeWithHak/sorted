import type { NextConfig } from "next";
import path from "path";

const apiBaseUrl = process.env.API_BASE_URL;

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  async rewrites() {
    if (!apiBaseUrl) {
      return [];
    }

    return [
      {
        // Proxy all /api/* requests to FastAPI EXCEPT /api/auth/* (handled by Better Auth)
        source: "/api/:path((?!auth).*)",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;

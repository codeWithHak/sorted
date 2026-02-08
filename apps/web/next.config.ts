import type { NextConfig } from "next";

const apiBaseUrl = process.env.API_BASE_URL;

const nextConfig: NextConfig = {
  output: "standalone",
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

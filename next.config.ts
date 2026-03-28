import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const adminBackend =
      process.env.NEXT_PUBLIC_ADMIN_BACKEND_URL ?? "http://localhost:3001";

    /** Course images live under admin `public/uploads` unless you override. */
    const uploadsOrigin =
      process.env.NEXT_PUBLIC_UPLOADS_ORIGIN ??
      process.env.NEXT_PUBLIC_ADMIN_BACKEND_URL ??
      "http://localhost:3001";

    return [
      {
        source: "/uploads/:path*",
        destination: `${uploadsOrigin}/uploads/:path*`,
      },
      {
        source: "/api/detect-location",
        destination: `${adminBackend}/api/detect-location`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${adminBackend}/api/v1/:path*`,
      },
      {
        source: "/api/google-reviews",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"}/api/google-reviews`,
      },
    ];
  },
};

export default nextConfig;

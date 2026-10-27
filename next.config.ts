import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Add this to fix the Leaflet map SSR issue we handled earlier
  transpilePackages: ["lucide-react", "recharts"],
};

export default nextConfig;
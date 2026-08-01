import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/backoffice/signin',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

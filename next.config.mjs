/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "localhost" },
      {
        protocol: "http",
        hostname: "fsks44o.62.34.250.197.sslip.io",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "localhost" },
      { hostname: "http://hsgowko.62.34.250.197.sslip.io/" },
    ],
  },
};

export default nextConfig;

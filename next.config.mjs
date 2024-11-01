/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const nextConfig = {
  // Any Next.js specific configurations go here
  reactStrictMode: true, // Example configuration
};

export default withPWA({
  ...nextConfig,
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
  },
});

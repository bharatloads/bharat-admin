/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Completely ignore ESLint during builds
    // Or use this to only ignore warnings:
    // ignoreDuringBuilds: false,
    // warningAsErrors: false
  },
};

export default nextConfig;

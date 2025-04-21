/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true, // Ignora errores ESLint al construir el sitio
  },
};

module.exports = nextConfig;


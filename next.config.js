/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Tüm harici hostname'leri kabul et
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  // PWA desteği
  async headers() {
    return [
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
        ],
      },
    ];
  },
  // Performans optimizasyonları
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  // Compiler optimizasyonları
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // ESLint hatalarını build sırasında yok say
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScript hatalarını build sırasında yok say
  typescript: {
    ignoreBuildErrors: false, // TypeScript hatalarını kontrol et, sadece ESLint'i ignore et
  },
};

module.exports = nextConfig;

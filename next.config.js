/** @type {import('next').NextConfig} */
const nextConfig = {
  // Оптимизации для продакшена
  output: "standalone",
  poweredByHeader: false,
  compress: true,

  // Настройки безопасности
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  // Настройки для продакшена
  experimental: {
    optimizeCss: true,
  },

  // Переменные окружения
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Настройки изображений
  images: {
    domains: ["test.aquadaddy.app"],
    formats: ["image/webp", "image/avif"],
  },

  // Настройки для статической генерации
  trailingSlash: false,

  // Отключение строгого режима для продакшена
  reactStrictMode: false,
};

module.exports = nextConfig;

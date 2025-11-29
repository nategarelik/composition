import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Properly handle three.js packages
  transpilePackages: ["three", "@react-three/fiber"],

  // Mark Prisma packages as external for server-side (fixes Turbopack compatibility)
  // See: https://github.com/vercel/next.js/issues/85371
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", ".prisma"],

  // Empty turbopack config to allow dev mode (production uses --webpack flag)
  turbopack: {},

  // Configure webpack to handle canvas
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: "canvas" }];
    return config;
  },

  // React Strict Mode is disabled to suppress Three.js/React Three Fiber hydration warnings.
  // Three.js manipulates the DOM directly which conflicts with React's hydration process,
  // causing numerous console warnings about mismatched DOM content.
  // TODO: Re-enable when R3F improves SSR support or implement proper SSR handling
  // See: https://github.com/pmndrs/react-three-fiber/issues/1141
  reactStrictMode: false,

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevent clickjacking attacks
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Control referrer information
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          // Enable XSS protection in older browsers
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Strict transport security (HTTPS only in production)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Permissions policy (restrict browser features)
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.anthropic.com https://*.upstash.io",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

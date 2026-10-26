import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {};

const erpUrl = new URL(process.env.ERP_BASE_URL ?? "http://127.0.0.1:8000");

nextConfig.images = {
  remotePatterns: [
    {
      protocol: erpUrl.protocol.replace(":", "") as "http" | "https",
      hostname: erpUrl.hostname,
      port: erpUrl.port,
      pathname: "/files/**",
    },
  ],
};

nextConfig.headers = async () => [
  {
    source: "/(.*)",
    headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      {
        key: "Content-Security-Policy",
        value: "frame-ancestors 'none';",
      },
    ],
  },
];

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);

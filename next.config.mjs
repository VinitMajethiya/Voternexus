/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
 
export default withNextIntl(withPWA(nextConfig));

import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT || process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;

/** @type {import("next").NextConfig} */
const nextConfig = {
  distDir: process.env.BUILD_DIR || ".next",
  redirects: async () => {
    return [{ source: "/article-categories/:slug", destination: "/blog/categories/:slug", permanent: true }];
  },
  experimental: {
    instrumentationHook: true
  },
  rewrites: async () => {
    return [
      {
        source: "/:locale/@:username",
        destination: "/:locale/profile/:username?username=:username"
      },
      {
        source: "/:locale/verify",
        destination: "/:locale/courses/verify"
      },
      {
        source: "/payments/:slug/callback",
        destination: "/api/payments/:slug/callback"
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.msaaq.com"
      },
      {
        protocol: "https",
        hostname: "msaaq-dev.s3.eu-central-1.amazonaws.com"
      },
      {
        protocol: "https",
        hostname: "fakeimg.pl"
      }
    ]
  },
  reactStrictMode: true,
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.(".svg"));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/ // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"]
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  }
};

const sentryWebpackPluginOptions = {
  // Suppresses source map uploading logs during build
  silent: false,
  org: "msaaq",
  project: "academyfront",
  dryRun: SENTRY_ENVIRONMENT !== "production",
  authToken: process.env.SENTRY_AUTH_TOKEN
};

const sentryOptions = {
  // Hides source maps from generated client bundles
  hideSourceMaps: true
};

export default withSentryConfig(withNextIntl(nextConfig), sentryWebpackPluginOptions, sentryOptions);

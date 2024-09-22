// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT || process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: SENTRY_ENVIRONMENT,
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,
  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    new Sentry.Replay({
      networkDetailAllowUrls: [window.location.origin, /^https:\/\/api\.msaaqbeta\.com/]
    })
  ],
  ignoreErrors: [
    // Instagram error that Meta isn't fixing but is not impacting users
    // See https://developers.facebook.com/community/threads/320013549791141/
    "ReferenceError: Can't find variable: _AutofillCallbackHandler",
    "ReferenceError: Can't find variable: __AutoFillPopupClose__",
    //https://github.com/getsentry/sentry-javascript/issues/3440
    "*Non-Error promise rejection captured*",
    //https://github.com/getsentry/sentry-javascript/issues/6945#issuecomment-1413746759
    /^Unexpected token.*/,
    //https://github.com/getsentry/sentry/issues/61469#issuecomment-1887799647
    '*Object.prototype.hasOwnProperty.call(o,"telephone")*',
    //https://github.com/getsentry/sentry-javascript/issues/10011#issuecomment-1919352232
    "TypeError: Cannot read property 'domInteractive' of undefined"
  ]
});

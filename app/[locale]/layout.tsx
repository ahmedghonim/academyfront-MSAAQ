import React from "react";

//@ts-ignore
import convert from "color-convert";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getLangDir } from "rtl-detect";
//TODO: Remove swiper imports add only the needed styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

//==================================================
import { fetchCart } from "@/server-actions/services/cart-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import "@/styles/globals.scss";
import { App, AppSlug } from "@/types";
import colorShades from "@/utils/colorShades";

import "@msaaqcom/abjad/dist/style.css";

const DEFAULT_FONTS = ["Dubai", "Cairo", "Sahel", "Samim", "Speda", "Vazir", "JFFlat"];
const DEFAULT_FONT = "Dubai";

const resolveColors = (color: string, name: string) => {
  const resolvedColors = colorShades(color);

  const prefix = "abjad";
  const colorName = (key: string) => (key === "500" ? `${name}` : `${name}-${key}`);

  const result: Record<string, string> = {};

  Object.keys(resolvedColors ?? {}).map((key) => {
    const cname = colorName(key);
    const abjadColorVariable = `--${prefix}-${cname}`;

    const [h, s, l] = convert.hex.hsl(resolvedColors?.[key] as string);

    result[abjadColorVariable] = `${h} ${s}% ${l}%`;
  });

  return Object.keys(result)
    .map((key) => `${key}: ${result[key]};`)
    .join("\n");
};

type RootLayoutProps = {
  children: React.ReactNode;
  params: {
    locale: string;
    [key: string]: string;
  };
};
type TrackingAppSlug =
  | AppSlug.TiktokPixel
  | AppSlug.SnapchatPixel
  | AppSlug.FacebookPixel
  | AppSlug.GoogleAnalytics
  | AppSlug.GoogleTagManager;
const ID_REGEX = /^[a-zA-Z0-9-]*$/;

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const tenant = await fetchTenant();

  const messages = await getMessages();

  const { locale } = params;
  const dir = getLangDir(locale);

  if (!tenant) {
    return (
      <html
        dir={dir}
        lang={locale}
      >
        <body>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>{" "}
        </body>
      </html>
    );
  }

  const cart = await fetchCart();

  if (!cart) {
    return "";
  }

  const fontFamily = tenant.font_family ?? DEFAULT_FONT;
  const fontBody = tenant.font_body ?? DEFAULT_FONT;
  const primary = resolveColors(tenant.colors.primary, "primary");
  const secondary = resolveColors(tenant.colors.secondary, "secondary");
  const sectionLight = tenant.colors?.["section-light"];
  const sectionDark = tenant.colors?.["section-dark"];
  const headline = tenant.colors?.headline;
  const paragraph = tenant.colors?.paragraph;

  const getTrackingApp = (slug: TrackingAppSlug) => {
    const app = tenant?.apps?.find((app) => app.slug === slug) as App<TrackingAppSlug>;

    if (!app || (app && !ID_REGEX.test(app.tracking_id))) {
      return null;
    }

    return app;
  };

  const scpixelApp = getTrackingApp(AppSlug.SnapchatPixel);

  const ttqpixelApp = getTrackingApp(AppSlug.TiktokPixel);

  const fbqApp = getTrackingApp(AppSlug.FacebookPixel);

  const gtagApp = getTrackingApp(AppSlug.GoogleAnalytics);

  const gtmApp = getTrackingApp(AppSlug.GoogleTagManager);

  const linkarabyApp = tenant?.apps?.find((app) => app.slug === AppSlug.Linkaraby) as App<AppSlug.Linkaraby>;

  return (
    <html
      dir={dir}
      lang={locale}
    >
      <head>
        {DEFAULT_FONTS.includes(fontFamily) ? (
          <style>{`@import url(https://cdn.msaaq.com/assets/fonts/${fontFamily}/style.css);`}</style>
        ) : (
          <style>{`@import url(https://fonts.googleapis.com/css2?family=${fontFamily.replaceAll(" ", "+")});`}</style>
        )}
        {fontBody !== fontFamily &&
          (DEFAULT_FONTS.includes(fontBody) ? (
            <style>{`@import url(https://cdn.msaaq.com/assets/fonts/${fontBody}/style.css);`}</style>
          ) : (
            <style>{`@import url(https://fonts.googleapis.com/css2?family=${fontBody.replaceAll(" ", "+")});`}</style>
          ))}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
          ${primary}
          ${secondary}
          --bs-headline: ${headline};
          --bs-paragraph: ${paragraph};
          --bs-section-light: ${sectionLight};
          --bs-section-dark: ${sectionDark};
          --bs-font-sans-serif: "${fontFamily}", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial,
            "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          --mq-headlines-font-family: var(--bs-font-sans-serif);
          --mq-paragraph-font-family: "${fontBody}", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
            Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          --bs-body-font-family: "${fontBody}", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial,
            "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }
        body {
          font-family: var(--mq-paragraph-font-family);
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          color: var(--bs-headline) !important;
          font-family: var(--mq-headlines-font-family) !important;
        }
            `
          }}
        />
        {ttqpixelApp && (
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `!function (w, d, t) {
            w.TiktokAnalyticsObject = t;
            var ttq = w[t] = w[t] || [];
            ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"], ttq.setAndDefer = function (t, e) {
                t[e] = function () {
                    t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
                }
            };
            for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
            ttq.instance = function (t) {
                for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++
                ) ttq.setAndDefer(e, ttq.methods[n]);
                return e
            }, ttq.load = function (e, n) {
                var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
                ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = i, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {};
                n = document.createElement("script");
                n.type = "text/javascript", n.async = !0, n.src = i + "?sdkid=" + e + "&lib=" + t;
                e = document.getElementsByTagName("script")[0];
                e.parentNode.insertBefore(n, e)
            };

            ttq.load('${ttqpixelApp.tracking_id}');
        }(window, document, 'ttq');`
            }}
          />
        )}
        {scpixelApp && (
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `(function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
      {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
        a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
        r.src=n;var u=t.getElementsByTagName(s)[0];
        u.parentNode.insertBefore(r,u);})(window,document,
        'https://sc-static.net/scevent.min.js');`
            }}
          />
        )}
        {fbqApp && (
          <>
            <script
              type="text/javascript"
              dangerouslySetInnerHTML={{
                __html: `!function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');`
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${fbqApp.tracking_id}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        )}
        {gtagApp && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gtagApp.tracking_id}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${gtagApp.tracking_id}', {
                page_path: window.location.pathname,
              });
            `
              }}
            />
          </>
        )}

        {gtmApp && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${gtmApp.tracking_id}');`
            }}
          />
        )}
        {linkarabyApp && (
          <>
            <script
              async
              type="text/javascript"
              id="pap_x2s6df8d"
              src="https://www.linkaraby.com/scripts/2xjh8l8dq0"
            />
          </>
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5947MFH');`
          }}
        />
      </head>
      <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
    </html>
  );
}

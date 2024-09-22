import React from "react";

import { notFound } from "next/navigation";
import Script from "next/script";

import { getSession } from "@/lib/auth";
import { ClientProviders } from "@/providers/provider";
import { fetchCart } from "@/server-actions/services/cart-service";
import { fetchIpInfo, fetchTenant } from "@/server-actions/services/tenant-service";
import { AnyObject, AppSlug } from "@/types";

type RootLayoutProps = {
  children: React.ReactNode;
  params: AnyObject;
  className?: string;
};

export default async function RootLayout({ children, className }: RootLayoutProps) {
  const tenant = await fetchTenant();
  const ipInfo = await fetchIpInfo();

  if (!tenant) {
    return notFound();
  }

  const cart = await fetchCart();

  if (!cart) {
    return "";
  }

  const session = await getSession();

  const tapApp = tenant?.apps?.find((app) => app.slug === AppSlug.Tap);

  return (
    <body className={className}>
      <ClientProviders
        cart={cart}
        tenant={tenant}
        ipInfo={ipInfo}
        session={session}
        locale={tenant.locale}
      >
        {children}
      </ClientProviders>

      {tapApp && (
        <Script
          type="text/javascript"
          src="https://goSellJSLib.b-cdn.net/v2.0.0/js/gosell.js"
        />
      )}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-5947MFH"
          height="0"
          width="0"
          style={{
            display: "none",
            visibility: "hidden"
          }}
        ></iframe>
      </noscript>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "window.APP_EVENTS={BEGIN_CHECKOUT:[],ADD_PAYMENT_INFO:[],PAGE_VIEW:[],ADD_TO_CART:[],PURCHASE:[],SIGN_UP:[],LOGIN:[]}"
        }}
      />
    </body>
  );
}

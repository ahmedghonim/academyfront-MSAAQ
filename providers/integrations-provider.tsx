"use client";

import React, { ReactNode, createContext, useCallback, useEffect, useMemo } from "react";

import { useSearchParams } from "next/navigation";

import { useTenant } from "@/components/store/TenantProvider";
import { fpixel, gtag, gtm, linkaraby, scpixel, ttq } from "@/lib/integrations";
import { useSession } from "@/providers/session-provider";
import { App, AppSlug } from "@/types";
import { usePathname } from "@/utils/navigation";

interface ProviderProps {
  children: ReactNode;
}

type TrackingAppSlug =
  | AppSlug.TiktokPixel
  | AppSlug.SnapchatPixel
  | AppSlug.FacebookPixel
  | AppSlug.GoogleAnalytics
  | AppSlug.GoogleTagManager;

const ID_REGEX = /^[a-zA-Z0-9-]*$/;

const IntegrationsContext = createContext({});
const IntegrationsProvider: React.FC<ProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { member } = useSession();

  const tenant = useTenant()((s) => s.tenant);

  const getTrackingApp = useCallback(
    (slug: TrackingAppSlug) => {
      const app = tenant?.apps?.find((app) => app.slug === slug) as App<TrackingAppSlug>;

      if (!app || (app && !ID_REGEX.test(app.tracking_id))) {
        return null;
      }

      return app;
    },
    [tenant, ID_REGEX]
  );

  const scpixelApp = useMemo(() => getTrackingApp(AppSlug.SnapchatPixel), [tenant]);

  const ttqpixelApp = useMemo(() => getTrackingApp(AppSlug.TiktokPixel), [tenant]);

  const fbqApp = useMemo(() => getTrackingApp(AppSlug.FacebookPixel), [tenant]);

  const linkarabyApp = useMemo(
    () => tenant?.apps?.find((app) => app.slug === AppSlug.Linkaraby) as App<AppSlug.Linkaraby>,
    [tenant]
  );

  useEffect(() => {
    window?.APP_EVENTS?.ADD_TO_CART?.push(function (payload) {
      gtag.event("add_to_cart", {
        category: payload.type,
        label: payload.title,
        value: payload.price
      });

      gtm.event("add_to_cart", {
        currency: payload.currency,
        value: payload.price,
        coupon: payload.coupon_code ?? "",
        items: payload.items
      });

      scpixel.event("ADD_CART", {
        currency: payload.currency,
        price: payload.price,
        item_category: payload.type,
        description: payload.title,
        item_ids: [`${payload.type}-${payload.id}`]
      });

      fpixel.event("AddToCart", {
        currency: payload.currency,
        value: payload.price,
        content_ids: [`${payload.type}-${payload.id}`],
        content_name: payload.title,
        content_type: payload.type
      });

      ttq.event("AddToCart", {
        currency: payload.currency,
        value: payload.price,
        content_ids: [
          {
            content_id: `${payload.type}-${payload.id}`,
            content_name: payload.title,
            content_category: payload.type,
            quantity: 1,
            price: payload.price
          }
        ]
      });
    });

    window.APP_EVENTS?.PURCHASE.push(function (payload) {
      gtag.event("purchase", {
        category: payload.type,
        label: payload.title,
        value: payload.price
      });

      gtm.event("purchase", {
        transaction_id: payload.transaction_id,
        currency: payload.currency,
        value: payload.price,
        coupon: payload.coupon_code,
        items: payload.items
      });

      scpixel.event("PURCHASE", {
        currency: payload.currency,
        price: payload.price,
        description: payload.title,
        item_ids: payload.ids
      });

      fpixel.event("Purchase", {
        currency: payload.currency,
        value: payload.price,
        content_ids: payload.ids,
        content_name: payload.title,
        content_type: payload.type
      });

      linkaraby.createSale({
        price: payload.price,
        ids: payload.ids,
        coupon_code: payload.coupon_code,
        order_id: payload.order_id
      });

      ttq.event("CompletePayment", {
        currency: payload.currency,
        value: payload.price,
        query: payload.coupon_code
      });
    });

    window.APP_EVENTS?.LOGIN.push(function (payload) {
      if (payload) {
        gtm.event("login", {
          method: payload.method,
          email: payload.email,
          phone: payload.phone
        });
      }
    });

    window.APP_EVENTS?.SIGN_UP.push(function (payload) {
      if (payload) {
        gtm.event("sign_up", {
          email: payload.email,
          phone: payload.phone
        });
      }
    });

    window.APP_EVENTS?.BEGIN_CHECKOUT.push(function (payload) {
      if (payload) {
        gtm.event("begin_checkout", {
          currency: payload.currency,
          value: payload.price,
          coupon: payload.coupon_code,
          items: payload.items
        });
      }
    });

    window.APP_EVENTS?.ADD_PAYMENT_INFO.push(function (payload) {
      if (payload) {
        gtm.event("add_payment_info", {
          currency: payload.currency,
          value: payload.price,
          coupon: payload.coupon_code ?? "",
          items: payload.items
        });
      }
    });
  }, []);

  useEffect(() => {
    linkaraby.init(linkarabyApp?.account_id);
    linkaraby.track();

    scpixel.pageview();
    fpixel.pageview();

    ttq.pageview();

    const url = `${pathname}?${searchParams}`;

    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
      gtm.pageview(url);

      scpixel.pageview();
      fpixel.pageview();
      ttq.pageview();
    };

    handleRouteChange(url);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (fbqApp) {
      fpixel.init(
        fbqApp.tracking_id,
        member
          ? {
              em: member.email,
              ph: `+${member.international_phone}`,
              fn: member.first_name,
              ln: member.last_name,
              external_id: member.id
            }
          : undefined
      );
    }

    if (scpixelApp) {
      scpixel.init(
        scpixelApp.tracking_id,
        member
          ? {
              user_email: member.email,
              user_phone_number: `+${member.international_phone}`
            }
          : undefined
      );
    }

    if (ttqpixelApp) {
      ttq.identify(
        member
          ? {
              email: member.email,
              phone_number: `+${member.international_phone}`,
              external_id: member.id
            }
          : undefined
      );
    }
  }, [member]);

  return <IntegrationsContext.Provider value={{}}>{children}</IntegrationsContext.Provider>;
};

export { IntegrationsProvider };

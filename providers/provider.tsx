"use client";

import { useRef } from "react";

import { RouterProvider } from "react-aria-components";
import { Provider as ReduxProvider } from "react-redux";
import { getLangDir } from "rtl-detect";

import CartProvider from "@/components/store/CartProvider";
import TenantProvider from "@/components/store/TenantProvider";
import { ToastProvider } from "@/context/toast-context";
import { SessionProvider } from "@/providers/session-provider";
import MakeStore, { AppStore } from "@/store";
import { Academy, Cart, IpInfo } from "@/types";
import { useRouter } from "@/utils/navigation";

import { AppProvider } from "./app-provider";
import { IntegrationsProvider } from "./integrations-provider";
import { ProgressBar } from "./progress-bar";

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

export function ClientProviders({
  children,
  session,
  locale,
  tenant,
  cart,
  ipInfo
}: {
  children: React.ReactNode;
  session: any;
  locale: string;
  tenant: Academy;
  cart: Cart;
  ipInfo: IpInfo | null;
}) {
  let router = useRouter();
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = MakeStore();
  }
  const dir = getLangDir(locale);

  return (
    <SessionProvider session={session}>
      <TenantProvider
        ipInfo={ipInfo}
        tenant={tenant}
      >
        <CartProvider cart={cart}>
          <ReduxProvider store={storeRef.current}>
            <ToastProvider dir={dir}>
              <AppProvider>
                <IntegrationsProvider>
                  <RouterProvider navigate={router.push}>
                    <ProgressBar className="fixed top-0 z-[99999999] h-1 bg-primary">{children}</ProgressBar>
                  </RouterProvider>
                </IntegrationsProvider>
              </AppProvider>
            </ToastProvider>
          </ReduxProvider>
        </CartProvider>
      </TenantProvider>
    </SessionProvider>
  );
}

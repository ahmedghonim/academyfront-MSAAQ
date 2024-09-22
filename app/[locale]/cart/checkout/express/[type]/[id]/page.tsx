import type { Metadata } from "next";
import { permanentRedirect } from "next/dist/client/components/redirect";

import { getTranslations } from "next-intl/server";

import ExpressCheckoutLayout from "@/components/checkout/express-checkout-layout";
import { fetchCart } from "@/server-actions/services/cart-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

export async function generateMetadata(): Promise<Metadata | null> {
  const data = await fetchTenant();
  const cart = await fetchCart();

  if (!data || !cart) {
    return null;
  }

  const t = await getTranslations("shopping_cart");

  return generateCommonMetadata({
    tenant: data,
    asPath: "/cart/checkout",
    title: t("title", {
      count: cart.items.length ?? 0
    }) as string
  });
}

export default async function Page({
  params: { type, id }
}: {
  params: {
    id: string;
    type: string;
  };
}) {
  if (type && (type as string).toLowerCase() === "products") {
    permanentRedirect(`/cart/checkout/express/product/${id}`);
  } else if (type && (type as string).toLowerCase() === "courses") {
    permanentRedirect(`/cart/checkout/express/course/${id}`);
  }

  return <ExpressCheckoutLayout />;
}

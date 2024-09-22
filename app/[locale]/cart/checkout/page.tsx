import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";

import CheckoutLayout from "@/components/checkout/checkout-layout";
import { fetchCart } from "@/server-actions/services/cart-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import generateCommonMetadata from "@/utils/generateCommonMetadata";
import { redirect } from "@/utils/navigation";

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

export default async function Page() {
  const cart = await fetchCart();

  const isCartEmpty = cart && cart.items.length === 0;

  if (isCartEmpty) {
    redirect("/");
  }

  return <CheckoutLayout />;
}

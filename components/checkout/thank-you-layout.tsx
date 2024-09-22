"use client";

import { useEffect } from "react";

import ThankYouBankTransfer from "@/components/checkout/thank-you-page-flows/thank-you-bank-transfer";
import ThankYouMsaaqpay from "@/components/checkout/thank-you-page-flows/thank-you-msaaq-pay";
import ThankYouOther from "@/components/checkout/thank-you-page-flows/thank-you-other";
import { useTenant } from "@/components/store/TenantProvider";
import { useCartByUUID } from "@/components/store/cart-by-uuid-provider";
import { useFormatPrice } from "@/hooks";

export default function ThankYouLayout() {
  const tenant = useTenant()((s) => s.tenant);
  const { cart } = useCartByUUID()((s) => s);

  const { formatPlainPrice } = useFormatPrice();

  useEffect(() => {
    if (cart && tenant) {
      window.order = {
        cart_id: cart.id,
        order_id: cart.order_id,
        currency: cart.currency,
        subtotal: cart.subtotal,
        total: cart.total
      };

      const payload = {
        transaction_id: cart.order_id ?? cart.id,
        order_id: cart.order_id ?? "",
        coupon_code: cart.coupon ?? "",
        currency: tenant.currency,
        price: `${formatPlainPrice(cart.total)}`,
        type: "order",
        title: cart.order_id ? `Order #${cart.order_id}` : `Cart #${cart.id}`,
        ids: cart.items.map((item) => `${item.product.id}`),
        items: cart.items.map((item) => ({
          id: item.product.id,
          price: formatPlainPrice(item.total),
          quantity: 1,
          name: item.product.title,
          category: item.type
        }))
      };

      window.APP_EVENTS?.PURCHASE.map((fun) => fun(payload));
    }
  }, [cart, tenant]);

  if (tenant.msaaqpay_enabled) {
    return <ThankYouMsaaqpay />;
  }

  if (!cart.order_id) {
    return <ThankYouBankTransfer />;
  }

  return <ThankYouOther />;
}

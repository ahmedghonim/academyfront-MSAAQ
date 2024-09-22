"use client";

import { useCallback } from "react";

import { useCart } from "@/components/store/CartProvider";
import { useTenant } from "@/components/store/TenantProvider";

import useFormatPrice from "./use-format-price";

const useFireAddPaymentInfoEvent = () => {
  const cart = useCart()((state) => state.cart);
  const tenant = useTenant()((state) => state.tenant);

  const { formatPlainPrice } = useFormatPrice();

  return useCallback(() => {
    if (!cart || !tenant) return;

    window.APP_EVENTS?.ADD_PAYMENT_INFO.map((fun) => {
      fun({
        coupon_code: cart.coupon ?? "",
        currency: tenant.currency,
        price: `${formatPlainPrice(cart.total)}`,
        title: `Cart #${cart.id}`,
        ids: cart.items.map((item) => `${item.product.id}`),
        items: cart.items.map((item) => ({
          id: item.product.id,
          price: formatPlainPrice(item.total),
          quantity: 1,
          name: item.product.title,
          category: item.type
        }))
      });
    });
  }, [cart, tenant]);
};

export default useFireAddPaymentInfoEvent;

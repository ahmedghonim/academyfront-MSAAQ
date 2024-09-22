"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { useCart } from "@/components/store/CartProvider";
import { useServerAction } from "@/hooks";
import { expressCheckoutMutation } from "@/server-actions/actions/cart-actions";

import CheckoutLayout from "./checkout-layout";

const CheckoutAnimation = dynamic(() => import("../cart/checkout-animation").then((mod) => mod), {
  ssr: false
});

export default function ExpressCheckoutLayout() {
  const { type, id } =
    useParams<{
      id: string;
      type: string;
    }>() ?? {};

  const { cart, setCart } = useCart()((s) => s);

  const [expressCheckout, { isLoading: isExpressCheckoutLoading, data, isSuccess }] =
    useServerAction(expressCheckoutMutation);

  const [itemStatus, setItemStatus] = useState<"in_cart" | "not_in_cart" | "loading">("loading");

  const processing = itemStatus === "loading" || isExpressCheckoutLoading;

  useEffect(() => {
    if (isSuccess && data) {
      setCart(data);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (cart) {
      if (cart.items.length) {
        cart.items.forEach((item) => {
          if (item.product.id == Number(id as string) && item.type === type) {
            setItemStatus("in_cart");

            return;
          } else {
            setItemStatus("not_in_cart");
          }
        });
      } else {
        setItemStatus("not_in_cart");
      }
    }
  }, [cart]);

  useEffect(() => {
    const addToCart = async () => {
      if (itemStatus === "not_in_cart") {
        await expressCheckout({
          product_id: id as string,
          product_type: type as "course" | "product"
        });
        setItemStatus("in_cart");
      }
    };

    addToCart();
  }, [itemStatus]);

  if (processing) {
    return <CheckoutAnimation show={processing} />;
  }

  return <CheckoutLayout />;
}

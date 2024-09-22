"use server";

import { revalidateTag } from "next/cache";

import { AnyObject, Cart } from "@/types";

import fetchBaseQuery from "../config/base-query";
import { tags } from "../config/tags";

export async function addToCartMutation(body: {
  product_type: "course" | "product";
  product_id: number | string;
  quantity: number;
}) {
  const response = await fetchBaseQuery<Cart>({
    url: "/cart",
    method: "POST",
    body
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  revalidateTag(tags.fetchCart);

  const cart = response.data;

  return {
    ...cart,
    is_free_due_to_coupon: cart.is_free && cart.subtotal > 0
  };
}

export async function expressCheckoutMutation(body: {
  product_type: "course" | "product";
  product_id: number | string;
  meta?: AnyObject;
}) {
  const response = await fetchBaseQuery<Cart>({
    url: "/cart/express",
    method: "POST",
    body
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  revalidateTag(tags.fetchCart);

  const cart = response.data;

  return {
    ...cart,
    is_free_due_to_coupon: cart.is_free && cart.subtotal > 0
  };
}

export async function removeFromCartMutation(body: {
  product_type: "course" | "product";
  product_id: number | string;
}) {
  const response = await fetchBaseQuery<Cart>({
    url: "/cart",
    method: "DELETE",
    body
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  revalidateTag(tags.fetchCart);

  const cart = response.data;

  return {
    ...cart,
    is_free_due_to_coupon: cart.is_free && cart.subtotal > 0
  };
}

export async function redeemCouponMutation(coupon: string) {
  const response = await fetchBaseQuery<Cart>({
    url: "/cart/redeem-coupon",
    method: "POST",
    body: {
      coupon
    }
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  revalidateTag(tags.fetchCart);

  const cart = response.data;

  return {
    ...cart,
    is_free_due_to_coupon: cart.is_free && cart.subtotal > 0
  };
}

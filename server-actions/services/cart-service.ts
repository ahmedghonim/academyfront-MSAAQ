import { revalidateTag } from "next/cache";

import { Cart } from "@/types";

import fetchBaseQuery, { validateAPIResponse } from "../config/base-query";
import { tags } from "../config/tags";

export async function fetchCart() {
  const response = await fetchBaseQuery<Cart>({
    url: "/cart",
    method: "GET",
    tags: [tags.fetchCart]
  });

  validateAPIResponse(response);

  const cart = response.data;

  return {
    ...cart,
    is_free_due_to_coupon: cart.is_free && cart.subtotal > 0
  };
}

export async function fetchCartByUUID(uuid: string) {
  const response = await fetchBaseQuery<{
    cart: Cart;
    payload: {
      action: string;
      member: {
        email: string;
        username: string;
        created_at: string;
        name: string;
        login_via: "otp" | "password" | "new_password";
      };
    };
  }>({
    url: `/cart/${uuid}`,
    method: "GET"
  });

  validateAPIResponse(response);

  if (response) {
    revalidateTag(tags.fetchCart);

    const cart = response.data;

    return {
      ...cart,
      is_free_due_to_coupon: cart.cart.is_free && cart.cart.subtotal > 0
    };
  }
}

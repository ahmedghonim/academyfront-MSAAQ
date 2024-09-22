"use server";

import { revalidateTag } from "next/cache";

import { AnyObject } from "@/types";

import fetchBaseQuery from "../config/base-query";
import { tags } from "../config/tags";

export async function checkoutMutation(body: AnyObject) {
  const response = await fetchBaseQuery<
    | {
        cart: {
          uuid: string;
        };
      }
    | { redirect_url: string }
    | { pay_link: string }
    | { checkout_url: string }
  >({
    url: "/cart/checkout",
    method: "POST",
    body
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  revalidateTag(tags.fetchCart);

  return response.data;
}

export async function bankTransferCheckoutMutation(formData: FormData) {
  const response = await fetchBaseQuery<
    | {
        cart: {
          uuid: string;
        };
      }
    | { redirect_url: string }
    | { pay_link: string }
    | { checkout_url: string }
  >({
    url: "/cart/checkout",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    method: "POST",
    body: formData
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  revalidateTag(tags.fetchCart);

  return response.data;
}

export async function paypalCheckoutMutation(body: {
  email?: string | null;
  phone?: string | null;
  phone_code?: string | null;
}) {
  const response = await fetchBaseQuery<{
    cart: {
      uuid: string;
    };
    paypal_order_id: string;
  }>({
    url: "/cart/checkout",
    method: "POST",
    body: {
      payment_gateway: "paypal",
      ...body
    }
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  revalidateTag(tags.fetchCart);

  return response.data;
}

export async function paypalCaptureMutation(body: { paypal_order_id: string; cart_id: string }) {
  const response = await fetchBaseQuery<any>({
    url: "/payments/paypal/callback",
    method: "POST",
    body
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  return response.data;
}

export async function applePayValidationMutation(body: AnyObject) {
  const response = await fetchBaseQuery<any>({
    url: "/pay/apple-pay/validation",
    method: "POST",
    body
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  return response.data;
}

export async function applePayAuthorizeMutation(body: AnyObject) {
  const response = await fetchBaseQuery<any>({
    url: `/pay/apple-pay/${body.uuid}/authorize`,
    method: "POST",
    body
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  return response.data;
}

export async function tamaraCheckoutMutation(body: {
  name?: string;
  email?: string;
  phone: string;
  phone_code: string;
  address: {
    country: string;
    city: string;
    line: string;
  };
}) {
  const response = await fetchBaseQuery<{
    redirect_url: string;
  }>({
    url: "/cart/checkout",
    method: "POST",
    body: {
      payment_gateway: "tamara",
      payment_type: "PAY_BY_INSTALMENTS",
      instalments: 3,
      ...body
    }
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  return response.data;
}

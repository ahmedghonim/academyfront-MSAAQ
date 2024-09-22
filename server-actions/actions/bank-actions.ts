"use server";

import { revalidateTag } from "next/cache";

import { Bank } from "@/types";

import fetchBaseQuery from "../config/base-query";
import { tags } from "../config/tags";

export async function createBank(payload: Omit<Bank, "id" | "created_at" | "updated_at">) {
  const response = await fetchBaseQuery<Bank>({
    url: "/account/bank",
    method: "POST",
    body: payload
  });

  if (response.error) {
    return null;
  }

  revalidateTag(tags.fetchBankData);

  return {
    data: response.data
  };
}

export async function updateBank(payload: Omit<Bank, "id" | "created_at" | "updated_at">) {
  const response = await fetchBaseQuery<Bank>({
    url: "/account/bank",
    method: "POST",
    params: {
      _method: "PATCH"
    },
    body: payload
  });

  if (response.error) {
    return null;
  }

  revalidateTag(tags.fetchBankData);

  return {
    data: response.data
  };
}

export async function withdrawAffiliateEarnings(payload: {
  amount: number;
  method: "paypal" | "wire";
  bank_id?: number;
  paypal_email?: string;
}) {
  const response = await fetchBaseQuery<undefined>({
    url: "/account/affiliates/withdraw",
    method: "POST",
    body: payload
  });

  if (response.error) {
    return response;
  }

  return {
    data: response.data
  };
}

"use server";

import { Affiliate, Payout } from "@/types";

import fetchBaseQuery, { validateAPIResponse } from "../config/base-query";
import { tags } from "../config/tags";

export async function fetchAffiliate() {
  const response = await fetchBaseQuery<Affiliate>({
    url: "/account/affiliates",
    method: "GET",
    tags: [tags.fetchAffiliate]
  });

  validateAPIResponse(response);

  return response.data;
}

export async function fetchPayouts() {
  const response = await fetchBaseQuery<Payout>({
    url: "/account/affiliates/payouts",
    method: "GET",
    tags: [tags.fetchPayouts]
  });

  validateAPIResponse(response);

  return response.data;
}

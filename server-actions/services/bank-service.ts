"use server";

import { Bank, Currencies } from "@/types";

import fetchBaseQuery, { validateAPIResponse } from "../config/base-query";
import { tags } from "../config/tags";

export async function fetchBankData() {
  const response = await fetchBaseQuery<Bank>({
    url: "/account/bank",
    method: "GET",
    tags: [tags.fetchBankData]
  });

  validateAPIResponse(response);

  return response.data;
}

export async function fetchCurrencies() {
  const response = await fetchBaseQuery<Currencies[]>({
    url: "/currencies",
    method: "GET",
    tags: [tags.fetchCurrencies]
  });

  validateAPIResponse(response);

  return response;
}

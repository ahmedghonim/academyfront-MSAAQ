"use server";

import fetchBaseQuery, { validateAPIResponse } from "../config/base-query";
import { tags } from "../config/tags";

export async function fetchTranslations() {
  const response = await fetchBaseQuery<{
    [key: string]: Record<string, string>;
  }>({
    url: "/translations",
    method: "GET",
    tags: [tags.fetchTranslations]
  });

  validateAPIResponse(response);

  return response.data;
}

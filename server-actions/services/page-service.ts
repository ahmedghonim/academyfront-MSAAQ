import { Page } from "@/types";

import fetchBaseQuery, { validateAPIResponse } from "../config/base-query";
import { tags } from "../config/tags";

export async function fetchPage(slug: string) {
  const response = await fetchBaseQuery<Page>({
    url: `/pages/${slug}`,
    method: "GET",
    tags: [tags.fetchPage(slug)]
  });

  validateAPIResponse(response);

  return response.data;
}

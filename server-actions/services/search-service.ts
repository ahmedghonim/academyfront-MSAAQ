import { AnyObject, Article, Course, Product } from "@/types";

import fetchBaseQuery, { validateAPIResponse } from "../config/base-query";

export async function fetchSearchResults(params?: AnyObject) {
  const response = await fetchBaseQuery<Array<Course | Product | Article>>({
    url: "/search",
    method: "GET",
    params
  });

  validateAPIResponse(response);

  return response.data;
}

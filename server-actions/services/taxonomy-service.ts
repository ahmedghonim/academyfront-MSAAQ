"use server";

import { AnyObject, Category } from "@/types";

import fetchBaseQuery, { validateAPIResponse } from "../config/base-query";
import { tags } from "../config/tags";

export async function fetchTaxonomies(params?: AnyObject) {
  const response = await fetchBaseQuery<Category[]>({
    url: "/taxonomies",
    method: "GET",
    params
  });

  validateAPIResponse(response);

  return response;
}

export async function fetchTaxonomy(slug: string) {
  const response = await fetchBaseQuery<Category>({
    url: `/taxonomies/${slug}`,
    method: "GET",
    tags: [tags.fetchTaxonomy(slug)]
  });

  validateAPIResponse(response);

  return response.data;
}

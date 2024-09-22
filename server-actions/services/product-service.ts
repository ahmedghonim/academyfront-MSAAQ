"use server";

import { AnyObject, Product } from "@/types";

import fetchBaseQuery, { validateAPIResponse } from "../config/base-query";
import { tags } from "../config/tags";

export async function fetchProduct({ slug, ...params }: AnyObject & { slug: string }) {
  const response = await fetchBaseQuery<Product>({
    url: `/products/${slug}`,
    method: "GET",
    tags: [tags.fetchProduct(slug)],
    params
  });

  validateAPIResponse(response);

  return response.data;
}

export async function fetchProducts(params?: AnyObject) {
  const response = await fetchBaseQuery<Product[]>({
    url: "/products",
    method: "GET",
    params
  });

  validateAPIResponse(response);

  return response;
}

export async function fetchInterestingProducts(params: AnyObject & { slug: number | string }) {
  const { slug, ...rest } = params;
  const response = await fetchBaseQuery<Product[]>({
    url: `/products/${slug}/interesting`,
    method: "GET",
    params: rest,
    tags: [tags.fetchInterestingProducts(slug)]
  });

  validateAPIResponse(response);

  return response;
}

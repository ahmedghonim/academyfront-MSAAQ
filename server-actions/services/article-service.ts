"use server";

import { AnyObject, Article, Comment } from "@/types";

import fetchBaseQuery, { validateAPIResponse } from "../config/base-query";
import { tags } from "../config/tags";

export async function fetchArticles(params?: AnyObject) {
  const response = await fetchBaseQuery<Article[]>({
    url: "/articles",
    method: "GET",
    params
  });

  validateAPIResponse(response);

  return response;
}

export async function fetchArticle(slug: string | number) {
  const response = await fetchBaseQuery<Article>({
    url: `/articles/${slug}`,
    method: "GET",
    tags: [tags.fetchArticle(slug)]
  });

  validateAPIResponse(response);

  return response.data;
}

export async function fetchArticleComments(params: AnyObject & { slug: number | string }) {
  const response = await fetchBaseQuery<Comment[]>({
    url: `/articles/${params.slug}/comments`,
    method: "GET",
    tags: [tags.fetchArticleComments(params.slug)]
  });

  validateAPIResponse(response);

  return response;
}

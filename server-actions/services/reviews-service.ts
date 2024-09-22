"use server";

import { AnyObject, Review, ReviewsAverage } from "@/types";

import fetchBaseQuery, { validateAPIResponse } from "../config/base-query";
import { tags } from "../config/tags";

export async function fetchReviews(params: AnyObject) {
  const response = await fetchBaseQuery<Review[]>({
    method: "GET",
    url: "/reviews",
    tags: [tags.fetchReviews(params.relation_type, params.relation_id)],
    params
  });

  validateAPIResponse(response);

  return response;
}

export async function fetchReviewsDistribution(params: {
  relation_type: "product" | "course";
  relation_id: number | string;
}) {
  const response = await fetchBaseQuery<{
    reviews: ReviewsAverage[];
    average: number;
    total: number;
  }>({
    method: "GET",
    url: "/reviews/distribution",
    params,
    tags: [tags.fetchReviewsDistribution(params.relation_type, params.relation_id)]
  });

  validateAPIResponse(response);

  return {
    ...response,
    data: {
      ...response.data,
      total: response.data.reviews.reduce((acc, curr) => acc + curr.aggregate, 0)
    }
  };
}

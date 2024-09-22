"use server";

import { AnyObject, Mentor } from "@/types";

import fetchBaseQuery, { validateAPIResponse } from "../config/base-query";
import { tags } from "../config/tags";

export async function fetchInstructor(params: AnyObject) {
  const response = await fetchBaseQuery<Mentor>({
    url: `/instructors/${params.id}`,
    method: "GET",
    params,
    tags: [tags.fetchInstructor(params.id)]
  });

  validateAPIResponse(response);

  return response.data;
}

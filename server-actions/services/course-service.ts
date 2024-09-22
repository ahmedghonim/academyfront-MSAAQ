"use server";

import { AnyObject, Course } from "@/types";

import fetchBaseQuery, { validateAPIResponse } from "../config/base-query";
import { tags } from "../config/tags";

export async function fetchCourse(slug: string | number) {
  const response = await fetchBaseQuery<Course>({
    url: `/courses/${slug}`,
    method: "GET",
    tags: [tags.fetchCourse(slug)]
  });

  validateAPIResponse(response);

  return response.data;
}

export async function fetchCourses(params?: AnyObject) {
  const response = await fetchBaseQuery<Course[]>({
    url: "/courses",
    method: "GET",
    params
  });

  validateAPIResponse(response);

  return response;
}

export async function fetchInterestingCourses(params: AnyObject & { slug: number | string }) {
  const { slug, ...rest } = params;
  const response = await fetchBaseQuery<Course[]>({
    url: `/courses/${slug}/interesting`,
    method: "GET",
    params: rest,
    tags: [tags.fetchInterestingCourses(slug)]
  });

  validateAPIResponse(response);

  return response;
}

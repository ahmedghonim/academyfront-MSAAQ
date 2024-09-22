"use server";

import fetchBaseQuery from "@/server-actions/config/base-query";
import { AnyObject } from "@/types";

export async function anonymousMutation(url: string, method: string, body: AnyObject) {
  const response = await fetchBaseQuery<any>({
    url: url,
    method,
    body
  });

  if (response.error) {
    throw new Error(JSON.stringify(response.error));
  }

  return response.data;
}

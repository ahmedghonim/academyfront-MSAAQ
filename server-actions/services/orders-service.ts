"use server";

import { APIFetchResponse, validateAPIResponse } from "@/server-actions/config/base-query";
import { Order } from "@/types";

import fetchBaseQuery from "../config/base-query";
import { tags } from "../config/tags";

export async function fetchOrders() {
  const response = await fetchBaseQuery<APIFetchResponse<Order[]>>({
    url: "/account/orders",
    method: "GET",
    tags: [tags.fetchOrders]
  });

  validateAPIResponse(response);

  return response;
}

import { createApi } from "@reduxjs/toolkit/query/react";
import { HYDRATE } from "next-redux-wrapper";

import axiosBaseQuery from "./axiosBaseQuery";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: [
    "memberQuiz.index",
    "memberSurvey.index",
    "content.show",
    "comments",
    "blog_comments",
    "bank.show",
    "affiliates.payouts.index",
    "cart.index",
    "account.courses",
    "account",
    "appointments.index"
  ],
  endpoints: () => ({})
});

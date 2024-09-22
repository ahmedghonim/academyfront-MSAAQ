import { apiSlice } from "@/store/slices/api/apiSlice";
import { APIResponse, APISingleResourceResponse, Article } from "@/types";

export const extendedApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchArticles: builder.query<APIResponse<Article>, object | void>({
      query: (params: {}) => ({
        url: "/articles",
        method: "GET",
        params
      })
    }),
    fetchArticle: builder.query<Article, string>({
      query: (slug) => ({
        url: `/articles/${slug}`,
        method: "GET"
      }),
      transformResponse: (response: APISingleResourceResponse<Article>) => response.data
    })
  })
});

export const { useFetchArticlesQuery } = extendedApiSlice;

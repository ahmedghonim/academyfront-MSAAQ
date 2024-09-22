import { apiSlice } from "@/store/slices/api/apiSlice";
import { APIResponse, Review, ReviewDistribution, ReviewsAverage } from "@/types";

export const extendedApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchReviews: builder.query<APIResponse<Review>, object | void>({
      query: (params) => ({
        url: `/reviews`,
        method: "GET",
        params
      })
    }),
    fetchReviewsDistribution: builder.query<
      {
        reviews: ReviewsAverage[];
        average: number;
        total: number;
      },
      object | void
    >({
      query: (params) => ({
        url: `/reviews/distribution`,
        method: "GET",
        params
      }),
      transformResponse: (response: ReviewDistribution) => {
        return { ...response.data, total: response.data.reviews.reduce((acc, curr) => acc + curr.aggregate, 0) };
      }
    }),
    createReview: builder.mutation<
      Review,
      Pick<Review, "content" | "rating"> & {
        relation_id: number | string;
        relation_type: string;
      }
    >({
      query: (data) => ({
        url: `/reviews`,
        method: "POST",
        data
      })
    }),
    updateReview: builder.mutation<Review, Pick<Review, "id" | "content" | "rating">>({
      query: ({ id, ...data }) => ({
        url: `/reviews/${id}`,
        method: "POST",
        params: {
          _method: "PATCH"
        },
        data
      })
    }),
    deleteReview: builder.mutation<Review, Pick<Review, "id">>({
      query: ({ id }) => ({
        url: `/reviews/${id}`,
        method: "POST",
        params: {
          _method: "DELETE"
        }
      })
    })
  })
});
export const {
  useFetchReviewsQuery,
  useFetchReviewsDistributionQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,

  util: { getRunningQueriesThunk: getRunningReviewsQueries, updateQueryData: updateReviewQueryData }
} = extendedApiSlice;

// export endpoints for use in SSR
export const { fetchReviewsDistribution } = extendedApiSlice.endpoints;

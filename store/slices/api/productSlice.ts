import { apiSlice } from "@/store/slices/api/apiSlice";
import { APIResponse, APISingleResourceResponse, AnyObject, Product } from "@/types";

export const extendedApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchProducts: builder.query<APIResponse<Product>, object | void>({
      query: (params: object = {}) => ({
        url: "/products",
        method: "GET",
        params
      })
    }),
    fetchBestSalesProducts: builder.query<APIResponse<Product>, object | void>({
      query: (params: object = {}) => ({
        url: "/products/best-sales",
        method: "GET",
        params
      })
    }),
    fetchProduct: builder.query<Product, AnyObject & { slug: string }>({
      query: ({ slug, ...params }) => ({
        url: `/products/${slug}`,
        method: "GET",
        params
      }),
      transformResponse: (response: APISingleResourceResponse<Product>) => response.data
    }),
    fetchInterestingProducts: builder.query<Product, AnyObject & { slug: string }>({
      query: ({ slug, ...params }) => ({
        url: `/products/${slug}/interesting`,
        method: "GET",
        params
      }),
      transformResponse: (response: APISingleResourceResponse<Product>) => response.data
    }),
    fetchCoachingSessionAppointments: builder.query<
      Record<string, string[]>,
      { slug: string; month: string; user_id: string | number }
    >({
      query: ({ slug, ...params }) => ({
        url: `/products/${slug}/appointments`,
        method: "GET",
        params
      }),
      transformResponse: (response: APISingleResourceResponse<Record<string, string[]>>) => response.data
    })
  })
});
// Export hooks for usage in functional components
export const {
  useFetchProductQuery,
  useFetchBestSalesProductsQuery,
  useFetchInterestingProductsQuery,
  useFetchProductsQuery,
  useLazyFetchCoachingSessionAppointmentsQuery,
  util: { getRunningQueriesThunk: getRunningProductsQueries }
} = extendedApiSlice;

export const { fetchProduct, fetchProducts, fetchBestSalesProducts } = extendedApiSlice.endpoints;

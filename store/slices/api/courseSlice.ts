import { apiSlice } from "@/store/slices/api/apiSlice";
import { APIResponse, APISingleResourceResponse, AnyObject, Certificate, Course } from "@/types";

export const extendedApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchCourses: builder.query<APIResponse<Course>, object | void>({
      query: (params: object = {}) => ({
        url: "/courses",
        method: "GET",
        params
      })
    }),
    fetchBestSellingCourses: builder.query<APIResponse<Course>, object | void>({
      query: (params: object = {}) => ({
        url: "/courses/best-sales",
        method: "GET",
        params
      })
    }),
    fetchInterestingCourses: builder.query<Course, AnyObject & { slug: number | string }>({
      query: ({ slug, ...params }) => ({
        url: `/courses/${slug}/interesting`,
        method: "GET",
        params
      }),
      transformResponse: (response: APISingleResourceResponse<Course>) => response.data
    }),
    fetchCourse: builder.query<Course, { slug: number | string }>({
      query: ({ slug }) => ({
        url: `/courses/${slug}`,
        method: "GET"
      }),
      transformResponse: (response: APISingleResourceResponse<Course>) => response.data
    }),
    verifyCertificate: builder.mutation<APISingleResourceResponse<Certificate>, { serial: number | string }>({
      query: ({ serial }) => ({
        url: "/certificates/verify",
        method: "POST",
        data: {
          serial
        }
      })
    })
  })
});
// Export hooks for usage in functional components
export const {
  useFetchCoursesQuery,
  useFetchInterestingCoursesQuery,
  useVerifyCertificateMutation,
  useLazyFetchCourseQuery,
  useFetchCourseQuery,
  util: { getRunningQueriesThunk: getRunningCoursesQueries, updateQueryData: updateCourseQueryData }
} = extendedApiSlice;

// export endpoints for use in SSR
export const { fetchCourses, fetchCourse, fetchBestSellingCourses } = extendedApiSlice.endpoints;

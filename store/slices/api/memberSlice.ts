import { apiSlice } from "@/store/slices/api/apiSlice";
import {
  APIActionResponse,
  APIResponse,
  APISingleResourceResponse,
  Appointment,
  Certificate,
  Course,
  DeepPartial,
  LibraryAppointment,
  Member,
  MemberLoginData,
  Product
} from "@/types";

export const extendedApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    updateProfile: builder.mutation<APIActionResponse<Member>, DeepPartial<Member>>({
      query: (data) => ({
        headers: {
          "Content-Type": "multipart/form-data"
        },
        url: "/account",
        method: "POST",
        params: {
          _method: "PATCH"
        },
        data
      })
    }),
    updatePassword: builder.mutation<APIActionResponse<undefined>, Pick<MemberLoginData, "password">>({
      query: (data) => ({
        url: "/account/login-credentials/password",
        method: "POST",
        params: {
          _method: "PATCH"
        },
        data
      })
    }),
    updateLoginCredentials: builder.mutation<
      APIActionResponse<undefined>,
      Omit<MemberLoginData, "otp_code" | "password">
    >({
      query: (data) => ({
        url: "/account/login-credentials",
        method: "POST",
        params: {
          _method: "PATCH"
        },
        data
      })
    }),
    verifyLoginCredentials: builder.mutation<APIActionResponse<undefined>, Omit<MemberLoginData, "password">>({
      query: (data) => ({
        url: "/account/login-credentials/verify",
        method: "POST",
        params: {
          _method: "PATCH"
        },
        data
      })
    }),
    fetchMemberCertificates: builder.query<APIResponse<Certificate>, object | void>({
      query: (params) => ({
        url: "/certificates",
        method: "GET",
        params
      }),
      providesTags: ["account"]
    }),
    fetchMemberCourses: builder.query<APIResponse<Course>, object | void>({
      query: (params) => ({
        url: "/account/courses",
        method: "GET",
        params
      }),
      providesTags: ["account", "account.courses"]
    }),
    fetchMemberProducts: builder.query<APIResponse<Product>, object | void>({
      query: (params) => ({
        url: "/account/products",
        method: "GET",
        params
      }),
      providesTags: ["account"]
    }),
    fetchMemberAppointments: builder.query<APIResponse<Appointment>, object | void>({
      query: (params) => ({
        url: "/account/appointments",
        method: "GET",
        params
      }),
      providesTags: ["account", "appointments.index"]
    }),
    fetchMemberUpcomingAppointments: builder.query<Array<LibraryAppointment>, object | void>({
      query: (params) => ({
        url: "/account/upcoming-appointments",
        method: "GET",
        params
      }),
      transformResponse: (response: APIResponse<LibraryAppointment>) => response.data
    }),
    fetchMemberStats: builder.query<
      {
        todo_courses: number;
        in_progress_courses: number;
        completed_courses: number;
        watched_videos_duration: number;
        accepted_assignments: number;
        eligible_certificates: number;
      },
      object | void
    >({
      query: (params) => ({
        url: "/account/stats",
        method: "GET",
        params
      }),
      transformResponse: (
        response: APISingleResourceResponse<{
          todo_courses: number;
          in_progress_courses: number;
          completed_courses: number;
          watched_videos_duration: number;
          accepted_assignments: number;
          eligible_certificates: number;
        }>
      ) => response.data
    }),
    fetchMemberQuizzes: builder.query<
      Array<{
        id: number;
        course: Course;
        content_id: number;
        chapter_id: number;
        title: string;
      }>,
      object | void
    >({
      query: (params) => ({
        url: "/account/quizzes",
        method: "GET",
        params
      })
    }),
    fetchMemberAssignments: builder.query<
      Array<{
        id: number;
        title: string;
        course: Course;
        content_id: number;
        chapter_id: number;
      }>,
      object | void
    >({
      query: (params) => ({
        url: "/account/assignments",
        method: "GET",
        params
      })
    }),
    fetchMemberRejectedAssignments: builder.query<
      Array<{
        id: number;
        title: string;
        course: Course;
        content_id: number;
        chapter_id: number;
      }>,
      object | void
    >({
      query: (params) => ({
        url: "/account/assignments/rejected",
        method: "GET",
        params
      }),
      transformResponse: (
        response: APIResponse<{
          id: number;
          title: string;
          course: Course;
          content_id: number;
          chapter_id: number;
        }>
      ) => response.data
    })
  })
});

export const {
  useFetchMemberCertificatesQuery,
  useFetchMemberCoursesQuery,
  useFetchMemberProductsQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUpdateLoginCredentialsMutation,
  useVerifyLoginCredentialsMutation,
  useFetchMemberAppointmentsQuery,
  useFetchMemberUpcomingAppointmentsQuery,
  useFetchMemberStatsQuery,
  useFetchMemberQuizzesQuery,
  useFetchMemberAssignmentsQuery,
  useFetchMemberRejectedAssignmentsQuery,
  util: { updateQueryData: updateMemberQueryData }
} = extendedApiSlice;

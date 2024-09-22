import { apiSlice } from "@/store/slices/api/apiSlice";
import { APIResponse, APISingleResourceResponse, AnyObject, Appointment, Certificate } from "@/types";

export const extendedApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    fetchAppointments: builder.query<Appointment[], AnyObject | void>({
      query: (params) => ({
        url: "/appointments",
        method: "GET",
        params
      }),
      providesTags: ["appointments.index"],
      transformResponse: (response: APIResponse<Appointment>) => response.data
    }),
    fetchAppointment: builder.query<Appointment, number | string>({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: "GET"
      }),
      transformResponse: (response: APISingleResourceResponse<Appointment>) => response.data
    }),
    bookAppointment: builder.mutation<
      APISingleResourceResponse<Certificate>,
      {
        slug: string;
        user_id: number | string;
        start_at: string;
        member_timezone: string;
      }
    >({
      query: ({ slug, ...data }) => ({
        url: `/appointments/${slug}`,
        method: "POST",
        data
      }),
      invalidatesTags: ["appointments.index"]
    })
  })
});

export const { useBookAppointmentMutation } = extendedApiSlice;

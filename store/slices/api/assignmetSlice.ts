import { apiSlice } from "@/store/slices/api/apiSlice";
import { AnyObject } from "@/types";

export const extendedApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    submitAssignment: builder.mutation<
      any,
      {
        slug: number | string;
        chapterId: number | string;
        contentId: number | string;
        message?: string;
        attachment: File | Blob;
        params?: AnyObject;
      }
    >({
      query: ({ slug, chapterId, contentId, params, ...data }) => ({
        headers: {
          "Content-Type": "multipart/form-data"
        },
        url: `/courses/${slug}/chapters/${chapterId}/contents/${contentId}/assignments`,
        method: "POST",
        params,
        data
      })
    })
  })
});
export const { useSubmitAssignmentMutation } = extendedApiSlice;

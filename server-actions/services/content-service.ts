import { AttemptQuiz, Comment, Content } from "@/types";
import { redirect } from "@/utils/navigation";

import fetchBaseQuery, { validateAPIResponse } from "../config/base-query";
import { getErrorByStatus } from "../config/error-handler";
import { tags } from "../config/tags";

export async function fetchContentComments({
  slug,
  chapterId,
  contentId
}: {
  slug: number | string;
  chapterId: number | string;
  contentId: number | string;
}) {
  const response = await fetchBaseQuery<Array<Comment>>({
    url: `/courses/${slug}/chapters/${chapterId}/contents/${contentId}/comments`,
    method: "GET",
    tags: [tags.fetchContentComments(slug, chapterId, contentId)]
  });

  if (response.error) {
    throw response.error;
  }

  return response.data;
}

export async function fetchContent({
  slug,
  chapterId,
  contentId,
  ...params
}: {
  slug: number | string;
  chapterId: number | string;
  contentId: number | string;
}) {
  const response = await fetchBaseQuery<Content>({
    url: `/courses/${slug}/chapters/${chapterId}/contents/${contentId}`,
    method: "GET",
    params,
    tags: [tags.fetchContent(slug, chapterId, contentId)]
  });

  if (response.error) {
    if (response.error.status === 403) {
      redirect(`/courses/${slug}?message=you_need_to_enroll_in_this_course`);
    } else if (response.error.status === 401) {
      redirect(`/login?callbackUrl=${encodeURI(`/courses/${slug}/chapters/${chapterId}/contents/${contentId}`)}`);
    }

    const error = getErrorByStatus(response.error.status === "FETCH_ERROR" ? "FETCH_ERROR" : response.error.status);

    if (error) {
      throw error;
    }

    return null;
  }

  return response.data;
}

export async function fetchMemberQuiz({
  slug,
  chapterId,
  contentId,
  ...params
}: {
  slug: number | string;
  chapterId: number | string;
  contentId: number | string;
}) {
  const response = await fetchBaseQuery<AttemptQuiz>({
    url: `/courses/${slug}/chapters/${chapterId}/contents/${contentId}/quizzes/attempts`,
    method: "GET",
    params,
    tags: [tags.fetchMemberQuiz(slug, chapterId, contentId)]
  });

  validateAPIResponse(response);

  return response.data;
}

export async function fetchMemberSurvey({
  slug,
  chapterId,
  contentId,
  ...params
}: {
  slug: number | string;
  chapterId: number | string;
  contentId: number | string;
}) {
  const response = await fetchBaseQuery<AttemptQuiz>({
    url: `/courses/${slug}/chapters/${chapterId}/contents/${contentId}/surveys/attempts`,
    method: "GET",
    params,
    tags: [tags.fetchMemberSurvey(slug, chapterId, contentId)]
  });

  validateAPIResponse(response);

  return response.data;
}

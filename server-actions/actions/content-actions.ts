"use server";

import { revalidateTag } from "next/cache";

import { Comment } from "@/types";

import fetchBaseQuery from "../config/base-query";
import { tags } from "../config/tags";

export async function createContentComment({
  content,
  slug,
  contentId,
  chapterId
}: {
  content: string;
  slug?: number | string;
  contentId?: number | string;
  chapterId?: number | string;
}) {
  return await fetchBaseQuery<Comment>({
    url: `/courses/${slug}/chapters/${chapterId}/contents/${contentId}/comments`,
    method: "POST",
    body: {
      content
    }
  });
}

export async function createContentCommentReplay({
  content,
  comment_id,
  slug,
  chapterId,
  contentId
}: {
  content: string;
  comment_id: string | number;
  slug?: number | string;
  chapterId?: number | string;
  contentId?: number | string;
}) {
  return await fetchBaseQuery<Comment>({
    url: `/courses/${slug}/chapters/${chapterId}/contents/${contentId}/comments/${comment_id}/replies`,
    method: "POST",
    body: {
      content
    }
  });
}

export async function updateContentComment({
  content,
  comment_id,
  slug,
  chapterId,
  contentId
}: {
  content: string;
  comment_id: string | number;
  slug?: number | string;
  chapterId?: number | string;
  contentId?: number | string;
}) {
  return await fetchBaseQuery<Comment>({
    url: `/courses/${slug}/chapters/${chapterId}/contents/${contentId}/comments/${comment_id}`,
    method: "POST",
    params: {
      _method: "PATCH"
    },
    body: {
      content
    }
  });
}

export async function deleteContentComment({
  id,
  slug,
  chapterId,
  contentId
}: {
  id: string | number;
  slug?: number | string;
  chapterId?: number | string;
  contentId?: number | string;
}) {
  return await fetchBaseQuery<Comment>({
    url: `/courses/${slug}/chapters/${chapterId}/contents/${contentId}/comments/${id}`,
    method: "POST",
    params: {
      _method: "DELETE"
    }
  });
}

export async function updateContent({
  slug,
  chapterId,
  contentId,
  ...params
}: {
  slug: number | string;
  chapterId: number | string;
  contentId: number | string;
  data: {
    completed: boolean;
  };
}) {
  const response = await fetchBaseQuery({
    url: `/courses/${slug}/chapters/${chapterId}/contents/${contentId}`,
    method: "PATCH",
    body: params.data
  });

  if (response.error) {
    return response.error;
  }

  revalidateTag(tags.fetchCourse(slug));
  revalidateTag(tags.fetchContent(slug, chapterId, contentId));

  return {
    data: response.data
  };
}

export async function closeMemberQuiz({
  slug,
  chapterId,
  contentId
}: {
  slug: number | string;
  chapterId: number | string;
  contentId: number | string;
}) {
  const response = await fetchBaseQuery({
    url: `/courses/${slug}/chapters/${chapterId}/contents/${contentId}/quizzes/attempts/close`,
    method: "POST"
  });

  if (response.error) {
    return response.error;
  }

  return response;
}

export async function attemptQuiz({
  slug,
  chapterId,
  contentId,
  ...data
}: {
  slug: number | string;
  chapterId: number | string;
  contentId: number | string;
  data?: {
    retake?: boolean;
  };
}) {
  const response = await fetchBaseQuery({
    url: `/courses/${slug}/chapters/${chapterId}/contents/${contentId}/quizzes/attempts`,
    method: "POST",
    body: data
  });

  if (response.error) {
    return response.error;
  }
  revalidateTag(tags.fetchContent(slug, chapterId, contentId));
  revalidateTag(tags.fetchMemberQuiz(slug, chapterId, contentId));

  return response;
}

export async function submitMemberQuizAnswer({
  slug,
  chapterId,
  contentId,
  question_id,
  choice_id
}: {
  slug: number | string;
  chapterId: number | string;
  contentId: number | string;
  question_id: number | string;
  choice_id: number | string;
}) {
  const response = await fetchBaseQuery({
    url: `/courses/${slug}/chapters/${chapterId}/contents/${contentId}/quizzes/attempts/answers`,
    method: "POST",
    body: {
      question_id,
      choice_id
    }
  });

  if (response.error) {
    return response.error;
  }

  revalidateTag(tags.fetchMemberQuiz(slug, chapterId, contentId));

  return response;
}

export async function closeMemberSurvey({
  slug,
  chapterId,
  contentId
}: {
  slug: number | string;
  chapterId: number | string;
  contentId: number | string;
}) {
  const response = await fetchBaseQuery({
    url: `/courses/${slug}/chapters/${chapterId}/contents/${contentId}/surveys/attempts/close`,
    method: "POST"
  });

  if (response.error) {
    return response.error;
  }

  revalidateTag(tags.fetchContent(slug, chapterId, contentId));
  revalidateTag(tags.fetchMemberSurvey(slug, chapterId, contentId));

  return response;
}

export async function attemptSurvey({
  slug,
  chapterId,
  contentId,
  ...data
}: {
  slug: number | string;
  chapterId: number | string;
  contentId: number | string;
  data?: {
    retake?: boolean;
  };
}) {
  const response = await fetchBaseQuery({
    url: `/courses/${slug}/chapters/${chapterId}/contents/${contentId}/surveys/attempts`,
    method: "POST",
    body: data
  });

  if (response.error) {
    return response.error;
  }
  revalidateTag(tags.fetchContent(slug, chapterId, contentId));
  revalidateTag(tags.fetchMemberSurvey(slug, chapterId, contentId));

  return response;
}

export async function submitMemberSurveyAnswer({
  slug,
  chapterId,
  contentId,
  question_id,
  choice_id
}: {
  slug: number | string;
  chapterId: number | string;
  contentId: number | string;
  question_id: number | string;
  choice_id: number | string;
}) {
  const response = await fetchBaseQuery({
    url: `/courses/${slug}/chapters/${chapterId}/contents/${contentId}/surveys/attempts/answers`,
    method: "POST",
    body: {
      question_id,
      choice_id
    }
  });

  if (response.error) {
    return response.error;
  }

  revalidateTag(tags.fetchMemberSurvey(slug, chapterId, contentId));

  return response;
}

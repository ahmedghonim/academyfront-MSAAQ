import { notFound } from "next/navigation";

import { Comments } from "@/components/comments";
import { CommentsStoreProvider } from "@/providers/comments-store-provider";
import {
  createContentComment,
  createContentCommentReplay,
  deleteContentComment,
  updateContentComment
} from "@/server-actions/actions/content-actions";
import { fetchContentComments } from "@/server-actions/services/content-service";
import { fetchCourse } from "@/server-actions/services/course-service";

export default async function Page({
  params
}: {
  params: {
    slug: string;
    chapterId: string;
    contentId: string;
  };
}) {
  const { slug, chapterId, contentId } = params;
  const course = await fetchCourse(slug);

  if (!course) {
    notFound();
  }

  if (course.settings.disable_comments) {
    return null;
  }
  const comments = await fetchContentComments({
    slug: slug as string,
    chapterId: chapterId as string,
    contentId: contentId as string
  });

  return (
    <CommentsStoreProvider
      comments={comments}
      createComment={createContentComment}
      createCommentReplay={createContentCommentReplay}
      updateComment={updateContentComment}
      deleteComment={deleteContentComment}
    >
      <Comments />
    </CommentsStoreProvider>
  );
}

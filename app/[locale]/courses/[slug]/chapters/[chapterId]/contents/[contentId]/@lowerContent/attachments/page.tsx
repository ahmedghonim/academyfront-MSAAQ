import { notFound, redirect } from "next/navigation";

import { ContentAttachments } from "@/components/course/attachments";
import { fetchContent } from "@/server-actions/services/content-service";

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

  const content = await fetchContent({
    slug: slug as string,
    chapterId: chapterId as string,
    contentId: contentId as string
  });

  if (!content) {
    notFound();
  }

  if (!content.attachments || content.attachments.length === 0) {
    redirect(`/courses/${slug}/chapters/${chapterId}/contents/${contentId}`);
  }

  return (
    <div className="mt-4">
      <ContentAttachments
        content={content}
        attachments={content.attachments}
      />
    </div>
  );
}

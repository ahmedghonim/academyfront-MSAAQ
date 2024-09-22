import { notFound } from "next/navigation";

import { AudioContent, MeetingContent, PDFContent, TextContent } from "@/components/course/contents";
import { fetchContent } from "@/server-actions/services/content-service";
import { Content } from "@/types";

const Contents = {
  text: TextContent,
  video: TextContent,
  pdf: PDFContent,
  audio: AudioContent,
  meeting: MeetingContent
};

function renderContent(content: Content) {
  const Content = Contents[content.type as keyof typeof Contents];

  if (!Content) return null;

  return (
    <Content
      // @ts-ignore
      content={content}
    />
  );
}

export default async function Page({
  params
}: {
  params: {
    chapterId: string;
    contentId: string;
    slug: string;
  };
}) {
  const content = await fetchContent({
    slug: params.slug as string,
    chapterId: params.chapterId as string,
    contentId: params.contentId as string
  });

  if (!content) {
    notFound();
  }

  return renderContent(content);
}

import { notFound } from "next/navigation";

import { AssignmentContent, MeetingContent, VideoContent } from "@/components/course/contents";
import { QuizContent } from "@/components/course/contents/quiz";
import { SurveyContent } from "@/components/course/contents/survey";
import { fetchContent } from "@/server-actions/services/content-service";
import { Content } from "@/types";

const Contents = {
  video: VideoContent,
  meeting: MeetingContent,
  assignment: AssignmentContent,
  quiz: QuizContent,
  survey: SurveyContent
};

function renderContent(content: Content | undefined) {
  const Content = Contents[content?.type as keyof typeof Contents];

  if (!Content) return null;

  return (
    <Content
      // @ts-ignore
      content={content}
    />
  );
}

export default async function Default({
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

  if (["text", "audio", "pdf"].includes(content.type)) {
    return null;
  }

  return renderContent(content);
}

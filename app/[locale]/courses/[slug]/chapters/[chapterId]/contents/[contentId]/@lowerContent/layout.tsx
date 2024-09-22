import { notFound } from "next/navigation";

import { fetchContent } from "@/server-actions/services/content-service";
import { fetchCourse } from "@/server-actions/services/course-service";

import TabsLayout from "./tabs-layout";

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {
    chapterId: string;
    contentId: string;
    slug: string;
  };
}) {
  const { slug, chapterId, contentId } = params;
  const course = await fetchCourse(slug);

  if (!course) {
    notFound();
  }

  const content = await fetchContent({
    slug: slug as string,
    chapterId: chapterId as string,
    contentId: contentId as string
  });

  if (!content) {
    notFound();
  }

  if (["meeting", "assignment", "quiz", "survey"].includes(content.type)) {
    return null;
  }

  return (
    <div className="2xl:max-w-[790px]">
      <div className="abjad-tabs mx-auto my-4 inline-block w-full sm:!w-fit">
        <TabsLayout
          content={content}
          course={course}
          params={params}
        />
      </div>
      {children}
    </div>
  );
}

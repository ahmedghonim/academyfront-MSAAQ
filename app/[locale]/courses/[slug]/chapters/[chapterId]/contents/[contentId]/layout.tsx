import { Metadata } from "next";
import { notFound } from "next/navigation";

import ContentFooter from "@/components/course/content-footer";
import ContentHeader from "@/components/course/content-header";
import ContentProvider from "@/components/store/content-provider";
import { fetchContent } from "@/server-actions/services/content-service";
import { fetchCourse } from "@/server-actions/services/course-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import { Chapter, Content } from "@/types";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

import { cn } from "@msaaqcom/abjad/dist/theme";

export async function generateMetadata({
  params
}: {
  params: {
    chapterId: string;
    contentId: string;
    slug: string;
  };
}): Promise<Metadata | null> {
  const tenant = await fetchTenant();

  const course = await fetchCourse(params.slug);

  const content = await fetchContent({
    slug: params.slug as string,
    chapterId: params.chapterId as string,
    contentId: params.contentId as string
  });

  if (!tenant || !course || !content) {
    return null;
  }

  return generateCommonMetadata({
    tenant: tenant,
    keywords: course.meta_keywords,
    title: content.title,
    description: course.meta_description,
    image: course.thumbnail,
    asPath: `/courses/${params.slug}/chapters/${params.chapterId}`
  });
}

export default async function Layout({
  lowerContent,
  upperContent,
  params
}: {
  lowerContent: React.ReactNode;
  upperContent: React.ReactNode;
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

  interface ModifiedContent extends Content {
    chapter_id: Chapter["id"];
  }

  const newContentList: Array<ModifiedContent> | undefined = course?.chapters
    .flatMap((chapter) => {
      const { id: chapterId } = chapter;

      if (!chapter.drip_enabled) {
        return chapter.contents.map((content) => {
          return {
            ...content,
            chapter_id: chapterId
          };
        });
      }

      return [];
    })
    .filter((content) => content !== undefined);

  let contentNavigation = {
    prev: {
      chapter_id: -1,
      content_id: -1,
      is_first: false,
      prevable: false
    },
    next: {
      chapter_id: -1,
      content_id: -1,
      is_last: false,
      nextable: false
    }
  };

  if (newContentList?.length) {
    const currentContentIndex = newContentList.findIndex((el) => el.id.toString() === contentId);

    const prevIndex = currentContentIndex - 1;
    const nextIndex = currentContentIndex + 1;

    const isFirst = currentContentIndex === 0;

    const isLast = currentContentIndex === newContentList.length - 1;

    const prevContent = newContentList[isFirst ? currentContentIndex : prevIndex];
    const nextContent = newContentList[isLast ? currentContentIndex : nextIndex];

    contentNavigation = {
      prev: {
        chapter_id: prevContent?.chapter_id ?? -1,
        content_id: prevContent?.id ?? -1,
        is_first: isFirst,
        prevable: prevContent?.can_access
      },
      next: {
        chapter_id: nextContent?.chapter_id ?? -1,
        content_id: nextContent?.id ?? -1,
        is_last: isLast,
        nextable: nextContent?.can_access
      }
    };
  }

  return (
    <ContentProvider content={contentNavigation}>
      <ContentHeader
        title={content.title}
        course={course}
      />
      <div
        className={cn(!["quiz", "video", "pdf", "audio", "survey"].includes(content.type) ? "2xl:max-w-[790px]" : "")}
      >
        {upperContent}
        {lowerContent}
        {content.type !== "quiz" && content.type !== "survey" && (
          <ContentFooter
            content={content}
            contentCompleted={content.completed}
          />
        )}
      </div>
    </ContentProvider>
  );
}

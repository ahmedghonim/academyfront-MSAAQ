import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ChapterItem } from "@/components/course";
import ContentHeader from "@/components/course/content-header";
import { DripContentSection } from "@/components/course/contents";
import { fetchCourse } from "@/server-actions/services/course-service";
import { fetchTenant } from "@/server-actions/services/tenant-service";
import generateCommonMetadata from "@/utils/generateCommonMetadata";

export async function generateMetadata({
  params
}: {
  params: {
    slug: string;
    chapterId: string;
  };
}): Promise<Metadata | null> {
  const tenant = await fetchTenant();

  const course = await fetchCourse(params.slug);

  if (!tenant || !course) {
    return null;
  }

  return generateCommonMetadata({
    tenant: tenant,
    keywords: course.meta_keywords,
    title: course.title,
    description: course.meta_description,
    image: course.thumbnail,
    asPath: `/courses/${params.slug}/chapters/${params.chapterId}`
  });
}

export default async function Page({
  params
}: {
  params: {
    slug: string;
    chapterId: string;
  };
}) {
  const course = await fetchCourse(params.slug);

  if (!course) {
    notFound();
  }
  const currentChapter = course.chapters.find((chapter) => chapter.id.toString() === params.chapterId);

  return (
    <>
      <ContentHeader
        course={course}
        title={currentChapter?.title as string}
      />
      {currentChapter?.can_access ? (
        <ChapterItem
          showActions
          courseRef={course.slug ?? ""}
          key={currentChapter.id}
          chapter={currentChapter}
        />
      ) : (
        <DripContentSection
          enrolledCourse={course.enrolled ?? false}
          dripableAt={currentChapter?.dripped_at}
        />
      )}
    </>
  );
}

import { notFound } from "next/navigation";

import CourseProgress from "@/components/course/course-progress";
import CompletedCourseModal from "@/components/course/modals/completed-course-modal";
import CourseHeader from "@/components/course/player/course-header";
import CourseSidebar from "@/components/course/player/course-sidebar";
import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import RootLayout from "@/components/layout/root-layout";
import { fetchCourse } from "@/server-actions/services/course-service";

export default async function PlayerLayout({ children, params }: any) {
  const course = await fetchCourse(params.slug);

  if (!course) {
    notFound();
  }

  return (
    <RootLayout params={params}>
      <BaseLayout classNames={{ layout: "mb-0" }}>
        <CourseHeader course={course} />
        <Container layout="fluid">
          <div className="mt-5 grid gap-3 md:!hidden">
            <h1 className="text-2xl font-medium text-black">{course.title as string}</h1>
            <CourseProgress course={course} />
          </div>
          <div className="h-[calc(100vh_-_108px)] overflow-hidden lg:!flex">
            <CourseSidebar course={course} />
            <div className={"scrollbar-hide flex h-full w-full flex-col overflow-y-scroll transition-all lg:!flex-row"}>
              <div className="z-0 mr-auto w-full py-2 transition-all lg:!mt-0">{children}</div>
            </div>
          </div>
          <CompletedCourseModal course={course} />
        </Container>
      </BaseLayout>
    </RootLayout>
  );
}

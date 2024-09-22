"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { CourseCard } from "@/components/course";
import { LoadingCard } from "@/components/loading-card";
import Pagination from "@/components/pagination";
import { useFetchCoursesQuery } from "@/store/slices/api/courseSlice";
import { Course, PageBlock } from "@/types";

import { Button } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

import BaseSection, { getGrid } from "./base-section";

export default function Courses({ block }: { block: PageBlock<"courses">; children?: React.ReactNode }) {
  const t = useTranslations();

  const [courses, setCourses] = useState<Course[]>(block.data.data);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handlePageChange = (data: Course[]) => {
    setCourses(data);
  };

  return (
    <BaseSection block={block}>
      <div className="col-span-12">
        <div className={cn("grid w-full gap-8", getGrid(block))}>
          {isFetching
            ? Array.from({ length: block.fields_values.col }, (_, index) => <LoadingCard key={index} />)
            : courses.map((course: Course, index: number) => (
                <CourseCard
                  course={course}
                  key={index}
                />
              ))}
        </div>
        {courses.length ? (
          <Pagination
            showMoreAction={
              <Button
                href="/courses"
                size="sm"
              >
                {t("common.show_all_with_total", {
                  total: block.data.total
                })}
              </Button>
            }
            total={block.data.total}
            links={block?.data?.links}
            fetchQuery={useFetchCoursesQuery}
            params={{
              page: block.data.current_page,
              limit: block.data.per_page
            }}
            onPageChange={handlePageChange}
            onFetching={(fetching) => setIsFetching(fetching)}
          />
        ) : null}
      </div>
    </BaseSection>
  );
}

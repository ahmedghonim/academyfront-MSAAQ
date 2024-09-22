"use client";

import { useTranslations } from "next-intl";

import EmptyState from "@/components/empty-state";
import { CourseLibraryCard } from "@/components/library";
import { RateProductModal } from "@/components/modals";
import { useInfiniteScroll } from "@/hooks";
import { useAppSelector } from "@/hooks";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { fetchMemberCourses } from "@/server-actions/services/member-service";
import { CourseSliceStateType } from "@/store/slices/courses-slice";
import { AnyObject, Course } from "@/types";

import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";

import { Button, Grid } from "@msaaqcom/abjad";

interface Props {
  initialData: APIFetchResponse<Course[]>;
  initialFilters: AnyObject;
}

const CoursesListing = ({ initialData, initialFilters }: Props) => {
  const t = useTranslations();
  const { courseToReview } = useAppSelector<CourseSliceStateType>((state) => state.courses);

  const {
    data: courses,
    canLoadMore,
    loadMore,
    isLoading
  } = useInfiniteScroll<Course>(initialData, fetchMemberCourses, initialFilters);

  if (!courses.length) {
    return (
      <EmptyState
        className="mt-4"
        iconClassName="text-gray-700"
        title={t("empty_sections.no_courses")}
        description={t("empty_sections.no_courses_description")}
        icon={<MagnifyingGlassCircleIcon />}
        actions={
          <Button
            href="/"
            className="w-full md:!w-auto"
            children={t("common.browse_academy")}
          />
        }
      />
    );
  }

  return (
    <div className="mb-9">
      <Grid
        columns={{
          lg: 12,
          xl: 12,
          md: 12
        }}
        gap={{
          xs: "1rem",
          sm: "1rem",
          md: "1rem",
          lg: "1rem",
          xl: "1rem"
        }}
        className="mt-4"
      >
        {courses.map((course: Course) => (
          <Grid.Cell
            key={course.id}
            columnSpan={{
              lg: 4,
              md: 6
            }}
            className="h-full"
          >
            <CourseLibraryCard course={course} />
          </Grid.Cell>
        ))}
      </Grid>
      {canLoadMore && (
        <div className="mt-4 flex w-full justify-center">
          <Button
            size="md"
            isLoading={isLoading}
            isDisabled={isLoading}
            onPress={loadMore}
            children={t("account.show_more")}
          />
        </div>
      )}
      <RateProductModal
        product={courseToReview as Course}
        callback={() => {
          //TODO:update reviews list after review from courses page
        }}
      />
    </div>
  );
};

export default CoursesListing;

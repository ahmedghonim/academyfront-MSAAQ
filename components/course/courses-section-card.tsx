"use client";

import { useTranslations } from "next-intl";

import { CourseCard } from "@/components/course/index";
import { LoadingCard } from "@/components/loading-card";
import { ProductSectionCard } from "@/components/product";
import { useInfiniteScroll } from "@/hooks";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { fetchCourses } from "@/server-actions/services/course-service";
import { AnyObject } from "@/types";
import { Course } from "@/types";

import { Button, Grid, GridProps } from "@msaaqcom/abjad";

type Props = {
  initialCourses: APIFetchResponse<Course[]>;
  initialFilters: AnyObject;
  columns: GridProps["columns"];
  className?: string;
  title?: string;
};
const CoursesSectionCard = ({ initialCourses, title, initialFilters, columns, className }: Props) => {
  const t = useTranslations();

  const {
    data: courses,
    canLoadMore,
    loadMore,
    isLoading
  } = useInfiniteScroll<Course>(initialCourses, fetchCourses, initialFilters);

  return (
    <ProductSectionCard
      title={title}
      className={className}
      children={
        <>
          <Grid columns={columns}>
            {isLoading
              ? Array.from({ length: 3 }, (_, index) => (
                  <Grid.Cell key={index}>
                    <LoadingCard key={index} />
                  </Grid.Cell>
                ))
              : courses?.map((course: Course, i) => (
                  <Grid.Cell key={i}>
                    <CourseCard course={course} />
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
        </>
      }
    />
  );
};

export default CoursesSectionCard;

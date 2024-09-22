"use client";

import { useTranslations } from "next-intl";
import { AnyObject } from "yup";

import { CourseCard } from "@/components/course";
import { LoadingCard } from "@/components/loading-card";
import { useInfiniteScroll, useMediaQuery } from "@/hooks";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { fetchCourses } from "@/server-actions/services/course-service";
import { BREAKPOINTS, Course } from "@/types";

import { Button, Card, Grid, Typography } from "@msaaqcom/abjad";

type Props = {
  initialCourses: APIFetchResponse<Course[]>;
  initialFilters: AnyObject;
};
const CoursesList = ({ initialCourses, initialFilters }: Props) => {
  const t = useTranslations();
  const {
    data: courses,
    canLoadMore,
    loadMore,
    isLoading,
    total
  } = useInfiniteScroll<Course>(initialCourses, fetchCourses, initialFilters);

  const isMD = useMediaQuery(BREAKPOINTS.md);

  if (!courses || !courses.length) {
    return null;
  }

  return (
    <Card className="courses-section-card h-full border-0 bg-gray-100">
      <Card.Body className="courses-section-card-body flex flex-col space-y-6 p-6">
        <Typography.Title
          size="md"
          className="courses-section-title font-semibold"
          children={t("instructors.the_courses", { count: total }) as string}
        />
        <Grid
          columns={{
            md: 3,
            sm: 1
          }}
          gap={{
            xs: "1rem",
            sm: "1rem",
            md: "1rem",
            lg: "1rem",
            xl: "1rem"
          }}
          className="courses-section-grid"
        >
          {courses.map((course) => (
            <Grid.Cell key={course.id}>
              <CourseCard course={course} />
            </Grid.Cell>
          ))}
        </Grid>
        {isLoading && (
          <Grid
            columns={{
              md: 3,
              sm: 1
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
            {Array.from({ length: isMD ? 3 : 1 }, (_, index) => (
              <Grid.Cell key={index}>
                <LoadingCard key={index} />
              </Grid.Cell>
            ))}
          </Grid>
        )}
        {canLoadMore && (
          <Button
            size="md"
            variant="solid"
            color="primary"
            className="load-more-courses-btn mx-auto mt-4 flex"
            isLoading={isLoading}
            onPress={loadMore}
          >
            {t("common.load_more")}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default CoursesList;

"use client";

import React from "react";

import { useTranslations } from "next-intl";
import { AnyObject } from "yup";

import { useInfiniteScroll } from "@/hooks";
import EmptyStateImage from "@/public/images/empty-state-image.svg";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { fetchMemberQuizzes } from "@/server-actions/services/member-service";
import { Course } from "@/types";
import { Thumbnail } from "@/ui/images";

import { Badge, Button, Card, Typography } from "@msaaqcom/abjad";

const MemberQuizzes = ({
  initialData,
  initialFilters
}: {
  initialData: APIFetchResponse<
    {
      id: number;
      course: Course;
      content_id: number;
      chapter_id: number;
      title: string;
    }[]
  >;
  initialFilters: AnyObject;
}) => {
  const t = useTranslations();

  const { data, canLoadMore, isLoading, loadMore } = useInfiniteScroll<{
    id: number;
    course: Course;
    content_id: number;
    chapter_id: number;
    title: string;
  }>(initialData, fetchMemberQuizzes, initialFilters);

  if (!data.length) {
    return (
      <Card className="border-0">
        <Card.Body className="flex flex-col items-center justify-center space-y-8 p-8 text-center">
          <EmptyStateImage className="h-56 w-56 text-primary md:!h-64 md:!w-64" />
          <Typography.Title
            as="p"
            size="lg"
            className="font-semibold"
          >
            {t("empty_sections.no_quizzes_in_library")}
          </Typography.Title>
          <Button href="/account/courses">{t("library.review_courses")}</Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {data.map((quiz) => (
        <Card
          key={quiz.id}
          className="border-0 bg-gray-100"
        >
          <Card.Body className="flex justify-between gap-4">
            {quiz.course.thumbnail && (
              <div className="hidden h-20 w-20 md:block">
                <Thumbnail
                  rounded="xl"
                  className="h-20 w-20"
                  src={quiz.course.thumbnail}
                  alt={quiz.title}
                />
              </div>
            )}
            <div className="flex shrink grow basis-auto flex-col items-start">
              <Badge
                color="primary"
                variant="soft"
              >
                {t("library.upcoming_quiz")}
              </Badge>
              <div className="mt-2 flex flex-col">
                <Typography.Body
                  size="base"
                  className="font-semibold text-black"
                >
                  {quiz.title}
                </Typography.Body>
                <Typography.Body
                  size="md"
                  className="text-gray-800"
                >
                  {quiz.course.title}
                </Typography.Body>
              </div>
            </div>
            <Button
              color="gray"
              href={`/courses/${quiz.course.slug}/chapters/${quiz.chapter_id}/contents/${quiz.content_id}`}
            >
              {t("library.quiz_start")}
            </Button>
          </Card.Body>
        </Card>
      ))}
      {canLoadMore && (
        <Button
          isLoading={isLoading}
          isDisabled={isLoading}
          onPress={() => loadMore()}
          color="primary"
          variant="outline"
          className="mx-auto w-full md:!w-auto"
        >
          {t("common.load_more")}
        </Button>
      )}
    </div>
  );
};

export default MemberQuizzes;

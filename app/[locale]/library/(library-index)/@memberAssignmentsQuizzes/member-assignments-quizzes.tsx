"use client";

import React from "react";

import { useTranslations } from "next-intl";
import { AnyObject } from "yup";

import { MemberAssignments, MemberQuizzes } from "@/components/library";
import { MemberRejectedAssignments } from "@/components/library";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { Course } from "@/types";

import { Tab, Tabs, Typography } from "@msaaqcom/abjad";
import { Knowledge02Icon, QuestionIcon } from "@msaaqcom/hugeicons/rounded/stroke";

const MemberAssignmentsQuizzes = ({
  quizzes,
  quizzesFilters,
  rejectedAssignments,
  assignments,
  assignmentsFilters
}: {
  quizzes: APIFetchResponse<
    {
      id: number;
      course: Course;
      content_id: number;
      chapter_id: number;
      title: string;
    }[]
  >;
  quizzesFilters: AnyObject;
  rejectedAssignments: {
    id: number;
    title: string;
    course: Course;
    content_id: number;
    chapter_id: number;
  }[];
  assignments: APIFetchResponse<
    {
      id: number;
      title: string;
      course: Course;
      content_id: number;
      chapter_id: number;
    }[]
  >;
  assignmentsFilters: AnyObject;
}) => {
  const t = useTranslations();

  return (
    <div className="mb-6 flex flex-col space-y-6">
      <Typography.Title
        size="sm"
        className="font-semibold"
      >
        {t("library.quizzes_assignments")}
      </Typography.Title>
      <Tabs
        aria-label="quizzes_assignments"
        className="my-4 w-full sm:!w-fit"
        defaultSelectedKey="quizzes"
      >
        <Tab
          key="quizzes"
          title={t("library.quizzes")}
          iconAlign="start"
          icon={<QuestionIcon className="h-6 w-6 text-inherit" />}
        >
          <MemberQuizzes
            initialData={quizzes}
            initialFilters={quizzesFilters}
          />
        </Tab>
        <Tab
          key="assignments"
          title={t("library.assignments")}
          iconAlign="start"
          icon={<Knowledge02Icon className="h-6 w-6 text-inherit" />}
        >
          <MemberRejectedAssignments rejectedAssignments={rejectedAssignments} />
          <MemberAssignments
            initialData={assignments}
            initialFilters={assignmentsFilters}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default MemberAssignmentsQuizzes;

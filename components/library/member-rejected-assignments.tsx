"use client";

import React from "react";

import { useTranslations } from "next-intl";

import { Course } from "@/types";
import { Thumbnail } from "@/ui/images";

import { Badge, Button, Card, Typography } from "@msaaqcom/abjad";

const MemberRejectedAssignments = ({
  rejectedAssignments
}: {
  rejectedAssignments: {
    id: number;
    title: string;
    course: Course;
    content_id: number;
    chapter_id: number;
  }[];
}) => {
  const t = useTranslations();

  if (!rejectedAssignments || !rejectedAssignments.length) {
    return null;
  }

  return (
    <>
      <div className="mb-6 flex flex-col space-y-6 md:mb-0">
        {rejectedAssignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="border-0 bg-gray-100"
          >
            <Card.Body className="flex justify-between gap-4">
              {assignment.course.thumbnail && (
                <div className="hidden h-20 w-20 md:block">
                  <Thumbnail
                    rounded="xl"
                    className="h-20 w-20"
                    src={assignment.course.thumbnail}
                    alt={assignment.course.title}
                  />
                </div>
              )}
              <div className="flex shrink grow basis-auto flex-col items-start">
                <Badge
                  color="danger"
                  variant="soft"
                >
                  {t("library.rejected_assignment")}
                </Badge>
                <div className="mt-2 flex flex-col">
                  <Typography.Body
                    size="base"
                    className="font-semibold text-black"
                  >
                    {assignment.title}
                  </Typography.Body>
                  <Typography.Body
                    size="md"
                    className="text-gray-800"
                  >
                    {assignment.course.title}
                  </Typography.Body>
                </div>
              </div>
              <Button
                color="gray"
                href={`/courses/${assignment.course.slug}/chapters/${assignment.chapter_id}/contents/${assignment.content_id}`}
              >
                {t("library.view_assignment")}
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
      <div className="my-6 hidden h-px w-full bg-gray-400 md:block" />
    </>
  );
};

export default MemberRejectedAssignments;

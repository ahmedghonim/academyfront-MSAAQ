"use client";

import { useTranslations } from "next-intl";

import { Course } from "@/types";

import { DocumentTextIcon } from "@heroicons/react/24/outline";

import { Avatar, Button, Icon, Title, Typography } from "@msaaqcom/abjad";

const CourseInstructors = ({ instructors }: { instructors: Course["instructors"] }) => {
  const t = useTranslations();

  if (!instructors) {
    return null;
  }

  return (
    <>
      {instructors.map((instructor) => (
        <div
          key={instructor.id}
          className="flex flex-col items-start justify-between rounded-lg bg-white px-6 py-4 md:!flex-row md:!items-center"
        >
          <Title
            prepend={
              <Avatar
                size="lg"
                imageUrl={instructor.avatar}
                name={instructor.name}
              />
            }
            title={
              <>
                <Typography.Body
                  as="h6"
                  size="base"
                  className="ms-2 font-medium"
                >
                  {instructor.name}
                </Typography.Body>
              </>
            }
            subtitle={
              instructor.bio && (
                <>
                  <Typography.Body
                    size="md"
                    className="me-4 ms-2 font-normal text-gray-700"
                    children={instructor.bio}
                  />
                </>
              )
            }
          />
          <Button
            color="gray"
            className="hidden md:!block"
            href={`/@${instructor.username ?? instructor.uuid}`}
            icon={
              <Icon>
                <DocumentTextIcon />
              </Icon>
            }
          />
          <Button
            color="gray"
            className="mt-3 block w-full text-center md:!hidden"
            href={`/@${instructor.username ?? instructor.uuid}`}
            children={t("course_page.view_profile")}
          />
        </div>
      ))}
    </>
  );
};

export default CourseInstructors;

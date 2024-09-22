"use client";

import { useTranslations } from "next-intl";

import { ContinueCourseAction } from "@/components/course";
import dayjs from "@/lib/dayjs";
import { Course, DAY_MON_YEAR_FORMAT } from "@/types";

import { MapPinIcon } from "@heroicons/react/24/outline";

import { Alert, Button, Card, Icon, Typography } from "@msaaqcom/abjad";

const CustomPageHeader = ({ course }: { course: Course }) => {
  const t = useTranslations();

  return (
    <Card className="sticky top-[--header-placement] z-[999] hidden rounded-none border-x-0 border-b border-t-0 border-gray-400 transition-all md:block">
      <Card.Body className="flex flex-col justify-between sm:!flex-row sm:!items-center">
        <div className="mb-2 flex flex-col gap-2">
          <Typography.Body
            size="md"
            className="font-semibold text-success"
          >
            {t("course_page.you_are_enrolled_in_this_course")}
          </Typography.Body>
          <Typography.Body
            size="lg"
            className="font-bold"
          >
            {course.title}
          </Typography.Body>
        </div>
        {course.course_type == "online" ? (
          course.is_started ? (
            <ContinueCourseAction
              course={course}
              variant="solid"
              color="primary"
              className="px-16"
            />
          ) : (
            <Alert
              variant="soft"
              color="gray"
              children={t("common.course_starts_at", {
                date: dayjs(course.publish_at).format(DAY_MON_YEAR_FORMAT)
              })}
            />
          )
        ) : (
          <Button
            variant="outline"
            icon={
              <Icon>
                <MapPinIcon />
              </Icon>
            }
            href={course.location.url}
            target="_blank"
            color="primary"
          >
            {t("common.show_on_google_map")}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default CustomPageHeader;

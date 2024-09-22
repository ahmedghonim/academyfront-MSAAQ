"use client";

import { useTranslations } from "next-intl";

import dayjs from "@/lib/dayjs";
import { Course } from "@/types";

import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";

import { Card, Icon, Title } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

const CourseOnsiteLocation = ({ course }: { course: Course }) => {
  const t = useTranslations();

  return (
    <>
      <Card className={cn("rounded-xl border-transparent bg-gray-100", "mb-4 rounded-2xl bg-white px-4 last:mb-0")}>
        <Card.Body className="">
          <div className="flex flex-col items-start gap-4">
            <Icon
              size="md"
              className="p-4"
              variant="solid"
              color="gray"
              rounded="full"
              children={<CalendarIcon />}
            />
            <div className="flex w-full gap-6">
              <Title
                className="w-full"
                title={<span className="font-medium text-gray-700">{t("course_page.onsite_course.from")}</span>}
                subtitle={
                  <span className="text-xl font-medium text-black">
                    {dayjs(course.timing.from).format("dddd، D MMMM YYYY")}
                  </span>
                }
              />
              <Title
                className="w-full"
                title={<span className="font-medium text-gray-700">{t("course_page.onsite_course.to")}</span>}
                subtitle={
                  <span className="text-xl font-medium text-black">
                    {dayjs(course.timing.to).format("dddd، D MMMM YYYY")}
                  </span>
                }
              />
            </div>
          </div>
        </Card.Body>
      </Card>
      {course.location.address && (
        <Card className={cn("rounded-xl border-transparent bg-gray-100", "mb-4 rounded-2xl bg-white px-4 last:mb-0")}>
          <Card.Body className="">
            <div className="flex flex-col items-start gap-4">
              <Icon
                size="md"
                className="p-4"
                variant="solid"
                color="gray"
                rounded="full"
                children={<MapPinIcon />}
              />
              <div className="flex w-full gap-6">
                <Title
                  className="w-full"
                  title={
                    <span className="font-medium text-gray-700">{t("course_page.onsite_course.course_location")}</span>
                  }
                  subtitle={<span className="text-xl font-medium text-black">{course.location.address}</span>}
                />
              </div>
              <div className="flex w-full gap-6">
                <Title
                  className="w-full"
                  title={<span className="font-medium text-gray-700">{t("course_page.onsite_course.building")}</span>}
                  subtitle={<span className="text-xl font-medium text-black">{course.location.building}</span>}
                />
                <Title
                  className="w-full"
                  title={<span className="font-medium text-gray-700">{t("course_page.onsite_course.marker")}</span>}
                  subtitle={<span className="text-xl font-medium text-black">{course.location.special_mark}</span>}
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default CourseOnsiteLocation;

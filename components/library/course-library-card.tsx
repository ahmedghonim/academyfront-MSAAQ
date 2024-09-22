"use client";

import { ReactNode, useMemo } from "react";

import { useTranslations } from "next-intl";

import { ContinueCourseAction } from "@/components/course";
import { useAppDispatch, useDownloadFile } from "@/hooks";
import { ProgressBarLink } from "@/providers/progress-bar";
import { setCourseToReview, setOpenRatingModal } from "@/store/slices/courses-slice";
import { Course } from "@/types";
import { Thumbnail } from "@/ui/images";

import { MapPinIcon } from "@heroicons/react/24/outline";

import { Button, Card, Icon, Progress, Typography } from "@msaaqcom/abjad";

type CourseCardProps = {
  course: Course;
  children?: ReactNode;
};

const CourseLibraryCard = ({ course }: CourseCardProps) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const { downloading, downloadFile } = useDownloadFile();

  const canReview = useMemo(() => !course.is_reviewed && course.settings.reviews_enabled, [course]);

  const ContinueCourseBtn = () => (
    <ContinueCourseAction
      course={course}
      variant="outline"
      className="shrink grow basis-auto break-words"
    >
      <span className="absolute -inset-2.5 z-10"></span>
      <span className="relative">{t("common.continue_course")}</span>
    </ContinueCourseAction>
  );

  const DownloadCertificateBtn = () => (
    <Button
      isLoading={downloading}
      onPress={() => downloadFile(`/courses/${course.slug}/certificate`, `${course.title}-certificate`)}
      className="shrink grow basis-auto break-words"
      icon={
        <Icon>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.66699 3.66211C6.87207 3.66211 5.41699 5.11718 5.41699 6.91211V14.9121C5.41699 16.1141 6.06915 17.1647 7.04254 17.7278C7.40108 17.9352 7.5236 18.394 7.3162 18.7525C7.10879 19.1111 6.64999 19.2336 6.29145 19.0262C4.87363 18.206 3.91699 16.6712 3.91699 14.9121V6.91211C3.91699 4.28876 6.04364 2.16211 8.66699 2.16211H16.667C19.2903 2.16211 21.417 4.28876 21.417 6.91211V14.9121C21.417 16.6712 20.4604 18.206 19.0425 19.0262C18.684 19.2336 18.2252 19.1111 18.0178 18.7525C17.8104 18.394 17.9329 17.9352 18.2914 17.7278C19.2648 17.1647 19.917 16.1141 19.917 14.9121V6.91211C19.917 5.11718 18.4619 3.66211 16.667 3.66211H8.66699ZM7.91699 6.91211C7.91699 6.4979 8.25278 6.16211 8.66699 6.16211H16.667C17.0812 6.16211 17.417 6.4979 17.417 6.91211C17.417 7.32632 17.0812 7.66211 16.667 7.66211H8.66699C8.25278 7.66211 7.91699 7.32632 7.91699 6.91211ZM7.91699 10.9121C7.91699 10.4979 8.25278 10.1621 8.66699 10.1621H12.667C13.0812 10.1621 13.417 10.4979 13.417 10.9121C13.417 11.3263 13.0812 11.6621 12.667 11.6621H8.66699C8.25278 11.6621 7.91699 11.3263 7.91699 10.9121ZM12.667 14.6621C11.4244 14.6621 10.417 15.6695 10.417 16.9121C10.417 18.1547 11.4244 19.1621 12.667 19.1621C13.9096 19.1621 14.917 18.1547 14.917 16.9121C14.917 15.6695 13.9096 14.6621 12.667 14.6621ZM8.91699 16.9121C8.91699 14.841 10.5959 13.1621 12.667 13.1621C14.7381 13.1621 16.417 14.841 16.417 16.9121C16.417 17.5939 16.235 18.2333 15.917 18.7842V22.9121C15.917 23.161 15.7935 23.3936 15.5875 23.5332C15.3814 23.6727 15.1195 23.7009 14.8884 23.6085L12.667 22.7199L10.4455 23.6085C10.2145 23.7009 9.9526 23.6727 9.74652 23.5332C9.54044 23.3936 9.41699 23.161 9.41699 22.9121V18.7842C9.09896 18.2333 8.91699 17.5939 8.91699 16.9121ZM10.917 20.2296V21.8043L12.3884 21.2158C12.5673 21.1442 12.7667 21.1442 12.9455 21.2158L14.417 21.8043V20.2296C13.8946 20.5057 13.299 20.6621 12.667 20.6621C12.0349 20.6621 11.4394 20.5057 10.917 20.2296Z"
              fill="currentColor"
            />
          </svg>
        </Icon>
      }
      children={t("account.download_certificate")}
    />
  );
  const Actions = () => {
    if (course.course_type == "online") {
      if (course.enrollment.completed_at) {
        if (course.eligible_for_certificate || canReview) {
          return (
            <div className="flex flex-wrap gap-4">
              {course.eligible_for_certificate && <DownloadCertificateBtn />}
              {!course.is_reviewed && course.settings.reviews_enabled && (
                <Button
                  variant="outline"
                  className="shrink grow basis-auto break-words"
                  children={t("common.course_review")}
                  onPress={() => {
                    dispatch(setOpenRatingModal(true));
                    dispatch(setCourseToReview(course));
                  }}
                />
              )}
            </div>
          );
        } else {
          return <ContinueCourseBtn />;
        }
      } else {
        return (
          <div className="flex flex-wrap gap-4">
            {course.eligible_for_certificate && <DownloadCertificateBtn />}
            <ContinueCourseBtn />
          </div>
        );
      }
    } else {
      return (
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
          className="w-full"
        >
          {t("common.show_on_google_map")}
        </Button>
      );
    }
  };

  return (
    <Card className="group h-full transform duration-150 ease-linear hover:-translate-y-2 hover:shadow-[12px_32px_32px_0px_rgba(0,0,0,0.12)]">
      <Card.Body className="relative flex h-full flex-col p-4">
        <Thumbnail
          src={course.thumbnail}
          alt={course.title}
        />
        <div className="mt-4 flex flex-1 flex-col space-y-2">
          <Typography.Body
            as="h3"
            size="base"
            className="break-words font-semibold group-hover:text-primary"
          >
            <ProgressBarLink href={`/courses/${course.slug}`}>
              <span
                aria-hidden="true"
                className="absolute inset-0"
              />
              {course.title}
            </ProgressBarLink>
          </Typography.Body>
          {course.course_type == "online" && (
            <Progress.Bar
              value={course.enrollment.percentage_completed ?? 0}
              color="primary"
            />
          )}
        </div>
      </Card.Body>
      <Card.Footer className="mt-auto flex-col space-y-4">
        <Actions />
      </Card.Footer>
    </Card>
  );
};

export default CourseLibraryCard;

"use client";

import { useEffect, useMemo } from "react";

import { useTranslations } from "next-intl";

import { useServerAction } from "@/hooks";
import { fetchCourse } from "@/server-actions/services/course-service";
import { Course } from "@/types";
import { getLastViewedPath } from "@/utils";
import { useRouter } from "@/utils/navigation";

import { VideoCameraIcon } from "@heroicons/react/24/outline";

import { Button, Icon } from "@msaaqcom/abjad";
import { ButtonVariantProps } from "@msaaqcom/abjad/dist/theme";

interface Props {
  course: Course;
  variant?: ButtonVariantProps["variant"];
  color?: ButtonVariantProps["color"];
  className?: string;
  children?: React.ReactNode;
}

const ContinueCourseLinkAction = ({ course, children, ...props }: Props) => {
  const path = useMemo(() => getLastViewedPath(course), [course]);

  const t = useTranslations();

  return (
    <Button
      href={path}
      icon={
        <Icon size="md">
          <VideoCameraIcon />
        </Icon>
      }
      {...props}
    >
      {children ? children : t("common.continue_course")}
    </Button>
  );
};
const ContinueCourseBtnAction = ({ course, children, ...props }: Props) => {
  const t = useTranslations();
  const [trigger, result] = useServerAction(fetchCourse);
  const router = useRouter();

  useEffect(() => {
    if (result.isSuccess && result.data) {
      router.push(getLastViewedPath(result.data));
    }
  }, [result]);

  if (course.course_type == "on_site") {
    return (
      <Button
        variant="outline"
        onPress={() => trigger(course.slug)}
        children={t("common.continue_course")}
      />
    );
  }

  return (
    <Button
      icon={
        <Icon size="md">
          <VideoCameraIcon />
        </Icon>
      }
      onPress={async () => {
        await trigger(course.slug);
      }}
      {...props}
    >
      {children ? children : t("common.continue_course")}
    </Button>
  );
};

const ContinueCourseAction = ({ course, ...props }: Props) => {
  if (course.enrollment?.last_viewed) {
    return (
      <ContinueCourseLinkAction
        course={course}
        {...props}
      />
    );
  }

  return (
    <ContinueCourseBtnAction
      course={course}
      {...props}
    />
  );
};

export default ContinueCourseAction;

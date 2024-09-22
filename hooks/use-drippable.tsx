"use client";

import { useMemo } from "react";

import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import dayjs from "@/lib/dayjs";
import { useSession } from "@/providers/session-provider";
import { useFetchCourseQuery } from "@/store/slices/api/courseSlice";
import { Chapter } from "@/types";

function useDrippable(chapter: Chapter) {
  const { slug } =
    useParams<{
      slug: string;
    }>() ?? {};

  const { member } = useSession();

  const { data: course } = useFetchCourseQuery({ slug: slug as string });
  const t = useTranslations();

  return useMemo(() => {
    const { drip_after, dripped_at, drip_enabled, drip_type } = chapter;

    if (!drip_enabled || chapter.can_access) {
      return;
    }

    if (drip_type === "dripped_at" && dayjs(dripped_at).isBefore(dayjs())) {
      return;
    }

    if (member && course && course.enrolled) {
      return t("drip_content.dripped_at", {
        date: dayjs(dripped_at).format("D MMMM، YYYY")
      });
    } else if (!member || !course?.enrolled) {
      if (drip_type === "created_at" || drip_type === "started_at") {
        return t(`drip_content.${drip_type}`, {
          date: drip_after
        });
      } else {
        return t("drip_content.dripped_at", {
          date: dayjs(dripped_at).format("D MMMM، YYYY")
        });
      }
    } else {
      return;
    }
  }, [t, course, member, chapter]);
}

export default useDrippable;

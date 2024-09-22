"use client";

import { revalidateTag } from "next/cache";
import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import TimeOutImg from "@/public/images/quiz-time-out.svg";
import { tags } from "@/server-actions/config/tags";

import { Button, Typography } from "@msaaqcom/abjad";

const TimeOutSection = () => {
  const t = useTranslations();

  const params = useParams<{
    slug: string;
    chapterId: string;
    contentId: string;
  }>();

  return (
    <div className="flex flex-col items-center justify-center">
      <TimeOutImg className="mb-8 text-primary" />
      <div className="mb-4 flex flex-col items-center justify-center space-y-4">
        <Typography.Text
          as="h3"
          size="lg"
          children={t("course_player.quiz_timeout_title")}
          className="mb-3 font-semibold"
        />
        <Typography.Text
          as="p"
          size="sm"
          className="font-normal text-gray-700"
          children={t("course_player.quiz_timeout_description")}
        />
      </div>
      <Button
        variant="solid"
        color="primary"
        onPress={() => {
          revalidateTag(tags.fetchMemberQuiz(params?.slug, params?.chapterId, params?.contentId));
        }}
        children={t("course_player.quiz_view_results")}
      />
    </div>
  );
};

export default TimeOutSection;

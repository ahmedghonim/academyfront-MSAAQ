"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import { useAppSelector } from "@/hooks";
import { CourseSliceStateType } from "@/store/slices/courses-slice";

import { Button, Card, Typography } from "@msaaqcom/abjad";

const SurveyResult = () => {
  const t = useTranslations();
  const params = useParams<{
    slug: string;
  }>();

  const { content } = useAppSelector<CourseSliceStateType>((state) => state.courses);

  return (
    <Card>
      <Card.Body className="flex flex-col justify-center space-y-6 !px-6 !py-16">
        <div className="flex flex-col items-center justify-center space-y-2.5 text-center">
          <Image
            src={"/images/check-success.gif"}
            alt={"check-success"}
            width={120}
            height={120}
          />
          <div className="flex flex-col gap-1">
            <Typography.Title
              size="md"
              className="font-semibold"
              children={t("course_player.survey_submitted_message")}
            />
          </div>
        </div>
        {!content.next.is_last && content.next.nextable && (
          <Button
            href={`/courses/${params?.slug}/chapters/${content.next.chapter_id}/contents/${content.next.content_id}`}
            children={t("common.next")}
            className="mx-auto"
          />
        )}
      </Card.Body>
    </Card>
  );
};

export default SurveyResult;

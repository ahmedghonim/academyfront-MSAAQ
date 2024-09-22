"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import { useResponseToastHandler } from "@/hooks";
import IntroImage from "@/public/images/quiz-intro.svg";
import { attemptQuiz } from "@/server-actions/actions/content-actions";
import { FetchErrorType } from "@/server-actions/config/base-query";
import { AttemptQuiz, Chapter, Content, Course } from "@/types";
import { Quiz } from "@/types/modals/quiz";
import transWithCount from "@/utils/trans-with-count";

import { Button, Card, Typography } from "@msaaqcom/abjad";

interface Props {
  content: Content<Quiz>;
  course: Course;
  memberQuiz: AttemptQuiz;
}

const QuizInformation = ({ content, memberQuiz, course }: Props) => {
  const t = useTranslations();
  const params = useParams<{
    slug: string;
    chapterId: string;
    contentId: string;
  }>();

  const [currentChapter, setCurrentChapter] = useState<Chapter>();

  const { displayErrors } = useResponseToastHandler({});

  useEffect(() => {
    //TODO: add current chapter to store
    const chapter = course?.chapters.find((chapter) => chapter.id.toString() === params?.chapterId);

    setCurrentChapter(chapter);
  }, [course, params?.chapterId]);

  return (
    <div className="flex flex-col items-center justify-center">
      <IntroImage className="mb-8 text-primary" />
      <div className="grid w-full grid-cols-1 gap-8 sm:!w-3/4 sm:!grid-cols-3">
        <Card className="bg-gray-100">
          <Card.Body className="p-6">
            <div className="flex flex-col items-start justify-center gap-2">
              <Typography.Body
                size="md"
                className="font-normal text-gray-700"
                children={t("course_player.quiz_passing_score")}
              />
              <Typography.Body
                className="text-base font-semibold text-success"
                children={`${content.contentable.passing_score}%`}
              />
            </div>
          </Card.Body>
        </Card>
        <Card className="bg-gray-100">
          <Card.Body className="p-6">
            <div className="flex flex-col items-start justify-center gap-2">
              <Typography.Body
                size="md"
                className="font-normal text-gray-700"
                children={t("course_player.quiz_total_questions_count")}
              />
              <Typography.Body
                className="text-base font-semibold"
                children={t(
                  transWithCount("course_player.quiz_questions_WithCount", content.contentable.questions_count),
                  {
                    count: content.contentable.questions_count
                  }
                )}
              />
            </div>
          </Card.Body>
        </Card>
        <Card className="bg-gray-100">
          <Card.Body className="p-6">
            <div className="flex flex-col items-start justify-center gap-2">
              <Typography.Body
                size="md"
                className="font-normal text-gray-700"
                children={t("course_player.quiz_quiz_time")}
              />
              <Typography.Body
                className="text-base font-semibold"
                children={t(
                  transWithCount("course_player.quiz_minutes_WithCount", Math.floor(content.contentable.duration / 60)),
                  {
                    count: Math.floor(content.contentable.duration / 60)
                  }
                )}
              />
            </div>
          </Card.Body>
        </Card>
      </div>
      <div className="mt-6 flex w-full flex-col text-center sm:!w-3/4">
        <Typography.Text
          as="h2"
          size="lg"
          className="font-semibold"
          children={t("course_player.quiz_title", { title: content.contentable.title })}
        />
        {content.description ? (
          <Typography.Text
            size="xs"
            as="p"
            className="mb-6 mt-4 font-normal text-gray-700"
            children={content.description}
          />
        ) : (
          <Typography.Text
            size="xs"
            className="mb-6 mt-4 font-normal text-gray-700"
            children={t("course_player.content_subtitle", { subtitle: currentChapter?.title })}
          />
        )}

        <Button
          color="primary"
          variant="solid"
          className="mx-auto px-12"
          children={t("course_player.quiz_start")}
          onPress={async () => {
            const response = (await attemptQuiz({
              slug: params?.slug as string,
              chapterId: params?.chapterId as string,
              contentId: params?.contentId as string
            })) as FetchErrorType;

            if (displayErrors(response)) return;
          }}
        />
      </div>
    </div>
  );
};

export default QuizInformation;

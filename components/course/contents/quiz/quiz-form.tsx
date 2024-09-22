"use client";

import { useEffect, useMemo, useState } from "react";

import { notFound, useParams } from "next/navigation";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { useCountdown, useResponseToastHandler } from "@/hooks";
import useCompleteContent from "@/hooks/use-complete-content";
import { closeMemberQuiz, submitMemberQuizAnswer } from "@/server-actions/actions/content-actions";
import { APIFetchResponse, FetchErrorType } from "@/server-actions/config/base-query";
import { AttemptQuiz, Choice, Question } from "@/types";
import { Answer } from "@/types/modals/answer";

import { Button, Card, Typography } from "@msaaqcom/abjad";

import QuizQuestion from "./quiz-question";
import QuizQuestionChoice from "./quiz-question-choice";
import TimeOutSection from "./time-out-section";

interface IFormInputs {
  questions: Question[];
  answer:
    | {
        question_id: number;
        choice_id: number;
      }
    | undefined;
}

const QuizForm = ({ memberQuiz }: { memberQuiz: AttemptQuiz }) => {
  const t = useTranslations();
  const params = useParams<{
    slug: string;
    chapterId: string;
    contentId: string;
  }>();
  const [completeContent] = useCompleteContent();

  if (!memberQuiz) {
    notFound();
  }
  const [showTimeIsup, setShowTimeIsup] = useState<boolean>(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const { displayErrors } = useResponseToastHandler({});
  const { setCountdown, currentTimeFormatted, startCountdown } = useCountdown(
    0,
    () => {},
    async () => {
      /* eslint-disable */
      console.log("onEnd memberQuiz", memberQuiz);
      /* eslint-enable */

      //TODO: update quiz after questions are answered
      const response = (await closeMemberQuiz({
        slug: params?.slug as string,
        chapterId: params?.chapterId as string,
        contentId: params?.contentId as string
      })) as APIFetchResponse<AttemptQuiz> | FetchErrorType;

      if (displayErrors(response)) return;

      setShowTimeIsup(true);
      await completeContent(true);
    }
  );

  const schema = yup.object().shape({
    answer: yup.object().shape({
      question_id: yup.number().required(),
      choice_id: yup.number().required()
    })
  });
  const {
    handleSubmit,
    reset,
    control,
    getValues,
    formState: { isSubmitting, isValid, isDirty }
  } = useForm<IFormInputs>({
    defaultValues: {
      answer: undefined
    },
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (memberQuiz) {
      reset({
        questions: memberQuiz.questions
      });

      setCurrentQuestionIndex(memberQuiz.questions.findIndex((question) => !question.answer));

      const today = new Date();
      const startedTime = new Date(memberQuiz.started_at);

      const timeDifferenceInSeconds = Math.floor((new Date(today).getTime() - new Date(startedTime).getTime()) / 1000);
      const remainingTimeInSeconds = memberQuiz.quiz.duration - timeDifferenceInSeconds;

      if (remainingTimeInSeconds > 0) {
        /* eslint-disable */
        console.log("remainingTimeInSeconds", remainingTimeInSeconds);
        console.log("memberQuiz.quiz.duration", memberQuiz.quiz.duration);
        console.log("timeDifferenceInSeconds", timeDifferenceInSeconds);
        console.log("startedTime", startedTime);
        console.log("today", today);
        console.log("memberQuiz", memberQuiz);
        /* eslint-enable */

        setCountdown(remainingTimeInSeconds);
        startCountdown();
      }
    }
  }, [memberQuiz]);

  const questions = getValues("questions") ?? [];

  const currentQuestion = useMemo<Question | undefined>(
    () => questions[currentQuestionIndex],
    [memberQuiz, currentQuestionIndex, questions]
  );

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    if (!data.answer) {
      return;
    }

    const response = (await submitMemberQuizAnswer({
      slug: params?.slug as string,
      chapterId: params?.chapterId as string,
      contentId: params?.contentId as string,
      ...data.answer
    })) as APIFetchResponse<Answer>;
    if (displayErrors(response)) return;

    if (currentQuestion && response.data) {
      questions[currentQuestionIndex] = {
        ...currentQuestion,
        answer:
          memberQuiz?.quiz.show_results_at_end || !memberQuiz?.quiz.show_results
            ? ({
                choice_id: data.answer.choice_id
              } as Answer)
            : response?.data
      };

      reset({
        questions: questions,
        answer: undefined
      });
    }
  };

  const isChecked = (answer: IFormInputs["answer"], choice: Choice) => {
    if (answer) {
      return answer.choice_id == choice.id;
    }

    if (currentQuestion?.answer) {
      return currentQuestion.answer.choice_id == choice.id;
    }

    return false;
  };

  return (
    <div className="mb-10">
      {showTimeIsup ? (
        <TimeOutSection />
      ) : (
        <Card>
          <Card.Body>
            <QuizQuestion
              index={currentQuestionIndex}
              title={currentQuestion?.title ?? ""}
              questionsLength={memberQuiz?.questions.length ?? 0}
              children={currentQuestion?.choices.map((choice) => (
                <Controller
                  key={choice.id}
                  render={({ field: { onChange, value } }) => (
                    <QuizQuestionChoice
                      key={choice.id}
                      memberQuiz={memberQuiz}
                      readOnly={currentQuestion.answer !== null}
                      checked={isChecked(value, choice)}
                      choice={choice}
                      question={currentQuestion}
                      onChange={onChange}
                    />
                  )}
                  name={"answer"}
                  control={control}
                />
              ))}
            />
          </Card.Body>
          <Card.Footer>
            <div className="flex flex-col items-start justify-between lg:!flex-row lg:items-center">
              {!currentQuestion?.answer ? (
                <Button
                  type="button"
                  onPress={() => handleSubmit(onSubmit)()}
                  color="primary"
                  isDisabled={!isDirty || !isValid || isSubmitting}
                  className="w-full md:!w-auto"
                  children={t("course_player.quiz_submit_answer")}
                  isLoading={isSubmitting}
                />
              ) : (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    color="primary"
                    className="w-full md:!w-auto"
                    onPress={async () => {
                      if (questions[currentQuestionIndex + 1]) {
                        setCurrentQuestionIndex((prev) => prev + 1);

                        return;
                      }
                      await completeContent(true);
                    }}
                    children={t(
                      memberQuiz && currentQuestionIndex == memberQuiz?.questions.length - 1
                        ? "course_player:quiz_results"
                        : "course_player:quiz_next_question"
                    )}
                  />
                  {memberQuiz?.quiz.allow_question_navigation && questions[currentQuestionIndex - 1] !== undefined && (
                    <Button
                      type="button"
                      variant="outline"
                      color="primary"
                      className="w-full md:!w-auto"
                      onPress={() => {
                        if (questions[currentQuestionIndex - 1]) {
                          setCurrentQuestionIndex((prev) => prev - 1);

                          return;
                        }
                      }}
                      children={t("course_player.quiz_prev_question")}
                    />
                  )}
                </div>
              )}
              {memberQuiz && memberQuiz?.quiz?.duration > 0 && (
                <div className="mt-2 lg:mt-0">
                  <Typography.Body
                    as="span"
                    size="sm"
                    className="text-gray-700"
                  >
                    {t.rich("course_player:quiz_quiz_duration", {
                      bold: (c) => <strong className="text-black">{c}</strong>,
                      time: currentTimeFormatted
                    })}
                  </Typography.Body>
                </div>
              )}
            </div>
          </Card.Footer>
        </Card>
      )}
    </div>
  );
};

export default QuizForm;

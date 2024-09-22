"use client";

import Image from "next/image";
import { useParams } from "next/navigation";

import { useTranslations } from "next-intl";

import { useAppSelector, useResponseToastHandler } from "@/hooks";
import { attemptQuiz } from "@/server-actions/actions/content-actions";
import { APIFetchResponse, FetchErrorType, FetchReturnValue } from "@/server-actions/config/base-query";
import { CourseSliceStateType } from "@/store/slices/courses-slice";
import { AttemptQuiz, Choice, Course, Question } from "@/types";
import transWithCount from "@/utils/trans-with-count";

import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

import { Button, Card, Grid, Icon, Progress, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

const QuizResult = ({ course, memberQuiz }: { course: Course; memberQuiz: AttemptQuiz }) => {
  const t = useTranslations();
  const params = useParams<{
    slug: string;
    chapterId: string;
    contentId: string;
  }>();

  const { displayErrors } = useResponseToastHandler({});
  const retakeExam = async () => {
    const response = (await attemptQuiz({
      slug: params?.slug as string,
      chapterId: params?.chapterId as string,
      contentId: params?.contentId as string,
      data: {
        retake: true
      }
    })) as APIFetchResponse<AttemptQuiz> | FetchErrorType;

    if (displayErrors(response)) return;
  };

  const isQuestionAnsweredCorrectly = (question: Question) => {
    if (!question.answer) {
      return false;
    }

    return question.answer?.choice_id === question.answer?.correct_choice_id;
  };

  const isChoiceAnswerCorrect = (question: Question, choice: Choice) => {
    if (!memberQuiz?.completed_at && memberQuiz?.quiz.show_results_at_end) {
      return false;
    }

    if (!question.answer) {
      return false;
    }

    return question.answer.correct && question.answer.choice_id === choice.id;
  };

  const isChoiceAfterAnswerCorrect = (question: Question, choice: Choice) => {
    if (!memberQuiz?.completed_at && memberQuiz?.quiz.show_results_at_end) {
      return false;
    }
    if (!question.answer && choice.credited) {
      return true;
    }
    if (!question.answer) {
      return false;
    }

    return question.answer.correct_choice_id === choice.id;
  };

  const isChoiceIncorrect = (question: Question, choice: Choice) => {
    if (!memberQuiz?.completed_at && memberQuiz?.quiz.show_results_at_end) {
      return false;
    }
    if (!question.answer) {
      return false;
    }

    return !question.answer.correct && question.answer.choice_id === choice.id;
  };
  const { content } = useAppSelector<CourseSliceStateType>((state) => state.courses);

  if (!memberQuiz?.quiz.show_results) {
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
                children={t("course_player.quiz_submitted_message")}
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
  }

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          {memberQuiz?.quiz.passing_score ? (
            <div className="flex items-center gap-4">
              <Progress.Ring
                color={memberQuiz?.passed ? "success" : "danger"}
                value={memberQuiz?.percent_correct ?? 0}
                size={60}
              />
              <Typography.Body
                as="span"
                size="base"
                className={cn("font-medium", memberQuiz?.passed ? "text-success" : "text-danger")}
                children={t(
                  memberQuiz?.passed ? "course_player:quiz_passed_message" : "course_player:quiz_failed_message"
                )}
              />
            </div>
          ) : null}
          <Grid
            columns={{
              lg: memberQuiz?.quiz.passing_score ? 4 : 3,
              md: 2,
              sm: 2,
              xs: 2
            }}
            className="mt-5"
          >
            {memberQuiz?.quiz.passing_score ? (
              <Grid.Cell>
                <div className="flex flex-col gap-2">
                  <Typography.Body
                    as="span"
                    size="md"
                    className="font-normal text-gray-700"
                    children={t("course_player.quiz_passing_score")}
                  />
                  <Typography.Body
                    as="span"
                    size="base"
                    className="font-medium text-success"
                    children={`${memberQuiz?.quiz.passing_score}%`}
                  />
                </div>
              </Grid.Cell>
            ) : null}
            <Grid.Cell>
              <div className="flex flex-col gap-2">
                <Typography.Body
                  as="span"
                  size="md"
                  className="font-normal text-gray-700"
                  children={t("course_player.quiz_total_questions_count")}
                />
                <Typography.Body
                  as="span"
                  size="base"
                  className="font-medium"
                  children={t(transWithCount("course_player.quiz_questions_WithCount", memberQuiz?.questions.length), {
                    count: memberQuiz?.questions.length
                  })}
                />
              </div>
            </Grid.Cell>
            <Grid.Cell>
              <div className="flex flex-col gap-2">
                <Typography.Body
                  as="span"
                  size="md"
                  className="font-normal text-gray-700"
                  children={t("course_player.quiz_correct_questions_count")}
                />
                <Typography.Body
                  as="span"
                  size="base"
                  className={cn(
                    "font-medium",
                    memberQuiz && memberQuiz?.correct_answers > 0 ? "text-success" : "text-gray-950"
                  )}
                  children={t(transWithCount("course_player.quiz_questions_WithCount", memberQuiz?.correct_answers), {
                    count: memberQuiz?.correct_answers
                  })}
                />
              </div>
            </Grid.Cell>
            <Grid.Cell>
              <div className="flex flex-col gap-2">
                <Typography.Body
                  as="span"
                  size="md"
                  className="font-normal text-gray-700"
                  children={t("course_player.quiz_wrong_questions_count")}
                />
                <Typography.Body
                  as="span"
                  size="base"
                  className={cn(
                    "font-medium",
                    memberQuiz && memberQuiz?.questions.length - memberQuiz?.correct_answers > 0
                      ? "text-danger"
                      : "text-gray-950"
                  )}
                  children={t(
                    transWithCount(
                      "course_player.quiz_questions_WithCount",
                      memberQuiz && memberQuiz?.questions.length - memberQuiz?.correct_answers
                    ),
                    {
                      count: memberQuiz && memberQuiz?.questions.length - memberQuiz?.correct_answers
                    }
                  )}
                />
              </div>
            </Grid.Cell>
          </Grid>
        </Card.Body>
        {course?.settings.can_retake_exam && (
          <Card.Footer>
            <Button
              variant="solid"
              color="primary"
              children={t("course_player.quiz_retake")}
              onPress={retakeExam}
            />
          </Card.Footer>
        )}
      </Card>
      <Card className="mb-20">
        <Card.Body>
          <Typography.Body
            size="lg"
            className="mb-3 block font-bold"
            children={t("course_player.quiz_answers")}
          />

          <div className="flex flex-col space-y-5">
            {memberQuiz?.questions.map((question, i) => (
              <div
                key={i}
                className="flex flex-col space-y-4 rounded-2xl bg-gray-100 p-4"
              >
                <div className="flex flex-col space-y-2">
                  <div className="flex gap-2">
                    {isQuestionAnsweredCorrectly(question) ? (
                      <Icon
                        size="md"
                        color="success"
                      >
                        <CheckCircleIcon />
                      </Icon>
                    ) : (
                      <Icon
                        size="md"
                        color="danger"
                      >
                        <XCircleIcon />
                      </Icon>
                    )}

                    <Typography.Body
                      as="span"
                      size="md"
                      className="font-normal text-gray-700"
                      children={t.rich("course_player:quiz_question", {
                        span: (c) => <span className="text-black">{c}</span>,
                        number: memberQuiz?.questions.length ?? 0,
                        question: i + 1
                      })}
                    />
                    {!question.answer && (
                      <Typography.Body
                        as="span"
                        size="sm"
                        className="font-bold text-danger"
                        children={t("course_player.quiz_question_skipped")}
                      />
                    )}
                  </div>
                  <span
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: question?.title }}
                  />
                </div>
                <div className="flex flex-col space-y-4">
                  {question?.choices.map((choice) => (
                    <div
                      key={choice.id}
                      className={cn(
                        "rounded-lg border border-transparent bg-white p-4",
                        isChoiceAnswerCorrect(question, choice) &&
                          isChoiceAfterAnswerCorrect(question, choice) &&
                          "border-success bg-success-50",
                        isChoiceIncorrect(question, choice) && "border-danger bg-danger-50"
                      )}
                    >
                      <span
                        className="prose"
                        dangerouslySetInnerHTML={{ __html: choice.content }}
                      />
                      {isChoiceAfterAnswerCorrect(question, choice) && (
                        <div className="flex items-start gap-1">
                          <div className="flex items-center gap-1">
                            <Icon
                              size="sm"
                              className="text-success"
                            >
                              <CheckCircleIcon />
                            </Icon>
                            <Typography.Body
                              as="span"
                              size="sm"
                              className="whitespace-nowrap font-normal text-success"
                              children={
                                isChoiceAnswerCorrect(question, choice)
                                  ? t("course_player.quiz_student_answer_correct")
                                  : t("course_player.quiz_question_answer_correct")
                              }
                            />
                          </div>
                          {(question?.answer?.explanation || (!question.answer && choice.credited)) && (
                            <>
                              {"-"}
                              <Typography.Body
                                as="span"
                                size="sm"
                                className="font-bold text-success"
                                children={question?.answer?.explanation || choice.explanation}
                              />
                            </>
                          )}
                        </div>
                      )}
                      {isChoiceIncorrect(question, choice) && (
                        <div className="flex items-start gap-1">
                          <div className="flex items-center gap-1">
                            <Icon
                              size="sm"
                              className="text-danger"
                            >
                              <XCircleIcon />
                            </Icon>
                            <Typography.Body
                              as="span"
                              size="sm"
                              className="whitespace-nowrap font-normal text-danger"
                              children={t("course_player.quiz_student_answer_wrong")}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default QuizResult;

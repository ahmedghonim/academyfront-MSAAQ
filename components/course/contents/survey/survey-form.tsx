"use client";

import { useEffect, useMemo, useState } from "react";

import { useParams } from "next/navigation";

import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

import { useResponseToastHandler } from "@/hooks";
import useCompleteContent from "@/hooks/use-complete-content";
import { submitMemberSurveyAnswer } from "@/server-actions/actions/content-actions";
import { APIFetchResponse, FetchErrorType } from "@/server-actions/config/base-query";
import { hasData } from "@/server-actions/config/error-handler";
import { Answer } from "@/types/modals/answer";
import { AttemptSurvey } from "@/types/modals/attemptSurvey";
import { Choice, Question } from "@/types/modals/survey";

import { Button, Card } from "@msaaqcom/abjad";

import SurveyQuestion from "./survey-question";
import SurveyQuestionChoice from "./survey-question-choice";

interface IFormInputs {
  questions: Question[];
  answer:
    | {
        question_id: number;
        choice_id: number;
      }
    | undefined;
}

const SurveyForm = ({ memberSurvey }: { memberSurvey: AttemptSurvey }) => {
  const t = useTranslations();

  const params = useParams<{
    slug: string;
    chapterId: string;
    contentId: string;
  }>();

  // const [submitQuizAnswer] = useSubmitMemberSurveyAnswerMutation();
  const [completeContent] = useCompleteContent();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const { displayErrors } = useResponseToastHandler({});

  const schema = yup.object().shape({
    answer: yup.object().shape({
      question_id: yup.number().required(),
      choice_id: yup.number().required()
    })
  });

  const {
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    getValues,
    formState: { isSubmitting }
  } = useForm<IFormInputs>({
    defaultValues: {
      answer: undefined
    },
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    if (memberSurvey) {
      reset({
        questions: memberSurvey.questions
      });

      setCurrentQuestionIndex(memberSurvey.questions.findIndex((question) => !question.answer));
    }
  }, [memberSurvey]);

  const questions = getValues("questions") ?? [];

  const currentQuestion = useMemo<Question | undefined>(
    () => questions[currentQuestionIndex],
    [memberSurvey, currentQuestionIndex, questions]
  );

  useEffect(() => {
    if (currentQuestion && currentQuestion.answer) {
      setValue("answer", {
        question_id: currentQuestion.id,
        choice_id: currentQuestion.answer?.choice_id
      });
    } else {
      setValue("answer", undefined);
    }
  }, [currentQuestionIndex]);

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    if (!data.answer) {
      return;
    }

    const response = (await submitMemberSurveyAnswer({
      slug: params?.slug as string,
      chapterId: params?.chapterId as string,
      contentId: params?.contentId as string,
      ...data.answer
    })) as APIFetchResponse<Answer> | FetchErrorType;

    if (displayErrors(response)) return;

    if (currentQuestion && hasData(response)) {
      questions[currentQuestionIndex] = {
        ...currentQuestion,
        answer: response.data
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
      <Card>
        <Card.Body>
          <SurveyQuestion
            index={currentQuestionIndex}
            title={currentQuestion?.title ?? ""}
            explanation={currentQuestion?.explanation ?? ""}
            questionsLength={memberSurvey?.questions.length ?? 0}
            children={currentQuestion?.choices.map((choice) => (
              <Controller
                key={choice.id}
                render={({ field: { onChange, value } }) => (
                  <SurveyQuestionChoice
                    key={choice.id}
                    memberSurvey={memberSurvey}
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
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                type="button"
                color="primary"
                isDisabled={isSubmitting || watch("answer") === undefined}
                className="w-full md:!w-auto"
                onPress={async () => {
                  if (memberSurvey) {
                    const isLastQuestion = currentQuestionIndex == memberSurvey.questions.length - 1;

                    if (!currentQuestion?.answer) {
                      await handleSubmit(onSubmit)();
                    }
                    if (isLastQuestion) {
                      await completeContent(true);

                      return;
                    }
                  }
                  if (questions[currentQuestionIndex + 1]) {
                    setCurrentQuestionIndex((prev) => prev + 1);

                    return;
                  }
                }}
                children={t(
                  memberSurvey && currentQuestionIndex == memberSurvey?.questions.length - 1
                    ? "course_player:survey_results"
                    : "course_player:survey_next_question"
                )}
              />
              {questions[currentQuestionIndex - 1] !== undefined && (
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
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default SurveyForm;

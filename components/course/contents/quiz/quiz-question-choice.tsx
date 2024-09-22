"use client";

import { useTranslations } from "next-intl";

import { AttemptQuiz, Choice, Question } from "@/types";

import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

import { Form, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface Props {
  choice: Choice;
  question: Question;
  onChange?: (answer: { question_id: string | number; choice_id: string | number }) => void;
  checked: boolean;
  readOnly?: boolean;
  memberQuiz?: AttemptQuiz;
}

const QuizQuestionChoice = ({ choice, question, onChange, checked, readOnly, memberQuiz }: Props) => {
  const t = useTranslations();

  const isChoiceAnswerCorrect = (question: Question, choice: Choice) => {
    if ((!memberQuiz?.completed_at && memberQuiz?.quiz.show_results_at_end) || !memberQuiz?.quiz.show_results) {
      return false;
    }

    if (!question.answer) {
      return false;
    }

    return question.answer.correct && question.answer.choice_id === choice.id;
  };

  const isChoiceAfterAnswerCorrect = (question: Question, choice: Choice) => {
    if ((!memberQuiz?.completed_at && memberQuiz?.quiz.show_results_at_end) || !memberQuiz?.quiz.show_results) {
      return false;
    }
    if (!question.answer) {
      return false;
    }

    return question.answer.correct_choice_id === choice.id;
  };

  const isChoiceIncorrect = (question: Question, choice: Choice) => {
    if ((!memberQuiz?.completed_at && memberQuiz?.quiz.show_results_at_end) || !memberQuiz?.quiz.show_results) {
      return false;
    }
    if (!question.answer) {
      return false;
    }

    return !question.answer.correct && question.answer.choice_id === choice.id;
  };

  return (
    <label
      htmlFor={`choice-${choice.id}`}
      className={cn(
        "w-full rounded-lg border p-4 transition-colors",
        "flex flex-col gap-4",
        checked ? "border-primary bg-primary-50" : "border-gray",
        (isChoiceAnswerCorrect(question, choice) || isChoiceAfterAnswerCorrect(question, choice)) &&
          "border-success bg-success-50",
        isChoiceIncorrect(question, choice) && "border-danger bg-danger-50"
      )}
    >
      <Form.Radio
        id={`choice-${choice.id}`}
        name={`question-${question.id}-choice`}
        description={
          <span
            className="prose prose-sm prose-stone sm:prose-base max-w-full"
            dir="auto"
            dangerouslySetInnerHTML={{ __html: choice.content }}
          />
        }
        classNames={{
          description: cn(checked ? "!text-black" : "text-gray-700", "font-medium")
        }}
        checked={checked}
        readOnly={readOnly}
        onChange={() => {
          onChange &&
            onChange({
              question_id: question.id,
              choice_id: choice.id
            });
        }}
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
          {question?.answer?.explanation && (
            <>
              {"-"}
              <Typography.Body
                as="span"
                size="sm"
                className="font-bold text-success"
                children={question?.answer?.explanation}
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
    </label>
  );
};

export default QuizQuestionChoice;

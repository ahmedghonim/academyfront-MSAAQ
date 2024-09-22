"use client";

import { Choice, Question } from "@/types";
import { AttemptSurvey } from "@/types/modals/attemptSurvey";

import { Form } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface Props {
  choice: Choice;
  question: Question;
  onChange?: (answer: { question_id: string | number; choice_id: string | number }) => void;
  checked: boolean;
  readOnly?: boolean;
  memberSurvey?: AttemptSurvey;
}

const SurveyQuestionChoice = ({ choice, question, onChange, checked, readOnly, memberSurvey }: Props) => {
  return (
    <label
      htmlFor={`choice-${choice.id}`}
      className={cn(
        "w-full rounded-lg border p-4 transition-colors",
        "flex flex-col gap-4",
        checked ? "border-primary bg-primary-50" : "border-gray"
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
    </label>
  );
};

export default SurveyQuestionChoice;

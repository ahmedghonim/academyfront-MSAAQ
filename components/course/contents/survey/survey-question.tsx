"use client";

import { ReactNode } from "react";

import { useTranslations } from "next-intl";

import { Typography } from "@msaaqcom/abjad";

interface Props {
  questionsLength: number;
  title: string;
  index: number;
  children: ReactNode;
  explanation?: string;
}

const SurveyQuestion = ({ title, explanation, questionsLength, index = 0, children }: Props) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <Typography.Body
          as="span"
          size="md"
          className="font-normal text-gray-700"
          children={t.rich("course_player:quiz_question", {
            span: (c) => <span className="text-black">{c}</span>,
            number: questionsLength ?? 0,
            question: index + 1
          })}
        />
        <span
          className="prose prose-sm prose-stone sm:prose-base max-w-full"
          dir="auto"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {explanation && <span className="!my-1 text-sm text-gray-700">{explanation}</span>}
      </div>
      <div className="flex flex-col space-y-4">{children}</div>
    </div>
  );
};

export default SurveyQuestion;

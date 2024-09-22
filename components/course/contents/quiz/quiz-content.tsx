"use client";

import { AttemptQuiz, Content, Course, Quiz } from "@/types";

import QuizInformation from "./quiz-information";
import QuizStatus from "./quiz-status";

interface Props {
  content: Content<Quiz>;
  course: Course;
  memberQuiz: AttemptQuiz;
}

const QuizContent = ({ content, course, memberQuiz }: Props) => {
  //TODO: mark quiz as completed after submit ui
  if (!content.contentable.attempted) {
    return (
      <QuizInformation
        memberQuiz={memberQuiz}
        course={course}
        content={content}
      />
    );
  }

  return (
    <QuizStatus
      course={course}
      memberQuiz={memberQuiz}
    />
  );
};

export default QuizContent;

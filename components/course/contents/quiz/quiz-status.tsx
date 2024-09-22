"use client";

import { LoadingScreen } from "@/components/loading-screen";
import { AttemptQuiz, Course } from "@/types";

import QuizForm from "./quiz-form";
import QuizResult from "./quiz-result";

const QuizStatus = ({ course, memberQuiz }: { course: Course; memberQuiz: AttemptQuiz }) => {
  if (!memberQuiz) return <LoadingScreen />;
  if (memberQuiz.completed_at)
    return (
      <QuizResult
        memberQuiz={memberQuiz}
        course={course}
      />
    );

  return <QuizForm memberQuiz={memberQuiz} />;
};

export default QuizStatus;

import { Question, Quiz } from "./quiz";

export type AttemptQuiz = {
  id: number;
  completed_questions: number;
  correct_answers: number;
  percent_correct: number;
  passed: boolean;
  started_at: string;
  completed_at: string;
  questions: Question[];
  quiz: Quiz;
};

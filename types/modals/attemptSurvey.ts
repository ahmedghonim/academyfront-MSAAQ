import { Question, Survey } from "./survey";

export type AttemptSurvey = {
  id: number;
  completed_questions: number;
  correct_answers: number;
  percent_correct: number;
  passed: boolean;
  started_at: string;
  completed_at: string;
  questions: Question[];
  survey: Survey;
};

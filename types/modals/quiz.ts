import { Answer } from "./answer";

export type Quiz = {
  id: number;
  title: string;
  duration: number;
  attempted: boolean;
  questions_count: number;
  passing_score: number;
  questions: Question[];
  show_results_at_end: boolean;
  show_results: boolean;
  allow_question_navigation: boolean;
};

export type Question = {
  id: number;
  title: string;
  answer: Answer | null;
  choices: Choice[];
};

export type Choice = {
  id: number;
  content: string;
  credited: boolean;
  explanation: string;
};

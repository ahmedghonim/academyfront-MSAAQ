import { Answer } from "./answer";

export type Survey = {
  id: number;
  questions: Question[];
  attempted: boolean;
  duration: number;
  questions_count: number;
  title: string;
};

export type Question = {
  id: number;
  title: string;
  answer: Answer | null;
  choices: Choice[];
  explanation: string;
};

export type Choice = {
  id: number;
  content: string;
  credited: boolean;
  explanation: string;
};

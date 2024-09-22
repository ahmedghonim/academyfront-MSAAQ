"use client";

import { LoadingScreen } from "@/components/loading-screen";
import { Course } from "@/types";
import { AttemptSurvey } from "@/types/modals/attemptSurvey";

import SurveyForm from "./survey-form";
import SurveyResult from "./survey-result";

const SurveyStatus = ({ memberSurvey, course }: { memberSurvey: AttemptSurvey; course: Course }) => {
  if (!memberSurvey) return <LoadingScreen />;
  if (memberSurvey.completed_at) return <SurveyResult />;

  return <SurveyForm memberSurvey={memberSurvey} />;
};

export default SurveyStatus;

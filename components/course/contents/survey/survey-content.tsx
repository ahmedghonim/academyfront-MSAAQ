"use client";

import { Content, Course } from "@/types";
import { AttemptSurvey } from "@/types/modals/attemptSurvey";
import { Survey } from "@/types/modals/survey";

import SurveyInformation from "./survey-information";
import SurveyStatus from "./survey-status";

interface Props {
  content: Content<Survey>;
  course: Course;
  memberSurvey: AttemptSurvey;
}

const SurveyContent = ({ content, course, memberSurvey }: Props) => {
  if (!content.contentable.attempted) {
    return (
      <SurveyInformation
        content={content}
        course={course}
        // memberSurvey={memberSurvey}
      />
    );
  }

  return (
    <SurveyStatus
      memberSurvey={memberSurvey}
      course={course}
    />
  );
};

export default SurveyContent;

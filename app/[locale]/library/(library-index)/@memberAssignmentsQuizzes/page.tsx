import React from "react";

import {
  fetchMemberAssignments,
  fetchMemberQuizzes,
  fetchMemberRejectedAssignments
} from "@/server-actions/services/member-service";

import MemberAssignmentsQuizzes from "./member-assignments-quizzes";

export default async function Page() {
  const [quizzes, rejectedAssignments, assignments] = await Promise.all([
    fetchMemberQuizzes({ limit: 3 }),
    fetchMemberRejectedAssignments({ limit: 3 }).then(({ data }) => data),
    fetchMemberAssignments({ limit: 3 })
  ]);

  return (
    <MemberAssignmentsQuizzes
      quizzes={quizzes}
      quizzesFilters={{
        limit: 3
      }}
      rejectedAssignments={rejectedAssignments}
      assignments={assignments}
      assignmentsFilters={{
        limit: 3
      }}
    />
  );
}

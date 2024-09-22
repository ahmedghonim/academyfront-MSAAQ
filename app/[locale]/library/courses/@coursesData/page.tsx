import React from "react";

import { fetchMemberCourses } from "@/server-actions/services/member-service";

import CoursesListing from "./courses-listing";

export default async function Page() {
  const courses = await fetchMemberCourses({
    limit: 3
  });

  return (
    <CoursesListing
      initialData={courses}
      initialFilters={{
        limit: 3
      }}
    />
  );
}

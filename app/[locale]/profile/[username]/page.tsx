import React from "react";

import { notFound } from "next/navigation";

import { fetchInstructor } from "@/server-actions/services/instructor-service";
import { AnyObject } from "@/types";

import MentorBreadcrumbs from "./breadcrumbs";
import MentorCard from "./mentor-card";

export default async function Page({ params }: { params: AnyObject }) {
  const mentor = await fetchInstructor({ id: params.username });

  if (!mentor) {
    notFound();
  }

  return (
    <>
      <MentorBreadcrumbs title={mentor.name} />
      <MentorCard
        totalCourses={10}
        mentor={mentor}
      />
    </>
  );
}

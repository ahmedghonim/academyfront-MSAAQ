import React from "react";

import { fetchMemberAppointments } from "@/server-actions/services/member-service";

import CoachingSessionsListing from "./coaching-sessions-listing";

export default async function Page({ searchParams }: { searchParams: { filter?: "past" | "upcoming" } }) {
  const filters = {
    limit: 3,
    ...searchParams
  };
  const certificates = await fetchMemberAppointments(filters);

  return (
    <CoachingSessionsListing
      initialData={certificates}
      initialFilters={filters}
    />
  );
}

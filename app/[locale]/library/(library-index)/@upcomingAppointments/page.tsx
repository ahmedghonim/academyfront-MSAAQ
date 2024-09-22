import React from "react";

import { fetchMemberUpcomingAppointments } from "@/server-actions/services/member-service";

import UpcomingAppointments from "./upcoming-appointments";

export default async function Page() {
  const { data } = await fetchMemberUpcomingAppointments();

  return <UpcomingAppointments upcomingAppointments={data} />;
}

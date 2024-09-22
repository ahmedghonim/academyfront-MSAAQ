import React from "react";

import { fetchMemberStats } from "@/server-actions/services/member-service";

import MemberStats from "./member-stats";

export default async function Page() {
  const memberStats = await fetchMemberStats();

  return <MemberStats memberStats={memberStats} />;
}

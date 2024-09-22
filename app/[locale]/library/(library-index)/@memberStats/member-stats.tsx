"use client";

import React from "react";

import { useTranslations } from "next-intl";

import { MemberStatsCard } from "@/components/library";

import { Grid, Typography } from "@msaaqcom/abjad";
import {
  AudioBook01Icon,
  Certificate01Icon,
  Clock05Icon,
  DocumentValidation01Icon,
  HourglassIcon,
  StartUp02Icon
} from "@msaaqcom/hugeicons/rounded/stroke";

const MemberStats = ({
  memberStats
}: {
  memberStats: {
    todo_courses: number;
    in_progress_courses: number;
    completed_courses: number;
    watched_videos_duration: number;
    accepted_assignments: number;
    eligible_certificates: number;
  };
}) => {
  const t = useTranslations();

  return (
    <div className="mb-6 flex flex-col space-y-4">
      <Typography.Title
        size="sm"
        className="font-semibold"
      >
        {t("library.stats")}
      </Typography.Title>
      <Grid
        columns={{
          md: 3,
          sm: 2,
          xs: 1
        }}
        gap={{
          xs: "1rem",
          sm: "1rem",
          md: "1rem",
          lg: "1rem",
          xl: "1rem"
        }}
        className="grid-flow-row-dense"
      >
        <Grid.Cell>
          <MemberStatsCard
            variant={"success"}
            title={t("library.completed_courses")}
            amount={memberStats?.completed_courses}
            icon={<AudioBook01Icon className="h-6 w-6 text-success" />}
          />
        </Grid.Cell>
        <Grid.Cell>
          <MemberStatsCard
            variant={"orange"}
            title={t("library.in_progress_courses")}
            amount={memberStats?.in_progress_courses}
            icon={<HourglassIcon className="h-6 w-6 text-orange" />}
          />
        </Grid.Cell>
        <Grid.Cell>
          <MemberStatsCard
            variant={"black"}
            title={t("library.todo_courses")}
            amount={memberStats?.todo_courses}
            icon={<StartUp02Icon className="h-6 w-6 text-black" />}
          />
        </Grid.Cell>
        <Grid.Cell>
          <MemberStatsCard
            variant={"gray"}
            title={t("library.learned_duration")}
            amount={(memberStats?.watched_videos_duration / 60).toFixed(2)}
            icon={<Clock05Icon className="h-6 w-6 text-black" />}
          />
        </Grid.Cell>
        <Grid.Cell>
          <MemberStatsCard
            variant={"gray"}
            title={t("library.accepted_assignments")}
            amount={memberStats?.accepted_assignments}
            icon={<DocumentValidation01Icon className="h-6 w-6 text-black" />}
          />
        </Grid.Cell>
        <Grid.Cell>
          <MemberStatsCard
            variant={"gray"}
            title={t("library.eligible_certificates")}
            amount={memberStats?.eligible_certificates}
            icon={<Certificate01Icon className="h-6 w-6 text-black" />}
          />
        </Grid.Cell>
      </Grid>
    </div>
  );
};

export default MemberStats;

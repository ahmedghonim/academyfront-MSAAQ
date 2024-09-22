"use client";

import { LoadingCard } from "@/components/loading-card";

import { Grid } from "@msaaqcom/abjad";

export default function Loading() {
  return (
    <Grid
      columns={{
        lg: 12,
        xl: 12,
        md: 12
      }}
      gap={{
        xs: "1rem",
        sm: "1rem",
        md: "1rem",
        lg: "1rem",
        xl: "1rem"
      }}
    >
      {Array.from({ length: 3 }, (_, index) => (
        <Grid.Cell
          key={index}
          columnSpan={{
            lg: 4,
            md: 6
          }}
          className="h-full"
        >
          <LoadingCard />
        </Grid.Cell>
      ))}
    </Grid>
  );
}

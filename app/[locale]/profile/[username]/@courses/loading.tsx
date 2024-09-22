"use client";

import { LoadingCard } from "@/components/loading-card";
import { useMediaQuery } from "@/hooks";
import { BREAKPOINTS } from "@/types";

import { Card, Grid } from "@msaaqcom/abjad";

export default function Loading() {
  const isMD = useMediaQuery(BREAKPOINTS.md);

  return (
    <Card className="courses-section-card h-full border-0 bg-gray-100">
      <Card.Body className="courses-section-card-body flex flex-col space-y-6 p-6">
        <Grid
          columns={{
            md: 3,
            sm: 1
          }}
          gap={{
            xs: "1rem",
            sm: "1rem",
            md: "1rem",
            lg: "1rem",
            xl: "1rem"
          }}
        >
          {Array.from({ length: isMD ? 3 : 1 }, (_, index) => (
            <Grid.Cell key={index}>
              <LoadingCard key={index} />
            </Grid.Cell>
          ))}
        </Grid>
      </Card.Body>
    </Card>
  );
}

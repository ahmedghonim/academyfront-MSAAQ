"use client";

import React from "react";

import { Card, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface StatsCardProps {
  variant: "gray" | "orange" | "success" | "black";
  title: string;
  amount: string | number;
  icon: React.ReactNode;
}

const colors = {
  gray: "bg-gray-100",
  orange: "bg-orange",
  success: "bg-success",
  black: "bg-black"
};
const textColors = {
  gray: "text-black",
  orange: "text-white",
  success: "text-white",
  black: "text-white"
};

const MemberStatsCard = ({ title, amount, icon, variant }: StatsCardProps) => {
  const color = colors[variant];
  const textColor = textColors[variant];

  return (
    <Card className={cn("h-full border-0", color)}>
      <Card.Body className="flex items-center">
        <div className="rounded-full bg-white p-5">{icon}</div>
        <div className="ms-4 flex flex-col">
          <Typography.Body
            size="md"
            className={cn("font-medium", textColor)}
          >
            {title}
          </Typography.Body>
          <Typography.Title
            size="lg"
            className={cn("font-bold", textColor)}
          >
            {amount}
          </Typography.Title>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MemberStatsCard;

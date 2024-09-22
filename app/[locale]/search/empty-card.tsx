"use client";

import EmptyStateImage from "@/public/images/empty-state-image.svg";

import { Card, Typography } from "@msaaqcom/abjad";

const EmptyCard = ({ title }: { title: string }) => {
  return (
    <Card className="bg-gray-100">
      <Card.Body className="flex flex-col items-center justify-center space-y-8 p-8">
        <EmptyStateImage className="h-56 w-56 text-primary md:!h-64 md:!w-64 lg:!h-80 lg:!w-80" />
        <Typography.Title
          as="p"
          size="lg"
          className="font-semibold"
        >
          {title}
        </Typography.Title>
      </Card.Body>
    </Card>
  );
};

export default EmptyCard;

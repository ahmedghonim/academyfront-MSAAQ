"use client";

import { ReactNode } from "react";

import { DocumentIcon } from "@heroicons/react/24/outline";

import { Card, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface Props {
  title: string;
  className?: string;
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
  children?: ReactNode;
}

const FileItem = ({ title, className, color, children }: Props) => {
  return (
    <Card className={cn("rounded-xl bg-gray-100", className)}>
      <Card.Body className="flex flex-col items-start justify-between gap-3 md:mb-0 md:!flex-row md:!items-center">
        <div className="flex w-full items-center justify-start gap-3">
          <Icon
            color="gray"
            rounded="full"
            size="sm"
            variant="soft"
          >
            <DocumentIcon />
          </Icon>
          <Typography.Text
            as="h6"
            size="xs"
            className={cn(`text-${color ?? "black"}`, "truncate")}
            children={title}
          />
        </div>
        {children}
      </Card.Body>
    </Card>
  );
};

export default FileItem;

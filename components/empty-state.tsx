"use client";

import { ReactNode } from "react";

import { Card, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface Props {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  color?: "gray" | "primary" | "secondary" | "warning" | "success" | "danger" | "info";
  actions?: ReactNode;
  bordered?: boolean;
  variant?: "solid" | "soft" | "outline" | "transparent" | undefined;
  className?: string;
  iconClassName?: string;
}

const EmptyState = ({
  title,
  description,
  icon,
  actions,
  color = "gray",
  bordered = false,
  variant = "transparent",
  className,
  iconClassName
}: Props) => {
  return (
    <Card className={cn(!bordered && "border-0", className)}>
      <Card.Body className="flex flex-col items-center gap-4">
        {icon && (
          <Icon
            color={color}
            rounded="base"
            size="xl"
            variant={variant}
            className={iconClassName}
          >
            {icon}
          </Icon>
        )}
        <div className="flex flex-col items-center gap-2 text-center">
          <Typography.Body
            as="h3"
            size="lg"
            children={title}
            className="font-bold"
          />
          {description && (
            <Typography.Body
              as="p"
              className="font-normal text-gray-800"
              size="md"
              children={description}
            />
          )}
        </div>
        {actions}
      </Card.Body>
    </Card>
  );
};

export default EmptyState;

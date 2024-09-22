"use client";

import { ReactNode } from "react";

import { Card, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

type ProductCardElementProps = {
  title?: string | null;
  icon?: ReactNode;
  children: ReactNode;
  align?: "default" | "center";
  vertical?: boolean;
  hasDivider?: boolean;
  dividerPosition?: "top" | "bottom";
  className?: string;
};
const ProductSectionCard = ({
  align = "default",
  title,
  icon,
  children,
  vertical,
  hasDivider,
  dividerPosition = "bottom",
  className
}: ProductCardElementProps) => {
  return (
    <div className="flex h-full flex-col">
      {dividerPosition == "top" && hasDivider && <div className="mb-8 h-px bg-gray-400" />}
      <Card className="h-full border-0 bg-gray-100">
        <Card.Body className={cn("p-6", className)}>
          <div
            className={cn(
              "mb-4 flex items-start gap-x-4 gap-y-6",
              align === "center" && "items-center justify-center",
              vertical ? "flex-col" : "flex-row"
            )}
          >
            {icon && (
              <Icon
                size="md"
                className="p-4"
                variant="solid"
                color="gray"
                rounded="full"
                children={icon}
              />
            )}
            {title && (
              <Typography.Title
                as="h2"
                size="lg"
                className="font-medium"
                children={title}
              />
            )}
          </div>
          {children}
        </Card.Body>
      </Card>
      {dividerPosition == "bottom" && hasDivider && <div className="mt-8 h-px bg-gray-400" />}
    </div>
  );
};

export default ProductSectionCard;

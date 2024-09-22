"use client";

import { ReactNode, useState } from "react";

import { StarIcon } from "@heroicons/react/24/solid";

import { Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface Props {
  color?: "gray" | "primary" | "secondary" | "warning" | "success" | "danger" | "info" | "inherit";
  onChange?: (_: number) => void;
  value?: number;
  isReadOnly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  label?: string;
  children?: ReactNode;
}

const StarsRating = ({
  color = "secondary",
  onChange,
  value = 0,
  isReadOnly,
  size = "xl",
  label,
  className,
  children
}: Props) => {
  const [stars, setStars] = useState<number>(0);
  const onStarsHover = (i?: number) => {
    setStars(i != null ? i + 1 : 0);
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {label && (
        <Typography.Body
          size="md"
          children={label}
          className={cn(`text-${color}`)}
        />
      )}
      <div className="flex items-center">
        {[...new Array(5)].map((_, i) => (
          <Icon
            key={i}
            size={size}
            className={cn(stars > i || value > i ? `text-${color}` : "text-gray-400")}
            {...(isReadOnly
              ? {}
              : {
                  onClick: () => {
                    onChange?.(i + 1);
                  },
                  onMouseEnter: () => {
                    onStarsHover(i);
                  },
                  onMouseLeave: () => {
                    onStarsHover();
                  }
                })}
          >
            <StarIcon />
          </Icon>
        ))}
      </div>
      {children}
    </div>
  );
};

export default StarsRating;

"use client";

import { FC, HTMLAttributes, ReactElement, ReactNode } from "react";

import EmptyDataIcon from "@/components/empty-data-icon";

import { Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  content?: string;
  className?: string;
  action?: ReactNode;
  icon?: ReactElement;
}

const TableEmptyState: FC<EmptyStateProps> = ({ title, content, className, children, icon, ...props }) => {
  return (
    <div
      className={cn("m-auto flex flex-col items-center justify-center space-y-6 py-10", className)}
      {...props}
    >
      {icon && (
        <div className="flex flex-col items-center justify-center">
          {icon?.type === Icon ? (
            icon
          ) : (
            <>
              <EmptyDataIcon />
              <Icon
                size="md"
                className="-mt-6 ml-2"
                children={icon}
              />
            </>
          )}
        </div>
      )}

      <div className="flex flex-col text-center">
        {title && (
          <Typography.Body
            as="p"
            size="base"
            className="mb-2 font-semibold"
            children={title}
          />
        )}

        {content && (
          <Typography.Body
            as="p"
            size="md"
            children={content}
            style={{ maxWidth: "450px" }}
            className="font-normal text-gray-800"
          />
        )}
      </div>

      {children}
    </div>
  );
};

export default TableEmptyState;

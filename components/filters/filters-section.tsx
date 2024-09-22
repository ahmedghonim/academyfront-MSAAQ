"use client";

import { ReactNode } from "react";

import { ChevronUpIcon } from "@heroicons/react/24/solid";

import { Collapse, Icon, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface Props {
  title: string;
  children: ReactNode;
  className?: string;
}
const FiltersSection = ({ title, children, className }: Props) => {
  return (
    <Collapse
      defaultOpen={true}
      className={cn("mb-4 rounded-none border-b border-gray-400 pb-4 last:mb-0 last:border-0", className)}
    >
      {({ isOpen }) => (
        <>
          <Collapse.Button className="!p-0">
            <div className="flex flex-grow flex-row items-center justify-between">
              <div className="flex items-center">
                <div className="flex flex-col items-start">
                  <Typography.Text
                    size="sm"
                    className="line-clamp-1 font-bold"
                    children={title}
                  />
                </div>
              </div>
              <Icon
                size="sm"
                variant="soft"
                color="gray"
              >
                <ChevronUpIcon
                  className={cn("transition-all duration-300 ease-in-out", !isOpen ? "rotate-180 transform" : "")}
                />
              </Icon>
            </div>
          </Collapse.Button>
          <Collapse.Content className="mt-2 gap-3">{children}</Collapse.Content>
        </>
      )}
    </Collapse>
  );
};

export default FiltersSection;

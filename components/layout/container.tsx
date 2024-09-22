import React, { FC, ReactNode } from "react";

import { cn } from "@msaaqcom/abjad/dist/theme";

interface ContainerProps {
  children: ReactNode;
  layout?: "center" | "fluid" | "default";
  className?: string;
  style?: React.CSSProperties;
}

const Container: FC<ContainerProps> = ({ children, layout = "default", className, style }: ContainerProps) => {
  return (
    <div
      className={cn(
        // xl:w-1/2
        layout === "center" && "mx-auto w-full px-4 lg:!w-3/5 lg:!px-0",
        layout === "fluid" && "!px-4 md:!px-8",
        layout === "default" && "!container !mx-auto !px-4 md:!px-0",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default Container;

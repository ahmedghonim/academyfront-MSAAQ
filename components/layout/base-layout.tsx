import React from "react";

import { cn } from "@msaaqcom/abjad/dist/theme";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  classNames?: {
    layout?: string;
  };
  renderHeader?: () => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  renderMobileNavigation?: () => React.ReactNode;
}

const BaseLayout = ({
  children,
  classNames,
  renderHeader,
  renderFooter,
  renderMobileNavigation,
  className,
  ...props
}: LayoutProps) => {
  return (
    <div className={cn("flex min-h-screen flex-col justify-between", className)}>
      {renderHeader && renderHeader()}
      <main
        className={cn("my-auto", classNames?.layout)}
        {...props}
      >
        {children}
      </main>
      {renderFooter && renderFooter()}
      {renderMobileNavigation && renderMobileNavigation()}
    </div>
  );
};

export default BaseLayout;

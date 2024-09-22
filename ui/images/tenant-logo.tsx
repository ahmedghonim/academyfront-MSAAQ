"use client";

import Image from "next/image";

import { useTenant } from "@/components/store/TenantProvider";
import { ProgressBarLink } from "@/providers/progress-bar";

import { Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

const TenantLogo = ({ className }: { className?: string }) => {
  const tenant = useTenant()((s) => s.tenant);

  return (
    <ProgressBarLink href="/">
      {tenant.logo ? (
        <Image
          src={tenant.logo ?? ""}
          width={65}
          height={40}
          alt={tenant.title ?? ""}
          className={cn("max-h-[3.8rem] w-auto", className)}
        />
      ) : (
        <Typography.Text
          as="div"
          size="md"
          className={cn("font-bold text-primary", className)}
        >
          {tenant.title ?? ""}
        </Typography.Text>
      )}
    </ProgressBarLink>
  );
};

export { TenantLogo };

"use client";

import { useTranslations } from "next-intl";
import { Controller } from "react-hook-form";

import { useSession } from "@/providers/session-provider";

import { Form } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

const MemberInfo = ({ control, errors, className }: { control: any; errors: any; className?: string }) => {
  const t = useTranslations();
  const { member } = useSession();

  const auth = Boolean(member);

  if (auth) {
    return null;
  }

  return (
    <div className={cn("flex flex-col space-y-4 border-t border-gray-300 p-4", className)}>
      <Controller
        name={"email"}
        control={control}
        render={({ field }) => (
          <Form.Input
            isRequired
            type="email"
            autoComplete="email"
            label={t("common.email")}
            className="mb-0"
            placeholder={t("common.email_input_placeholder")}
            error={errors.email?.message ?? ""}
            {...field}
          />
        )}
      />
    </div>
  );
};

export default MemberInfo;

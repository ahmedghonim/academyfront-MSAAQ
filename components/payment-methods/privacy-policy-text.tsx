"use client";

import { useTranslations } from "next-intl";

import { useTenant } from "@/components/store/TenantProvider";

const PrivacyPolicyText = () => {
  const tenant = useTenant()((state) => state.tenant);
  const t = useTranslations();

  return (
    <div className="mt-2 w-full text-center text-sm text-gray-800">
      {t.rich("shopping_cart:privacy_text", {
        academy: tenant?.title,
        a: (c) => (
          <a
            target="_blank"
            className="text-primary underline underline-offset-4"
            href="/terms"
          >
            {c}
          </a>
        )
      })}
    </div>
  );
};

export default PrivacyPolicyText;

"use client";

import { useCallback } from "react";

import { useParams } from "next/navigation";

import { useTenant } from "@/components/store/TenantProvider";
import { usePathname } from "@/utils/navigation";

type IsActiveFn = (paths: null | string[] | string) => boolean;
const useIsRouteActive = (): { isActive: IsActiveFn } => {
  const pathname = usePathname();
  const { locale } = useParams();
  const tenant = useTenant()((s) => s.tenant);

  const resolveURL = useCallback(
    (url: string) => {
      if (url.startsWith("http")) {
        return new URL(url);
      }
      if (tenant.locale === locale) {
        return new URL(url, `https://${tenant?.domain}`);
      }

      return new URL(`/${locale}${url}`, `https://${tenant?.domain}`);
    },
    [tenant]
  );

  const isActive = (paths: string[] | string | null) => {
    if (!paths) {
      return false;
    }

    if (Array.isArray(paths)) {
      return paths.some((path) => {
        const url = resolveURL(path);

        return pathname === url.pathname;
      });
    }

    const url = resolveURL(paths);

    return pathname === url.pathname;
  };

  return { isActive };
};

export default useIsRouteActive;

import { createSharedPathnamesNavigation } from "next-intl/navigation";

export const localePrefix = "as-needed";

export const { Link, redirect, usePathname, useRouter, permanentRedirect } = createSharedPathnamesNavigation({
  localePrefix
});

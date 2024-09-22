"use client";

import { useTenant } from "@/components/store/TenantProvider";

const useIsForeignerLink = () => {
  const tenant = useTenant()((s) => s.tenant);

  const isForeignerLink = (link: string) => {
    if (!tenant) {
      return false;
    }

    let url;

    try {
      url = new URL(link);
    } catch (e) {
      return false;
    }

    return !url.host.includes(tenant.domain);
  };

  return { isForeignerLink };
};

export default useIsForeignerLink;

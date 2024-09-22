import { useMemo } from "react";

import { useTenant } from "@/components/store/TenantProvider";
import { useSession } from "@/providers/session-provider";

const useProfileCompleteStatus = () => {
  const { member } = useSession();
  const tenant = useTenant()((state) => state.tenant);
  const profileDefaultsCompleted = useMemo(() => {
    if (!member) return false;

    return Boolean(member.email && member.phone && member.phone_code);
  }, [member, tenant]);

  const profileFieldsCompleted = useMemo(() => {
    if (!member || !tenant) return false;

    return (
      profileDefaultsCompleted &&
      tenant.complete_profile_fields.every((field) => member.meta?.complete_profile?.[field.name])
    );
  }, [member, tenant]);

  const profileRequiredFieldsCompleted = useMemo(() => {
    if (!member || !tenant) return false;

    return (
      profileDefaultsCompleted &&
      tenant.complete_profile_fields
        .filter((field) => field.required)
        .every((field) => member.meta?.complete_profile?.[field.name])
    );
  }, [member, tenant]);

  return {
    profileDefaultsCompleted,
    profileFieldsCompleted,
    profileRequiredFieldsCompleted
  };
};

export default useProfileCompleteStatus;

import { headers } from "next/headers";

import "server-only";

export const getTenantHost = () =>
  (process.env.NEXT_PUBLIC_OVERWRITE_TENANT_DOMAIN ?? headers().get("host")?.replace(".localhost:3000", "")) as string;

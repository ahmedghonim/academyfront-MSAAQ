import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export default function robots(): MetadataRoute.Robots {
  const host = process.env.NEXT_PUBLIC_OVERWRITE_TENANT_DOMAIN ?? headers().get("host")?.replace(".localhost:3000", "");

  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    host: `https://${host}`,
    sitemap: `https://${host}/sitemap.xml`
  };
}

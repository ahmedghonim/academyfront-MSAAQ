import { Organization } from "schema-dts";

import { Academy } from "@/types";

function organizationJsonLd(path: string, tenant: Academy | undefined): Organization {
  if (!path || !tenant) {
    return {} as Organization;
  }

  return {
    "@type": "Organization",
    "@id": `https://${tenant.domain}${path}#organization`,
    url: `https://${tenant.domain}${path}`,
    logo: tenant.logo || tenant.favicon || undefined,
    image: tenant.meta_image || tenant.logo || undefined,
    name: tenant.title,
    description: tenant.meta_description || "",
    keywords: tenant.meta_keywords.length > 0 ? tenant.meta_keywords?.join(", ") : undefined,
    sameAs:
      Object.keys(tenant.links).length > 0
        ? Object.keys(tenant.links)
            .map((key) => tenant.links[key as keyof typeof tenant.links])
            .filter((link) => link)
        : undefined
  } as Organization;
}

export default organizationJsonLd;

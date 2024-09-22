import { WebSite } from "schema-dts";

import { Academy } from "@/types";
import { searchActionJsonLd } from "@/utils/jsonLd/index";

function webSiteJsonLd(tenant?: Academy): WebSite {
  if (!tenant) {
    return {} as WebSite;
  }

  return {
    "@type": "WebSite",
    "@id": `https://${tenant.domain}#website`,
    url: `https://${tenant.domain}`,
    name: tenant.title,
    description: tenant.meta_description || undefined,
    keywords: tenant.meta_keywords.length > 0 ? tenant.meta_keywords.join(", ") : undefined,
    inLanguage: tenant.locale,
    publisher: {
      "@id": `https://${tenant.domain}#organization`
    },
    potentialAction: searchActionJsonLd(tenant)
  } as WebSite;
}

export default webSiteJsonLd;

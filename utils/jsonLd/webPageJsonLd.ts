import { WebPage } from "schema-dts";

import { Academy, Page } from "@/types";

function webPageJsonLd(page: Page | undefined, path: string, tenant: Academy | undefined): WebPage {
  if (!path || !page || !tenant) {
    return {} as WebPage;
  }

  return {
    "@type": "WebPage",
    "@id": `https://${tenant.domain}${path}#webpage`,
    url: `https://${tenant.domain}${path}`,
    name: page.title,
    description: page.meta_description || undefined,
    keywords: page.meta_keywords && page.meta_keywords.length > 0 ? page.meta_keywords?.join(", ") : undefined,
    datePublished: page.created_at,
    dateModified: page.updated_at,
    inLanguage: tenant.locale,
    isPartOf: {
      "@id": `https://${tenant.domain}#website`
    },
    about: {
      "@id": `https://${tenant.domain}${path}#organization`
    }
  } as WebPage;
}

export default webPageJsonLd;

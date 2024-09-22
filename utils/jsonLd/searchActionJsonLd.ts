import { SearchAction } from "schema-dts";

import { Academy } from "@/types";

function searchActionJsonLd(tenant: Academy | undefined): SearchAction {
  if (!tenant) {
    return {} as SearchAction;
  }

  return {
    "@type": "SearchAction",
    target: `https://${tenant.domain}/search?q={search_term}&type={search_type}`,
    "query-input": "required name=search_term required name=search_type"
  } as SearchAction;
}

export default searchActionJsonLd;

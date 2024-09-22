import { Product as ProductSchema } from "schema-dts";

import { Academy, Product } from "@/types";
import { courseJsonLd } from "@/utils/jsonLd/index";

function productJsonLd(product: Product | null, tenant?: Academy): ProductSchema {
  if (!product || !tenant) {
    return {} as ProductSchema;
  }

  return {
    "@type": "Product",
    "@id": `https://${tenant?.domain}/bundles/${product?.slug}`,
    url: `https://${tenant?.domain}/bundles/${product?.slug}`,
    name: product.title,
    image: product.thumbnail ? [product.thumbnail] : undefined,
    description: product.summary || product.description || product.meta_description || "",
    keywords: product.meta_keywords?.length > 0 ? product.meta_keywords?.join(", ") : undefined,
    offers: {
      "@type": "AggregateOffer",
      url: `https://${tenant.domain}/bundles/${product.slug}`,
      category: product.price === 0 ? "Free" : "Paid",
      availability: "https://schema.org/InStock",
      priceCurrency: tenant.currency,
      highPrice: product.sales_price ? product.sales_price / 100 : product.price ? product.price / 100 : 0,
      lowPrice: product.price ? product.price / 100 : 0,
      offerCount: product.items?.length,
      offers: product.items?.map((item) => {
        return {
          "@type": "Offer",
          itemOffered: item.type === "course" ? courseJsonLd(item, tenant) : productJsonLd(item, tenant),
          price: item.price ? item.price / 100 : 0,
          priceCurrency: tenant.currency
        };
      })
    }
  } as ProductSchema;
}

export default productJsonLd;

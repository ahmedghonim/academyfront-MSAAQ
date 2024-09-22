import { Product as ProductSchema } from "schema-dts";

import { Academy, Product } from "@/types";

function productJsonLd(
  product: Product | null,
  tenant: Academy | undefined,
  ratingValue?: number | undefined,
  reviewCount?: number | undefined
): ProductSchema {
  if (!product || !tenant) {
    return {} as ProductSchema;
  }

  return {
    "@type": "Product",
    "@id": `https://${tenant?.domain}/products/${product?.slug}`,
    url: `https://${tenant?.domain}/products/${product?.slug}`,
    name: product.title,
    description: product.summary || product.description || product.meta_description || "",
    keywords: product.meta_keywords?.length > 0 ? product.meta_keywords?.join(", ") : undefined,
    image: product.thumbnail || undefined,
    offers: {
      "@type": "AggregateOffer",
      offerCount: 1,
      category: product.price === 0 ? "Free" : "Paid",
      availability: "https://schema.org/InStock",
      priceCurrency: tenant.currency,
      highPrice: product.sales_price ? product.sales_price / 100 : product.price ? product.price / 100 : 0,
      lowPrice: product.price ? product.price / 100 : 0
    },
    aggregateRating:
      ratingValue && reviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: ratingValue,
            reviewCount: reviewCount
          }
        : undefined
  } as ProductSchema;
}

export default productJsonLd;

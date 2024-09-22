import React from "react";

import { fetchMemberProducts } from "@/server-actions/services/member-service";
import { ProductType } from "@/types";

import ProductsListing from "./products-listing";

export default async function Page() {
  const products = await fetchMemberProducts({
    limit: 3,
    filters: {
      type: ProductType.DIGITAL
    }
  });

  return (
    <ProductsListing
      initialData={products}
      initialFilters={{
        limit: 3
      }}
    />
  );
}

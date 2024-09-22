import { fetchProducts } from "@/server-actions/services/product-service";
import { AnyObject, ProductType } from "@/types";

import ProductsList from "../_lists/products-list";

export default async function Page({ params }: { params: AnyObject }) {
  const filters = {
    page: 1,
    limit: 3,
    filters: {
      type: ProductType.COACHING_SESSION,
      consultant: params.username as string
    }
  };

  const products = await fetchProducts(filters);

  if (!products || !products.data.length) {
    return null;
  }

  return (
    <ProductsList
      initialProducts={products}
      initialFilters={filters}
    />
  );
}

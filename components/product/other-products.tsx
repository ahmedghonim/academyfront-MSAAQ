import { fetchInterestingProducts } from "@/server-actions/services/product-service";

import OtherProductsCard from "./other-products-card";

const OtherProducts = async ({ type, slug }: { slug: string; type: "course" | "product" }) => {
  const products = await fetchInterestingProducts({
    limit: 3,
    slug: slug
  });

  return (
    <OtherProductsCard
      type={type}
      products={products.data}
    />
  );
};

export default OtherProducts;

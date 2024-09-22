"use client";

import { ProductCard } from "@/components/product";
import { Product } from "@/types";

import { Grid } from "@msaaqcom/abjad";

const Products = ({ products }: { products: Product[] }) => {
  return (
    <Grid
      columns={{
        md: 3
      }}
    >
      {products.map((products, i) => (
        <Grid.Cell key={i}>
          <ProductCard product={products} />
        </Grid.Cell>
      ))}
    </Grid>
  );
};

export default Products;

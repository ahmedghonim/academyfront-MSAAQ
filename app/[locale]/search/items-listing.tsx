"use client";

import { useParams } from "next/navigation";

import { ArticleCard } from "@/components/article";
import { CourseCard } from "@/components/course";
import { ProductCard } from "@/components/product";
import { Article, Course, Product } from "@/types";

import { Grid } from "@msaaqcom/abjad";

type Props = {
  data: Array<Product | Article | Course>;
};
const ItemsListing = ({ data }: Props) => {
  const { type } = useParams() ?? {};

  return (
    <Grid
      columns={{
        md: 3
      }}
    >
      {data.map((item, i) => (
        <Grid.Cell key={i}>
          {type === "products" && <ProductCard product={item as Product} />}
          {type === "posts" && <ArticleCard article={item as Article} />}
          {type === "courses" && <CourseCard course={item as Course} />}
        </Grid.Cell>
      ))}
    </Grid>
  );
};

export default ItemsListing;

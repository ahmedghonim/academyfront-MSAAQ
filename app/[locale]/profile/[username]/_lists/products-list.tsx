"use client";

import { useTranslations } from "next-intl";
import { AnyObject } from "yup";

import { LoadingCard } from "@/components/loading-card";
import { ProductCard } from "@/components/product";
import { useInfiniteScroll, useMediaQuery } from "@/hooks";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { fetchProducts } from "@/server-actions/services/product-service";
import { BREAKPOINTS, Product } from "@/types";

import { Button, Card, Grid, Typography } from "@msaaqcom/abjad";

type Props = {
  initialProducts: APIFetchResponse<Product[]>;
  initialFilters: AnyObject;
};
const ProductsList = ({ initialProducts, initialFilters }: Props) => {
  const t = useTranslations();
  const {
    data: products,
    canLoadMore,
    loadMore,
    isLoading,
    total
  } = useInfiniteScroll<Product>(initialProducts, fetchProducts, initialFilters);

  const isMD = useMediaQuery(BREAKPOINTS.md);

  if (!products || !products.length) {
    return null;
  }

  return (
    <Card className="products-section-card h-full border-0 bg-gray-100">
      <Card.Body className="products-section-card-body flex flex-col space-y-6 p-6">
        <Typography.Title
          size="md"
          className="products-section-title font-semibold"
          children={t("instructors.the_products", { count: total }) as string}
        />
        <Grid
          columns={{
            md: 3,
            sm: 1
          }}
          gap={{
            xs: "1rem",
            sm: "1rem",
            md: "1rem",
            lg: "1rem",
            xl: "1rem"
          }}
          className="products-section-grid"
        >
          {products.map((product) => (
            <Grid.Cell key={product.id}>
              <ProductCard product={product} />
            </Grid.Cell>
          ))}
        </Grid>
        {isLoading && (
          <Grid
            columns={{
              md: 3,
              sm: 1
            }}
            gap={{
              xs: "1rem",
              sm: "1rem",
              md: "1rem",
              lg: "1rem",
              xl: "1rem"
            }}
            className="mt-4"
          >
            {Array.from({ length: isMD ? 3 : 1 }, (_, index) => (
              <Grid.Cell key={index}>
                <LoadingCard key={index} />
              </Grid.Cell>
            ))}
          </Grid>
        )}
        {canLoadMore && (
          <Button
            size="md"
            variant="solid"
            color="primary"
            className="load-more-products-btn mx-auto mt-4 flex"
            isLoading={isLoading}
            onPress={loadMore}
          >
            {t("common.load_more")}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductsList;

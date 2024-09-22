"use client";

import { useTranslations } from "next-intl";

import { LoadingCard } from "@/components/loading-card";
import { useInfiniteScroll } from "@/hooks";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { fetchProducts } from "@/server-actions/services/product-service";
import { AnyObject, Product } from "@/types";

import { Button, Grid, GridProps } from "@msaaqcom/abjad";

import ProductCard from "./product-card";
import ProductSectionCard from "./product-section-card";

type Props = {
  initialProducts: APIFetchResponse<Product[]>;
  initialFilters: AnyObject;
  columns: GridProps["columns"];
  className?: string;
  title?: string;
};
const ProductsSectionCard = ({ initialProducts, title, initialFilters, columns, className }: Props) => {
  const t = useTranslations();

  const {
    data: products,
    canLoadMore,
    loadMore,
    isLoading
  } = useInfiniteScroll<Product>(initialProducts, fetchProducts, initialFilters);

  return (
    <ProductSectionCard
      title={title}
      className={className}
      children={
        <>
          <Grid columns={columns}>
            {isLoading
              ? Array.from({ length: 3 }, (_, index) => (
                  <Grid.Cell key={index}>
                    <LoadingCard key={index} />
                  </Grid.Cell>
                ))
              : products?.map((product: Product, i) => (
                  <Grid.Cell key={i}>
                    <ProductCard product={product} />
                  </Grid.Cell>
                ))}
          </Grid>
          {canLoadMore && (
            <div className="mt-4 flex w-full justify-center">
              <Button
                size="md"
                isLoading={isLoading}
                isDisabled={isLoading}
                onPress={loadMore}
                children={t("account.show_more")}
              />
            </div>
          )}
        </>
      }
    />
  );
};

export default ProductsSectionCard;

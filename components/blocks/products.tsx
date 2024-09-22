"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { LoadingCard } from "@/components/loading-card";
import Pagination from "@/components/pagination";
import { ProductCard } from "@/components/product";
import { useFetchProductsQuery } from "@/store/slices/api/productSlice";
import { PageBlock, Product } from "@/types";

import { Button } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

import BaseSection, { getGrid } from "./base-section";

export default function Products({ block }: { block: PageBlock<"products"> }) {
  const t = useTranslations();

  const [products, setProducts] = useState<Product[]>(block.data.data);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handlePageChange = (data: Product[]) => {
    setProducts(data);
  };

  return (
    <BaseSection block={block}>
      <div className="col-span-12">
        <div className={cn("grid w-full gap-8", getGrid(block))}>
          {!isFetching
            ? products.map((product: Product, index: number) => (
                <ProductCard
                  product={product}
                  key={index}
                />
              ))
            : Array.from({ length: block.fields_values.col }, (_, index) => <LoadingCard key={index} />)}
        </div>
        {products.length ? (
          <Pagination
            showMoreAction={
              <Button
                href="/products"
                size="sm"
              >
                {t("common.show_all_with_total", {
                  total: block.data.total
                })}
              </Button>
            }
            total={block.data.total}
            links={block?.data?.links}
            fetchQuery={useFetchProductsQuery}
            params={{
              page: block.data.current_page,
              limit: block.data.per_page
            }}
            onPageChange={handlePageChange}
            onFetching={(fetching) => setIsFetching(fetching)}
          />
        ) : null}
      </div>
    </BaseSection>
  );
}

"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import EmptyState from "@/components/empty-state";
import { ProductLibraryCard } from "@/components/library";
import { ProductFilesModal } from "@/components/modals";
import { useInfiniteScroll } from "@/hooks";
import { APIFetchResponse } from "@/server-actions/config/base-query";
import { fetchMemberProducts } from "@/server-actions/services/member-service";
import { AnyObject, ContentAttachment, Product } from "@/types";

import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline";

import { Button, Grid } from "@msaaqcom/abjad";

interface Props {
  initialData: APIFetchResponse<Product[]>;
  initialFilters: AnyObject;
}

const ProductsListing = ({ initialData, initialFilters }: Props) => {
  const t = useTranslations();
  const [showProductFilesModal, setShowProductFilesModal] = useState<boolean>(false);
  const [productAttachments, setProductAttachments] = useState<ContentAttachment[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const toggleProductFilesModal = () => {
    setShowProductFilesModal((prev) => !prev);
  };

  const {
    data: products,
    canLoadMore,
    loadMore,
    isLoading
  } = useInfiniteScroll<Product>(initialData, fetchMemberProducts, initialFilters);

  if (!products.length) {
    return (
      <EmptyState
        className="mt-4"
        iconClassName="text-gray-700"
        title={t("empty_sections.no_products")}
        description={t("empty_sections.no_products_description")}
        icon={<MagnifyingGlassCircleIcon />}
        actions={
          <Button
            href="/"
            className="w-full md:!w-auto"
            children={t("common.browse_academy")}
          />
        }
      />
    );
  }

  return (
    <>
      <Grid
        columns={{
          lg: 12,
          xl: 12,
          md: 12
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
        {products.map((product: Product, i: number) => (
          <Grid.Cell
            key={i}
            columnSpan={{
              lg: 4,
              md: 6
            }}
            className="h-full"
          >
            <ProductLibraryCard
              toggleProductFilesModal={toggleProductFilesModal}
              setProductAttachments={setProductAttachments}
              setProduct={setProduct}
              product={product}
            />
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
      <ProductFilesModal
        product={product}
        showModal={showProductFilesModal}
        toggleModal={toggleProductFilesModal}
        attachments={productAttachments}
      />
    </>
  );
};

export default ProductsListing;

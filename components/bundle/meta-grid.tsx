"use client";

import { useTranslations } from "next-intl";

import { ProductPrice, ProductSectionCard } from "@/components/product";
import { Product } from "@/types";

import { CreditCardIcon, FolderOpenIcon, UsersIcon } from "@heroicons/react/24/outline";

import { Grid, Typography } from "@msaaqcom/abjad";

const MetaGrid = ({ product }: { product: Product }) => {
  const t = useTranslations();

  return (
    <Grid
      columns={{
        md: 3,
        sm: 1
      }}
      gap={{
        md: "1rem",
        lg: "1rem",
        xl: "1rem"
      }}
    >
      <Grid.Cell>
        <ProductSectionCard
          align="default"
          vertical
          icon={<CreditCardIcon />}
          children={
            <div className="grid">
              <Typography.Body
                size="md"
                className="text-gray-700"
                children={t("bundle_page.price")}
              />
              <ProductPrice
                price={product.price}
                salesPrice={product.sales_price}
              />
            </div>
          }
        />
      </Grid.Cell>
      <Grid.Cell>
        <ProductSectionCard
          align="default"
          vertical
          icon={<FolderOpenIcon />}
          children={
            <div className="grid">
              <Typography.Body
                size="md"
                className="text-gray-700"
                children={t("bundle_page.products")}
              />
              <Typography.Body
                size="lg"
                children={t("bundle_page.products_count", {
                  product: product.products_count,
                  course: product.courses_count
                })}
                className="font-medium"
              />
            </div>
          }
        />
      </Grid.Cell>
      <Grid.Cell>
        <ProductSectionCard
          align="default"
          vertical
          icon={<UsersIcon />}
          children={
            <div className="grid">
              <Typography.Body
                size="md"
                className="text-gray-700"
                children={t("bundle_page.buyers")}
              />
              <Typography.Body
                size="lg"
                children={t("bundle_page.buyers_count", {
                  count: product.downloads_count
                })}
                className="font-medium"
              />
            </div>
          }
        />
      </Grid.Cell>
    </Grid>
  );
};

export default MetaGrid;

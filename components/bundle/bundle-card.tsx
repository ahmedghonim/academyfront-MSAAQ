"use client";

import React from "react";

import { useTranslations } from "next-intl";

import { AddToCartButton, ExpressCheckoutButton } from "@/components/cart";
import { Product } from "@/types";
import { calculateDiscount } from "@/utils";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";

import { Badge, Button, Icon, Typography } from "@msaaqcom/abjad";

interface Props {
  product: Product;
}

const BundleCard = ({ product }: Props) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col">
      <div className="flex w-full flex-col justify-between md:!flex-row md:!items-center">
        <div className="flex flex-col-reverse items-start justify-start gap-4 md:!flex-row md:!items-center">
          <Typography.Body
            as="h1"
            size="lg"
            className="mb-4 font-bold text-black md:!mb-0"
            children={product.title}
          />
          {product.sales_price > 0 ? (
            <Badge
              className="flex-shrink-0"
              color="warning"
              variant="soft"
              size="md"
              rounded="full"
            >
              {t("common.discount", {
                discount: calculateDiscount(product.sales_price, product.price)
              })}
            </Badge>
          ) : undefined}
        </div>
        <div className="hidden flex-row items-center gap-2 md:!flex">
          {product.can_download ? (
            <Button
              variant="solid"
              color="primary"
              size="md"
              className="mx-auto"
              href="/library/courses"
            >
              {t("common.to_library")}
            </Button>
          ) : (
            <>
              <ExpressCheckoutButton
                product_id={product.id}
                product_type="product"
                label={product.price == 0 ? t("common.get_collection_for_free") : t("common.buy_now")}
                className="w-full px-10"
              />
              <AddToCartButton
                product={product}
                product_id={product.id}
                product_type="product"
                variant="solid"
                color="gray"
                icon={
                  <Icon>
                    <ShoppingCartIcon />
                  </Icon>
                }
              />
            </>
          )}
        </div>
      </div>
      <div className="mt-8 h-px bg-gray-400" />
    </div>
  );
};

export default BundleCard;

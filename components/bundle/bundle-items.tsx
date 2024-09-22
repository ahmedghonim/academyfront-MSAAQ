"use client";

import { useTranslations } from "next-intl";

import { ExpressCheckoutButton } from "@/components/cart";
import { CourseCard } from "@/components/course";
import { ProductCard, ProductSectionCard } from "@/components/product";
import { Product } from "@/types";

import { RectangleStackIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";

import { Button, Icon } from "@msaaqcom/abjad";

const BundleItems = ({ product }: { product: Product }) => {
  const t = useTranslations();

  return (
    <ProductSectionCard
      align="center"
      vertical
      title={t("bundle_page.content")}
      icon={<RectangleStackIcon />}
      hasDivider
      children={
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {product.items?.map((item: any) =>
              item.type == "course" ? (
                <CourseCard
                  course={item}
                  key={item.id}
                  hasFooter={product.can_download}
                />
              ) : (
                <ProductCard
                  product={item}
                  key={item.id}
                  hasFooter={product.can_download}
                />
              )
            )}
          </div>
          <div className="mt-8 flex items-center justify-center">
            {product.can_download ? (
              <Button
                variant="solid"
                color="gray"
                size="md"
                className="mx-auto"
                href="/library/courses"
              >
                {t("common.to_library")}
              </Button>
            ) : (
              <ExpressCheckoutButton
                product_type="product"
                product_id={product.id}
                color="primary"
                size="md"
                variant="solid"
                className="mx-auto"
                rounded="full"
                label={product.price == 0 ? t("common.get_collection_for_free") : t("common.buy_now")}
                icon={
                  <Icon>
                    <ShoppingCartIcon />
                  </Icon>
                }
              />
            )}
          </div>
        </>
      }
      dividerPosition="top"
      className="!px-8 !py-12"
    />
  );
};

export default BundleItems;

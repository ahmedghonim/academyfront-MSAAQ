"use client";

import { useTranslations } from "next-intl";

import TamaraWidget, { TamaraWidgetType } from "@/components/TamaraWidget";
import { AddToCartButton, ExpressCheckoutButton } from "@/components/cart";
import { useFormatPrice } from "@/hooks";
import { Product } from "@/types";
import { DownloadProductButton } from "@/ui/buttons";
import { calculateDiscount } from "@/utils";
import transWithCount from "@/utils/trans-with-count";

import { ArrowDownTrayIcon, BoltIcon, ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline";

import { Badge, Button, Icon, Typography } from "@msaaqcom/abjad";

import ProductMobileImages from "./product-mobile-images";
import ProductPrice from "./product-price";
import ProductProfileCard from "./product-profile-card";

interface Props {
  product: Product;
}

const ProductSideCard = ({ product }: Props) => {
  const t = useTranslations();
  const { formatPlainPrice } = useFormatPrice();

  return (
    <ProductProfileCard
      reviewsEnabled={product.meta.reviews_enabled}
      append={<ProductMobileImages product={product} />}
      badge={
        product.sales_price > 0 ? (
          <Badge
            color="warning"
            variant="soft"
            size="md"
            rounded="full"
          >
            {t("common.discount", {
              discount: calculateDiscount(product.sales_price, product.price)
            })}
          </Badge>
        ) : undefined
      }
      title={product.title}
      summary={product.summary}
      ratings={0}
      category={product.category}
      categoryHref={product.category ? `/products/categories/${product.category.slug}` : ""}
      totalReviews={0}
      ratingsDetails={
        product.meta.show_downloads_count && (
          <Typography.Body
            size="sm"
            className="text-gray-700"
            children={t(transWithCount("students.WithCount", product.downloads_count), {
              count: product.downloads_count
            })}
          />
        )
      }
      list={{
        items: [
          ...(product.meta.show_downloads_count
            ? [
                {
                  icon: <UserIcon />,
                  text: t.rich("product_page:downloads_count", {
                    strong: (children) => <strong>{children}</strong>,
                    count: product.downloads_count
                  })
                }
              ]
            : []),
          ...(!product.meta.custom_url
            ? [
                {
                  icon: <ArrowDownTrayIcon />,
                  text: t.rich("product_page:downloadable_attachments", {
                    strong: (children) => <strong>{children}</strong>,
                    count: product.attachments.length
                  })
                }
              ]
            : []),
          {
            icon: <BoltIcon />,
            text: t("product_page.lifetime_access")
          }
        ]
      }}
      price={
        <ProductPrice
          price={product.price}
          salesPrice={product.sales_price}
        />
      }
      actions={
        product.can_download ? (
          product.meta.custom_url ? (
            <Button
              href={product.meta.custom_url}
              target="_blank"
              variant="solid"
              color="primary"
              className="w-full"
              children={t("product_page.download_attachments")}
            />
          ) : (
            <DownloadProductButton
              filePath={`/products/${product.slug}/download`}
              fileName={product.title}
              variant="solid"
              color="primary"
              className="w-full"
              children={t("product_page.download_attachments")}
            />
          )
        ) : (
          <div className="flex flex-wrap gap-4">
            <ExpressCheckoutButton
              className="shrink grow basis-auto break-words"
              product_type="product"
              product_id={product.id}
              color="primary"
              size="md"
              variant="solid"
              label={product.price == 0 ? t("common.get_it_for_free") : t("common.buy_now")}
            />
            <AddToCartButton
              product={product}
              product_type="product"
              product_id={product.id}
              color="gray"
              size="md"
              icon={
                <Icon>
                  <ShoppingCartIcon />
                </Icon>
              }
            />
          </div>
        )
      }
    >
      <TamaraWidget
        price={formatPlainPrice(product.price)}
        type={TamaraWidgetType.SPILT_AMOUNT_PRODUCT_PAGE}
      />
    </ProductProfileCard>
  );
};

export default ProductSideCard;

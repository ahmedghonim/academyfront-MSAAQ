import React, { Dispatch, ReactNode, SetStateAction } from "react";

import { useTranslations } from "next-intl";

import { ProgressBarLink } from "@/providers/progress-bar";
import { ContentAttachment, Product } from "@/types";
import { Thumbnail } from "@/ui/images";

import { Badge, Button, Card, Typography } from "@msaaqcom/abjad";

type ProductCardProps = {
  product: Product;
  children?: ReactNode;
  setProductAttachments?: Dispatch<SetStateAction<ContentAttachment[]>>;
  setProduct?: Dispatch<SetStateAction<Product | null>>;
  toggleProductFilesModal?: () => void;
};

const ProductLibraryCard = ({
  product,
  setProductAttachments,
  toggleProductFilesModal,
  setProduct
}: ProductCardProps) => {
  const t = useTranslations();

  return (
    <Card className="group h-full transform duration-150 ease-linear hover:-translate-y-2 hover:shadow-[12px_32px_32px_0px_rgba(0,0,0,0.12)]">
      <Card.Body className="relative flex h-full flex-col p-4">
        <Thumbnail
          src={product.thumbnail}
          alt={product.title}
        />
        <div className="mt-4 flex flex-1 flex-col space-y-2">
          <div className="flex items-start justify-between gap-4">
            <Typography.Body
              as="h3"
              size="base"
              className="break-words font-semibold group-hover:text-primary"
            >
              <ProgressBarLink href={`/products/${product.slug}`}>
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                />
                {product.title}
              </ProgressBarLink>
            </Typography.Body>
            <Badge
              rounded="full"
              color="gray"
              variant="soft"
              children={t(`account.products_${product.type}`)}
              size="md"
              className="flex-shrink-0 px-5"
            />
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="mt-auto flex-col space-y-4">
        {product.meta.custom_url ? (
          <Button
            href={product.meta.custom_url}
            target="_blank"
            variant="outline"
            color="primary"
            className="w-full"
            children={t("account.products_display_product_files")}
          />
        ) : (
          <Button
            className="w-full"
            children={t("account.products_display_product_files")}
            onPress={() => {
              setProductAttachments?.(product.attachments);
              setProduct?.(product);
              toggleProductFilesModal?.();
            }}
            variant="outline"
          />
        )}
      </Card.Footer>
    </Card>
  );
};

export default ProductLibraryCard;

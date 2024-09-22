"use client";

import React, { useEffect } from "react";

import { useResponseToastHandler, useServerAction } from "@/hooks";
import { expressCheckoutMutation } from "@/server-actions/actions/cart-actions";
import { AnyObject } from "@/types";
import { useRouter } from "@/utils/navigation";

import { Button, Icon } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface AddToCartButtonProps {
  product_id: string | number;
  product_type: "course" | "product";
  label: string | null;
  variant?: "solid" | "outline" | "link";
  color?: "primary" | "secondary" | "warning" | "success" | "danger" | "info" | "gray" | "gradient" | undefined;
  size?: "sm" | "md";
  rounded?: "sm" | "md" | "lg" | "none" | "full" | undefined;
  icon?: React.ReactElement<typeof Icon>;
  className?: string;
  meta?: AnyObject;
  disabled?: boolean;
}

const ExpressCheckoutButton = ({
  product_id,
  product_type,
  size,
  icon,
  disabled,
  variant,
  label,
  className,
  rounded,
  color,
  meta
}: AddToCartButtonProps) => {
  const router = useRouter();
  const [expressCheckout, { isLoading, isSuccess, isError, error }] = useServerAction(expressCheckoutMutation);

  const { displayErrors } = useResponseToastHandler({});

  useEffect(() => {
    if (isError && error) {
      displayErrors(error);
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess) {
      router.push(`/cart/checkout/express/${product_type}/${product_id}`);
    }
  }, [isSuccess]);

  return (
    <Button
      rounded={rounded ?? "md"}
      variant={variant ?? "solid"}
      color={color ?? "primary"}
      size={size ?? "md"}
      icon={icon}
      isLoading={isLoading}
      isDisabled={disabled}
      className={cn(isLoading && "cursor-not-allowed", className, "express-checkout-btn")}
      onPress={async () => {
        if (disabled) {
          return;
        }

        await expressCheckout({
          product_id,
          product_type,
          meta
        });
      }}
    >
      {label}
    </Button>
  );
};

export default ExpressCheckoutButton;

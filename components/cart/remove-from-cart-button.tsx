"use client";

import React, { useEffect } from "react";

import { useCart } from "@/components/store/CartProvider";
import { useResponseToastHandler, useServerAction } from "@/hooks";
import { removeFromCartMutation } from "@/server-actions/actions/cart-actions";

import { Button, Icon } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

interface RemoveFromCartButtonProps {
  product_id: string | number;
  product_type: "course" | "product";
  label?: string;
  variant?: "solid" | "outline";
  color?: "primary" | "secondary" | "gray";
  size?: "sm" | "md";
  icon?: React.ReactElement<typeof Icon>;
  className?: string;
}

const RemoveFromCartButton = ({
  product_id,
  product_type,
  variant,
  color,
  size,
  icon,
  className,
  label
}: RemoveFromCartButtonProps) => {
  const [removeFromCart, { isLoading, isError, isSuccess, data, error }] = useServerAction(removeFromCartMutation);
  const { displayErrors } = useResponseToastHandler({});
  const setCart = useCart()((state) => state.setCart);

  useEffect(() => {
    if (isError && error) {
      displayErrors({
        error
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess && data) {
      setCart(data);
    }
  }, [isSuccess, data]);

  return (
    <Button
      variant={variant ?? "solid"}
      color={color ?? "primary"}
      size={size ?? "md"}
      icon={icon}
      isLoading={isLoading}
      className={cn(isLoading && "cursor-not-allowed", className, "remove-from-cart-btn")}
      onPress={async () => {
        await removeFromCart({
          product_id,
          product_type
        });
      }}
    >
      {label}
    </Button>
  );
};

export default RemoveFromCartButton;

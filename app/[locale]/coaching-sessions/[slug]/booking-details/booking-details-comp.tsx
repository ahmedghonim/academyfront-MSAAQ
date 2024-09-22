"use client";

import React from "react";

import { ExpressCheckoutButton } from "@/components/cart";
import { BookingDetailsLayout } from "@/components/coaching-sessions";
import { Product } from "@/types";

const BookingDetailsComp = ({ label, product }: { label: string; product: Product }) => {
  return (
    <BookingDetailsLayout
      product={product}
      renderBookActions={({ product_id, member_timezone, user_id, start_at, canConfirm }) => {
        return (
          <ExpressCheckoutButton
            color="primary"
            product_id={product_id}
            product_type={"product"}
            label={label}
            disabled={!canConfirm}
            meta={{
              appointment: {
                user_id,
                start_at,
                member_timezone
              }
            }}
          />
        );
      }}
    />
  );
};

export default BookingDetailsComp;

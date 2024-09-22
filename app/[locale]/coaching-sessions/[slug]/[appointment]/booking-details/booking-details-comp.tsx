"use client";

import React from "react";

import { BookAppointmentAction, BookingDetailsLayout } from "@/components/coaching-sessions";
import { Product } from "@/types";

const BookingDetailsComp = ({ product }: { product: Product }) => {
  return (
    <BookingDetailsLayout
      product={product}
      renderBookActions={(props) => {
        return product && product.can_download && <BookAppointmentAction {...props} />;
      }}
    />
  );
};

export default BookingDetailsComp;

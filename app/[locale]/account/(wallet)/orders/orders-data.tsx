"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { orderHistoryCol } from "@/components/columns";
import { Datatable, EmptyStateTable } from "@/components/datatable";
import { fetchOrders } from "@/server-actions/services/orders-service";

import { StarIcon } from "@heroicons/react/24/outline";

import { Button } from "@msaaqcom/abjad";

const OrdersData = () => {
  const t = useTranslations();
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 0));

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Datatable
      columns={{
        columns: orderHistoryCol,
        props: {
          isMobile: windowWidth < 768
        }
      }}
      fetcher={fetchOrders}
      emptyState={
        <EmptyStateTable
          title={t("empty_sections.no_orders_title")}
          content={t("empty_sections.no_orders_description")}
          icon={<StarIcon />}
          children={
            <Button
              href={"/"}
              children={t("common.browse_academy")}
            />
          }
        />
      }
    />
  );
};

export default OrdersData;

"use client";

import { useTranslations } from "next-intl";

import { withdrawEarningCol } from "@/components/columns";
import { Datatable, EmptyStateTable } from "@/components/datatable";
import { fetchPayouts } from "@/server-actions/services/affiliates-service";

import { StarIcon } from "@heroicons/react/24/outline";

import { Button } from "@msaaqcom/abjad";

const BillingData = () => {
  const t = useTranslations();

  return (
    <Datatable
      columns={{
        columns: withdrawEarningCol
      }}
      fetcher={fetchPayouts}
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

export default BillingData;

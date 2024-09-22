"use client";

import { ReactNode, useEffect } from "react";

import { useSearchParams } from "next/navigation";

import { useTranslations } from "next-intl";

import { useToast } from "@/hooks";

import { Grid } from "@msaaqcom/abjad";

interface Props {
  children: ReactNode;
  sideCard: ReactNode;
}

const ProductPageLayout = ({ children, sideCard }: Props) => {
  const searchParams = useSearchParams();
  const [toast] = useToast();
  const t = useTranslations();

  useEffect(() => {
    if (searchParams.get("message")) {
      toast.error({
        message: t(`common.${searchParams.get("message")}`)
      });
    }
  }, [searchParams]);

  return (
    <Grid
      columns={{
        lg: 3,
        md: 1
      }}
      gap={{
        xs: "2rem",
        sm: "2rem",
        md: "2rem",
        lg: "2rem",
        xl: "2rem"
      }}
    >
      <Grid.Cell
        columnSpan={{ lg: 2 }}
        className="order-2 flex flex-col gap-y-8 md:!order-1"
      >
        {children}
      </Grid.Cell>
      <Grid.Cell className="order-1 md:!order-2">{sideCard}</Grid.Cell>
    </Grid>
  );
};

export default ProductPageLayout;

"use client";

import { Dispatch, ReactNode, SetStateAction } from "react";

import { useTranslations } from "next-intl";

import { AnyObject } from "@/types";

import { Button, Card, Form } from "@msaaqcom/abjad";

interface Props {
  setFilters: Dispatch<SetStateAction<AnyObject>>;
  handleFilter: () => void;
  filters: AnyObject | undefined | null;

  children?(
    handleParams: (checked: boolean, value: any, paramKey: string) => void,
    handleCheckboxInput: (key: string, value: string | number | object) => boolean
  ): ReactNode;
}

const ProductFilters = ({ setFilters, handleFilter, filters, children }: Props) => {
  const t = useTranslations();

  const handleParams = (checked: boolean, value: any, paramKey: string) => {
    setFilters((prev: any) => {
      const currentValues = paramKey !== "rating" ? prev?.[paramKey] || [] : [];

      if (checked) {
        return {
          ...prev,
          [paramKey]: [...currentValues, value]
        };
      }

      return {
        ...prev,
        [paramKey]: currentValues.filter((item: any) => {
          if (typeof item === "object" && typeof value === "object") {
            return JSON.stringify(item) !== JSON.stringify(value);
          }

          return item !== value;
        })
      };
    });
  };

  const handleCheckboxInput = (key: string, value: string | number | object) => {
    if (typeof value === "object") {
      return filters?.duration?.some((obj: any) => JSON.stringify(obj) === JSON.stringify(value));
    }

    return filters?.[key]?.includes(value);
  };

  return (
    <Card>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleFilter();
        }}
      >
        <Card.Body>{children?.(handleParams, handleCheckboxInput)}</Card.Body>
        <Card.Footer>
          <Button
            size="lg"
            children={t("store.filter_results")}
            className="w-full"
            type="submit"
          />
        </Card.Footer>
      </Form>
    </Card>
  );
};

export default ProductFilters;

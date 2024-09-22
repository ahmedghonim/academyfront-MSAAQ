import { useState } from "react";

import { useTranslations } from "next-intl";

import FiltersSection from "@/components/filters/filters-section";
import StarsRating from "@/components/stars-rating";

import { Form, Typography } from "@msaaqcom/abjad";

const RatingFilter = ({ onChange, defaultValue }: { defaultValue: string; onChange: (value: string) => void }) => {
  const t = useTranslations();
  const [selectedRating, setSelectedRating] = useState<string>(defaultValue);

  return (
    <FiltersSection
      title={t("store.rating")}
      className="rating-filter-section"
      children={
        <>
          {[
            {
              id: "1",
              value: "4"
            },
            {
              id: "2",
              value: "3"
            },
            {
              id: "3",
              value: "2"
            }
          ].map((item) => (
            //@ts-ignore
            <Form.Radio
              key={item.id}
              id={item.id}
              name="rating"
              label={
                <div className="flex items-center gap-2">
                  <StarsRating
                    isReadOnly
                    value={+item.value}
                    size="sm"
                  />
                  <Typography.Body
                    size="md"
                    children={t("store.stars_count", { count: +item.value })}
                  />
                </div>
              }
              onChange={(e) => {
                const { value } = e.target;

                setSelectedRating(value);
                onChange(value);
              }}
              checked={selectedRating === item.value}
              value={item.value}
            />
          ))}
        </>
      }
    />
  );
};

export default RatingFilter;

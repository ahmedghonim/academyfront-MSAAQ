import { useTranslations } from "next-intl";

import { Form, Typography } from "@msaaqcom/abjad";

import FiltersSection from "./filters-section";

const PriceFilter = ({
  onChange,
  checked
}: {
  checked: (value: string) => boolean;
  onChange: (checked: boolean, value: any, key: string) => void;
}) => {
  const t = useTranslations();

  return (
    <FiltersSection
      title={t("store.price_title")}
      className="price-filter-section"
      children={[
        {
          id: "paid",
          value: "paid",
          label: "paid"
        },
        {
          id: "discounted",
          value: "discounted",
          label: "discounted"
        },
        {
          id: "free",
          value: "free",
          label: "free"
        }
      ].map((item) => (
        //@ts-ignore
        <Form.Checkbox
          key={item.id}
          id={item.id}
          label={
            <Typography.Text
              size="xs"
              className="text-gray-700"
              children={t(`store.price_${item.label}`)}
            />
          }
          onChange={(e) => {
            const { checked, value } = e.target;

            onChange(checked, value, "price");
          }}
          checked={checked(item.value)}
          value={item.value}
        />
      ))}
    />
  );
};

export default PriceFilter;

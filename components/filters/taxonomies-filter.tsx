import { useTranslations } from "next-intl";

import { useMarket } from "@/providers/store-market-provider";

import { Form, Typography } from "@msaaqcom/abjad";

import FiltersSection from "./filters-section";

const TaxonomiesFilter = ({
  onChange,
  checked
}: {
  checked: (value: string) => boolean;
  onChange: (checked: boolean, value: any, key: string) => void;
}) => {
  const t = useTranslations();
  const { taxonomies } = useMarket();

  if (!taxonomies) {
    return null;
  }

  return (
    <FiltersSection
      title={t("store.category")}
      className="category-filter-section"
      children={taxonomies.map((taxonomy) => (
        //@ts-ignore
        <Form.Checkbox
          key={taxonomy.id}
          id={taxonomy.name}
          label={
            <Typography.Text
              size="xs"
              className="text-gray-700"
              children={taxonomy.name}
            />
          }
          onChange={(e) => {
            const { checked, value } = e.target;

            onChange(checked, value, "category");
          }}
          checked={checked(taxonomy.id.toString())}
          value={taxonomy.id}
        />
      ))}
    />
  );
};

export default TaxonomiesFilter;

import { useTranslations } from "next-intl";

import { useMarket } from "@/providers/store-market-provider";

import { Form, Typography } from "@msaaqcom/abjad";

import FiltersSection from "./filters-section";

const CourseDifficultiesFilter = ({
  onChange,
  checked
}: {
  checked: (value: string) => boolean;
  onChange: (checked: boolean, value: any, key: string) => void;
}) => {
  const t = useTranslations();
  const { difficulties } = useMarket();

  if (!difficulties) {
    return null;
  }

  return (
    <FiltersSection
      title={t("store.level_title")}
      className="difficulty-filter-section"
      children={
        <>
          {difficulties.map((item, i) => (
            //@ts-ignore
            <Form.Checkbox
              key={item.id}
              id={item.name}
              label={
                <Typography.Text
                  size="xs"
                  className="text-gray-700"
                  children={item.name}
                />
              }
              onChange={(e) => {
                const { checked, value } = e.target;

                onChange(checked, value, "difficulty");
              }}
              checked={checked(item.id.toString())}
              value={item.id}
            />
          ))}
        </>
      }
    />
  );
};

export default CourseDifficultiesFilter;

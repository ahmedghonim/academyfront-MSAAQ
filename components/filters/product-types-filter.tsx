import { useTranslations } from "next-intl";

import { Badge, Form, Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

import FiltersSection from "./filters-section";

const ProductTypesFilter = ({
  onChange,
  checked
}: {
  checked: (value: string) => boolean;
  onChange: (checked: boolean, value: any, key: string) => void;
}) => {
  const t = useTranslations();

  return (
    <FiltersSection
      title={t("store.product_type_title")}
      className="product-type-filter-section"
      children={
        <>
          {[
            {
              id: "digital_product",
              value: "digital",
              label: "digital_product"
            },
            {
              id: "products_package",
              value: "bundle",
              label: "products_package"
            },
            {
              id: "sessions",
              value: "coaching_session",
              label: "sessions"
            },
            {
              id: "podcast",
              value: "podcast",
              label: "podcast"
            }
          ].map((item) => (
            //@ts-ignore
            <Form.Checkbox
              key={item.id}
              id={item.id}
              label={
                <>
                  <Typography.Text
                    size="xs"
                    className={cn("text-gray-700", item.label == "podcast" && "opacity-50")}
                    children={t(`store.product_type_${item.label}`)}
                  />
                  {item.label == "podcast" && (
                    <Badge
                      color="gray"
                      rounded="full"
                      children={t("common.soon")}
                      className="ms-2"
                    />
                  )}
                </>
              }
              disabled={item.label == "podcast"}
              className={cn(item.label == "podcast" && "opacity-50")}
              onChange={(e) => {
                const { checked, value } = e.target;

                onChange(checked, value, "type");
              }}
              checked={checked(item.value)}
              value={item.value}
            />
          ))}
        </>
      }
    />
  );
};

export default ProductTypesFilter;

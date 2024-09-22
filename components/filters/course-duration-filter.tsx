import { useTranslations } from "next-intl";

import { Form, Typography } from "@msaaqcom/abjad";

import FiltersSection from "./filters-section";

const CourseDurationFilter = ({
  onChange,
  checked
}: {
  checked: (value: any) => boolean;
  onChange: (checked: boolean, value: any, key: string) => void;
}) => {
  const t = useTranslations();

  return (
    <FiltersSection
      title={t("store.course_time_title")}
      className="course-duration-filter-section"
      children={
        <>
          {[
            {
              id: "one_hour",
              value: {
                from: "0",
                to: "60"
              },
              label: "0-1"
            },
            {
              id: "three_hours",
              value: {
                from: "60",
                to: "180"
              },
              label: "1-3"
            },
            {
              id: "other",
              value: {
                from: "180"
              },
              label: "3<"
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
                  children={t("store.course_time_time", { hour: item.label })}
                />
              }
              onChange={(e) => {
                const { checked } = e.target;

                onChange(checked, item.value, "duration");
              }}
              checked={checked(item.value)}
            />
          ))}
        </>
      }
    />
  );
};

export default CourseDurationFilter;

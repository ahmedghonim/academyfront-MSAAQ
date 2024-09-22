"use client";

import { useTranslations } from "next-intl";

import { Collapse, Typography } from "@msaaqcom/abjad";

const CourseOutcomes = ({ outcomes }: { outcomes: string[] }) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-4">
        {outcomes.slice(0, 4).map((item, index) => (
          <div
            className="rounded-lg bg-white p-4"
            key={`${item}-${index}`}
          >
            <Typography.Body
              as="h3"
              size="lg"
              className="font-normal"
            >
              {item}
            </Typography.Body>
          </div>
        ))}
      </div>
      {outcomes.slice(4).length > 0 && (
        <Collapse>
          {({ isOpen }) => (
            <>
              <Collapse.Content className="flex flex-col space-y-4">
                {outcomes.slice(4).map((item, index) => (
                  <div
                    className="rounded-lg bg-white p-4"
                    key={`${item}-${index}`}
                  >
                    <Typography.Body
                      as="h3"
                      size="lg"
                      className="font-normal"
                    >
                      {item}
                    </Typography.Body>
                  </div>
                ))}
              </Collapse.Content>
              <Collapse.Button className={isOpen ? "mt-4 rounded-lg bg-white p-4" : "rounded-lg bg-white p-4"}>
                <Typography.Body
                  as="h3"
                  size="lg"
                  className="font-bold text-primary"
                >
                  {isOpen ? t("course_page.collapse_content") : t("course_page.expand_content")}
                </Typography.Body>
              </Collapse.Button>
            </>
          )}
        </Collapse>
      )}
    </div>
  );
};

export default CourseOutcomes;

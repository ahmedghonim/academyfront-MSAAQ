"use client";

import { PageBlock } from "@/types";

import { ChevronDownIcon } from "@heroicons/react/24/solid";

import { Collapse, Icon, Typography } from "@msaaqcom/abjad";

import BaseSection from "./base-section";

export default function Faq({ block }: { block: PageBlock<"faq">; children?: React.ReactNode }) {
  return (
    <BaseSection block={block}>
      <div className="col-span-12 flex flex-col gap-2 lg:col-span-6 lg:col-start-4">
        {block.fields_values?.questions?.map((question, index) => (
          <Collapse
            className="rounded-lg border border-gray-300 bg-white px-4 py-2"
            key={index}
          >
            {({ isOpen }) => (
              <>
                <Collapse.Button className="bg-white px-0 py-2">
                  <div className="flex flex-grow flex-row justify-between">
                    <Typography.Text
                      size="sm"
                      className="font-semibold"
                    >
                      {question.title}
                    </Typography.Text>
                    <Icon
                      className={`${isOpen ? "rotate-180 transform" : ""}  transition-all duration-300 ease-in-out`}
                    >
                      <ChevronDownIcon />
                    </Icon>
                  </div>
                </Collapse.Button>
                <Collapse.Content
                  className="prose prose-sm prose-stone sm:prose-base max-w-full"
                  dangerouslySetInnerHTML={{ __html: question.content }}
                />
              </>
            )}
          </Collapse>
        ))}
      </div>
    </BaseSection>
  );
}
